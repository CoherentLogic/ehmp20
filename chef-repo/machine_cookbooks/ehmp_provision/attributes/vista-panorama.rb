#
# Cookbook Name:: ehmp_provisioner
# Attributes:: vista-panorama
#

default[:ehmp_provision][:'vista-panorama'][:copy_files] = {}

#######################################################################################################################
# vista-panorama specific aws configuration options
default[:ehmp_provision][:'vista-panorama'][:aws][:instance_type] = "m3.medium"
default[:ehmp_provision][:'vista-panorama'][:aws][:subnet] = "subnet-213b2256"
default[:ehmp_provision][:'vista-panorama'][:aws][:ssh_username] = "ec2-user"
default[:ehmp_provision][:'vista-panorama'][:aws][:ssh_keyname] = "vagrantaws_c82a142d5205"
default[:ehmp_provision][:'vista-panorama'][:aws][:ssh_key_path] = "#{ENV['HOME']}/Projects/vistacore/.chef/keys/#{node[:ehmp_provision][:'vista-panorama'][:aws][:ssh_keyname]}"
#######################################################################################################################

#######################################################################################################################
# vista-panorama specific vagrant configuration options
default[:ehmp_provision][:'vista-panorama'][:vagrant][:ip_address] = "IP_ADDRESS"
default[:ehmp_provision][:'vista-panorama'][:vagrant][:provider_config] = {}
default[:ehmp_provision][:'vista-panorama'][:vagrant][:shared_folders] = []
#######################################################################################################################
