#
# Cookbook Name:: ehmp_provisioner
# Attributes:: solr
#

default[:ehmp_provision][:solr][:copy_files] = {}

#######################################################################################################################
# solr specific aws configuration options
default[:ehmp_provision][:solr][:aws][:instance_type] = "m3.medium"
default[:ehmp_provision][:solr][:aws][:subnet] = "subnet-213b2256"
default[:ehmp_provision][:solr][:aws][:ssh_username] = "ec2-user"
default[:ehmp_provision][:solr][:aws][:ssh_keyname] = "vagrantaws_c82a142d5205"
default[:ehmp_provision][:solr][:aws][:ssh_key_path] = "#{ENV['HOME']}/Projects/vistacore/.chef/keys/#{node[:ehmp_provision][:solr][:aws][:ssh_keyname]}"
#######################################################################################################################

#######################################################################################################################
# solr specific vagrant configuration options
default[:ehmp_provision][:solr][:vagrant][:ip_address] = "IPADDRESS"
default[:ehmp_provision][:solr][:vagrant][:provider_config] = {
  :memory => 512,
  :cpus => 2
}
default[:ehmp_provision][:solr][:vagrant][:shared_folders] = []
#######################################################################################################################
