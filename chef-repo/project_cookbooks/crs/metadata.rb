name             'crs'
maintainer       'YOUR_COMPANY_NAME'
maintainer_email 'YOUR_EMAIL'
license          'All rights reserved'
description      'Installs/Configures crs'
long_description IO.read(File.join(File.dirname(__FILE__), 'README.md'))
version          "2.0.4"

#############################
# wrapper_cookbook
#############################
depends "java_wrapper", "2.0.5"
