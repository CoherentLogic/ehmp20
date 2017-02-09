#
# Cookbook Name:: vxsync
# Recipe:: base_line
#

include_recipe 'java_wrapper'

include_recipe 'build-essential'

include_recipe 'nodejs_wrapper'

yum_package 'beanstalkd' do
  version node[:vxsync][:beanstalk_version]
  action :install
end

include_recipe "bluepill_wrapper"
