#
# Cookbook Name:: cdsinvocation
# Recipe:: default
#

include_recipe "java_wrapper"

include_recipe "tomcat"

include_recipe "cdsinvocation::configure_war"

include_recipe "cdsinvocation::deploy_artifacts"
