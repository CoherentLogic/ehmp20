#
# Cookbook Name:: nokogiri
# Recipe:: chefgem
#
# Author:: Greg Hellings (<greg@thesub.net>)
# 
# 
# Copyright 2014, B7 Interactive, LLC
# 
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
# 
#     http://www.apache.org/licenses/LICENSE-2.0
# 
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

include_recipe 'build-essential'
include_recipe 'libxml2'
case node['platform_family']
when 'debian'
	include_recipe "apt"
	package 'zlib1g-dev' do
  		action :nothing
	end.run_action(:install)
when 'rhel'
	include_recipe "yum"
end
chef_gem "nokogiri" do
  options node['nokogiri']['options']
  version node['nokogiri']['version']
  compile_time true if Chef::Resource::ChefGem.instance_methods(false).include?(:compile_time)
end
