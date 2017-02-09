#
# Cookbook Name:: ehmp-ui
#

default[:ehmp_ui][:recipe] = 'unzipLocalApplet'
default[:ehmp_ui][:applet] = nil
default[:ehmp_ui][:aws][:tag_name] = "ehmp-ui"
default[:ehmp_ui][:aws][:elastic_ip] = nil
default[:ehmp_ui][:manifest_path] = "/tmp/manifest.json"
default[:ehmp_ui][:rdkip] = nil
default[:ehmp_ui][:home_dir] = nil
default[:ehmp_ui][:manifest][:versions] = {}
default[:ehmp_ui][:manifest][:overall_version] = "unknown"
