name             'machine'
maintainer       'Vistacore'
maintainer_email 'Vistacore@vistacore.us'
license          'All rights reserved'
description      'Installs/Configures machine'
long_description IO.read(File.join(File.dirname(__FILE__), 'README.md'))
version          "2.0.29"

depends "common", "2.0.10"

depends "packages", "2.0.6"
depends "role_cookbook", "2.0.8"
