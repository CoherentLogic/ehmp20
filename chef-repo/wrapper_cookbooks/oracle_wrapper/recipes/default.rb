#
# Cookbook Name:: oracle_wrapper
# Recipe:: default
#

include_recipe "oracle_wrapper::set_attributes"
include_recipe "oracle_wrapper::create_secret"
include_recipe "oracle_wrapper::packages"

include_recipe "oracle"

# this recipe replaces oracle::dbbin, which we prevent from being included by the default recipe with an attribute
include_recipe "oracle_wrapper::install"

include_recipe "oracle::logrotate_alert_log"
include_recipe "oracle::logrotate_listener"

# this recipe replaces oracle::createdb
include_recipe "oracle_wrapper::create_dbs"

include_recipe "oracle_wrapper::env_vars"
