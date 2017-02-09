#
# Cookbook Name:: vxsync
# Recipe:: deploy_vxsync
#

remote_file "#{node[:vxsync][:artifact_path]}" do
  use_conditional_get true
  source node[:vxsync][:source]
  mode   "0755"
  #checksum open("#{node[:vxsync][:source]}.sha1", { ssl_verify_mode: OpenSSL::SSL::VERIFY_NONE }).string
  notifies :delete, "directory[#{node[:vxsync][:home_dir]}]", :immediately
end

directory node[:vxsync][:home_dir] do
  owner  'root'
  group  'root'
  mode "0755"
  recursive true
  action :create
end

execute "install modules" do
  cwd node[:vxsync][:home_dir]
  command "npm install"
  action :nothing
  not_if { "#{node[:vxsync][:source]}".start_with?("http") }
end

execute "npm run install on xslt4node java" do
  cwd "#{node[:vxsync][:home_dir]}/node_modules/xslt4node/node_modules/java"
  command "npm run install"
  action :nothing
  not_if { "#{node[:vxsync][:source]}".start_with?("http") }
end

execute "extract_vxsync" do
  cwd node[:vxsync][:home_dir]
  command "unzip #{node[:vxsync][:artifact_path]}"
  action :run
  notifies :run, "execute[install modules]", :immediately
  notifies :run, "execute[npm run install on xslt4node java]", :immediately
  notifies :execute, "vxsync_reset_sync[reset_vxsync]", :delayed
  only_if { (Dir.entries(node[:vxsync][:home_dir]) - %w{ . .. }).empty? }
end

sites = find_multiple_nodes_by_role("vista-*", node[:stack])
jds = find_node_by_role("jds", node[:stack])
solr = find_node_by_role("solr", node[:stack], "mocks")
jmeadows = find_node_by_role("jmeadows", node[:stack], "mocks")
hdr_sites = find_multiple_nodes_by_role("hdr", node[:stack], "mocks")
vxsync = find_node_by_role("vxsync", node[:stack])

template "#{node[:vxsync][:home_dir]}/worker-config.json" do
  source 'worker-config.json.erb'
  variables(
    :vista_sites => sites,
    :vxsync => vxsync,
    :jds => jds,
    :solr => solr,
    :soap_handler => node[:soap_handler],
    :hdr_sites => hdr_sites,
    :jmeadows => jmeadows,
    :hdr_enabled => node[:vxsync][:hdr_enabled],
    :jmeadows_enabled => node[:vxsync][:jmeadows_enabled],
    :vler_enabled => node[:vxsync][:vler_enabled],
    :hdr_blacklist_sites => node[:vxsync][:hdr_blacklist_sites]
  )
  owner 'root'
  group 'root'
  mode '0755'
  notifies :execute, "vxsync_reset_sync[reset_vxsync]", :delayed
end

directory "#{node[:vxsync][:log_directory]}" do
  owner 'root'
  group 'root'
  mode '0755'
  recursive true
  action :create
end

directory "#{node[:vxsync][:bluepill_log_dir]}" do
  owner  'root'
  group  'root'
  mode "0755"
  action :create
end

directory "#{node[:vxsync][:persistence_dir]}" do
  owner 'root'
  group 'root'
  mode '0755'
  action :create
end

sites.each do |site|
  node.default[:vxsync][:processes]["pollerHost-#{site['vista']['site_id']}".to_sym] = {
      :template => "poller_host.sh.erb",
      :config => {
        :site => site['vista']['site_id']
      },
  }
end

hdr_sites.each do |hdr_site|
  hdr_site[:hdr][:hdr_sites].each do |site|
    node.default[:vxsync][:processes]["pollerHost-#{site['site_id']}".to_sym] = {
        :template => "poller_host.sh.erb",
        :config => {
          :site => site['site_id']
        },
    }
  end
end

node[:vxsync][:processes].each{ |name,process_block|
  1.upto(process_block[:number_of_copies] || 1) do |index|
    if index==1 then suffix = "" else suffix = "_#{index}" end
    template "#{node[:vxsync][:home_dir]}/#{name}#{suffix}.sh" do
      source process_block[:template]
      variables(
        :name => "#{name}#{suffix}",
        :options => process_block[:config],
        :process_log => "#{node[:vxsync][:log_directory]}/#{name}#{suffix}.log"
      )
      owner 'root'
      group 'root'
      mode '0755'
      notifies :execute, "vxsync_reset_sync[reset_vxsync]", :delayed
    end
  end
}

template "/etc/init/vxsync.conf" do
  variables(
    :name => "vxsync",
    :level => 2345
  )
  source 'upstart-bluepill-vxsync.erb'
  notifies :execute, "vxsync_reset_sync[reset_vxsync]", :delayed
end

template "/etc/bluepill/vxsync.pill" do
  source 'bluepill.pill.erb'
  variables(
    :name => "vxsync",
    :processes => node[:vxsync][:processes],
    :working_directory => node[:vxsync][:home_dir],
    :log_directory => node[:vxsync][:bluepill_log_dir]
  )
  notifies :execute, "vxsync_reset_sync[reset_vxsync]", :delayed
end 

node[:vxsync][:beanstalk_processes].each{ |name, process_block|
  template "#{node[:vxsync][:home_dir]}/#{name}.sh" do
    source process_block[:template]
    variables(
      :name => name,
      :options => process_block[:config],
      :process_log => "#{node[:vxsync][:log_directory]}/#{name}.log"
    )
    owner 'root'
    group 'root'
    mode '0755'
    notifies :execute, "vxsync_reset_sync[reset_vxsync]", :delayed
  end
}

template "/etc/init/beanstalk.conf" do
  variables(
    :name => "beanstalk",
    :level => 2345
  )
  source 'upstart-bluepill.erb'
  notifies :execute, "vxsync_reset_sync[reset_vxsync]", :delayed
end

template "/etc/bluepill/beanstalk.pill" do
  source 'bluepill.pill.erb'
  variables(
    :name => "beanstalk",
    :processes => node[:vxsync][:beanstalk_processes],
    :working_directory => node[:vxsync][:home_dir],
    :log_directory => node[:vxsync][:bluepill_log_dir]
  )
  notifies :execute, "vxsync_reset_sync[reset_vxsync]", :delayed
end

service "vxsync" do
  provider Chef::Provider::Service::Upstart
  restart_command "/sbin/stop vxsync; /sbin/start vxsync"
  action [:enable]
end

service "beanstalk" do
  provider Chef::Provider::Service::Upstart
  restart_command "/sbin/stop beanstalk; /sbin/start beanstalk"
  action [:enable]
end
