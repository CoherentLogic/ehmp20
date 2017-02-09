#
# Cookbook Name:: ehmp_provision
# Recipe:: pjds
#

chef_gem "chef-provisioning-ssh"
require 'chef/provisioning/ssh_driver'

############################################## Artifact Versions #############################################
jds_version = ENV['JDS_VERSION']
jds_data_version = ENV['JDS_DATA_VERSION']
############################################## Artifact Versions #############################################

if node[:machine][:driver] == "ssh"
  delete_stores = false
else
  delete_stores = true
end

machine_ident = "pjds"

boot_options = node[:ehmp_provision][machine_ident.to_sym]["#{node[:machine][:driver]}".to_sym]
node.default[:ehmp_provision][:pjds][:copy_files].merge!(node[:machine][:copy_files])

if ENV.has_key?("NO_RESET")
  reset = false
elsif node[:machine][:driver] == "ssh" && !node[:mocked_data_servers]
  reset = false
else
  reset = true
end

machine_deps = parse_dependency_versions "machine"
ehmp_deps = parse_dependency_versions "ehmp_provision"

r_list = []
r_list << "recipe[packages::enable_internal_sources@#{machine_deps["packages"]}]"
r_list << "recipe[packages::disable_external_sources@#{machine_deps["packages"]}]" unless node[:machine][:allow_web_access]
r_list << "recipe[role_cookbook::#{node[:machine][:driver]}@#{machine_deps["role_cookbook"]}]"
r_list << "role[pjds]"
r_list << "recipe[jds::reset_sync@#{ehmp_deps["jds"]}]" if reset
r_list << "recipe[jds@#{ehmp_deps["jds"]}]"
r_list << "recipe[jds::pjds@#{ehmp_deps["jds"]}]"
r_list << "recipe[packages::upload@#{machine_deps["packages"]}]" if node[:machine][:cache_upload]

machine_boot "boot #{machine_ident} machine to the #{node[:machine][:driver]} environment" do
  machine_name machine_ident
  boot_options boot_options
  driver node[:machine][:driver]
  action node[:machine][:driver]
  only_if { node[:machine][:production_settings][machine_ident.to_sym].nil? }
end

# if the driver is 'vagrant', append -node- after the machine identify and before the stack name; else use only machine-stack
machine_name = node[:machine][:driver] == "vagrant" ? "#{machine_ident}-#{node[:machine][:stack]}-node" : "#{machine_ident}-#{node[:machine][:stack]}"
machine machine_name do
  driver "ssh"
  converge node[:machine][:converge]
  machine_options lazy {
    {
      :transport_options => {
        :ip_address => node[:machine][:production_settings][machine_ident.to_sym][:ip],
        :username => node[:machine][:production_settings][machine_ident.to_sym][:ssh_username],
        :ssh_options => {
          :keys => [
            node[:machine][:production_settings][machine_ident.to_sym][:ssh_key]
          ],
        },
        :options => {
          :prefix => 'sudo ',
        }
      },
      :convergence_options => node[:machine][:convergence_options]
    }
  }
  attributes(
    stack: node[:machine][:stack],
    nexus_url: node[:common][:nexus_url],
    data_bag_string: node[:common][:data_bag_string],
    jds: {
      source: artifact_url(node[:ehmp_provision][:artifacts][:jds]),
      jds_data: {
        source: artifact_url(node[:ehmp_provision][:artifacts][:jds_data]),
        delete_stores: delete_stores
      }
    },
    beats: {
      logging: node[:machine][:logging]
    }
  )
  files lazy { node[:ehmp_provision][:pjds][:copy_files] }
  chef_environment node[:machine][:environment]
  run_list r_list
  action node[:machine][:action]
end

chef_node machine_name do
  action :delete
  only_if {
    node[:machine][:action].eql?("destroy") && node[:machine][:driver].eql?("vagrant")
  }
end
