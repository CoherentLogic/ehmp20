#
# Cookbook Name:: ehmp_provisioner
# Attributes:: asu
#

default[:ehmp_provision][:asu][:copy_files] = {}

#######################################################################################################################
# asu specific aws configuration options
default[:ehmp_provision][:asu][:aws][:instance_type] ="m3.medium"
default[:ehmp_provision][:asu][:aws][:subnet] = "subnet-213b2256"
default[:ehmp_provision][:asu][:aws][:ssh_username] = "ec2-user"
default[:ehmp_provision][:asu][:aws][:ssh_keyname] = "vagrantaws_c82a142d5205"
default[:ehmp_provision][:asu][:aws][:ssh_key_path] = "#{ENV['HOME']}/Projects/vistacore/.chef/keys/#{node[:ehmp_provision][:asu][:aws][:ssh_keyname]}"
#######################################################################################################################

#######################################################################################################################
# asu specific vagrant configuration options
default[:ehmp_provision][:asu][:vagrant][:ip_address] = "IPADDRES"
default[:ehmp_provision][:asu][:vagrant][:provider_config] = {
  :memory => 512,
  :cpus => 2
}
default[:ehmp_provision][:asu][:vagrant][:shared_folders] = []
#######################################################################################################################
