default[:vista][:client][:version] = "2016.04.21"
default[:vista][:client][:url] = "#{node[:nexus_url]}/nexus/content/repositories/filerepo/vistacore/vista-clients/#{node[:vista][:client][:version]}/vista-clients-#{node[:vista][:client][:version]}.zip"
default[:vista][:client][:studio][:version] = "2015.1.0.429.0"
default[:vista][:client][:studio][:url] = "#{node[:nexus_url]}/nexus/content/repositories/filerepo/third-party/project/intersystems/cache-studio/#{node[:vista][:client][:studio][:version]}/cache-studio-#{node[:vista][:client][:studio][:version]}.exe"
