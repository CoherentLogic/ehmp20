#
# Cookbook Name:: workstation
# Recipe:: phantomjs_osx
#

version = node[:workstation][:phantomjs_osx][:version]

directory "/var/chef/cache" do
  recursive true
end

remote_file "/var/chef/cache/phantomjs-#{version}-macosx.zip" do
  source "https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-#{version}-macosx.zip"
  checksum node[:workstation][:phantomjs_osx][:sha_sum]
  notifies :run, 'execute[unzip phantomjs]', :immediately
end

execute 'unzip phantomjs' do
  cwd "/opt/"
  command "unzip -o /var/chef/cache/phantomjs-#{version}-macosx.zip"
  action :run
end

link '/usr/local/bin/phantomjs' do
  to "/opt/phantomjs-#{version}-macosx/bin/phantomjs"
  link_type :symbolic
end

link '/usr/bin/phantomjs' do
  action :delete
  only_if { ::File.exists?('/usr/local/bin/phantomjs') }
end

