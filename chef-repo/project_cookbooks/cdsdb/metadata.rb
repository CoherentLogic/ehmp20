name						 "cdsdb"
maintainer       "Agilex"
maintainer_email "team-milkyway@vistacore.us"
license          "All rights reserved"
description      "Installs/Configures cdsdb"
long_description IO.read(File.join(File.dirname(__FILE__), 'README.md'))
version          "2.0.5"

supports "centos"

#############################
# 3rd party
#############################

#############################
# wrapper_cookbook
#############################
depends "mongodb-wrapper", "2.0.4"
