#
# Author:: Joshua Timberman <opensource@housepub.org>
# Copyright (c) 2013-2014, Joshua Timberman
# License:: Apache License, Version 2.0
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

# due to changes of download and checksum urls on vagrant's side, the compilation of the helper methods below fail
# since we are overriding these values anyway, we can just comment these lines out
# default['vagrant']['version']     = '1.6.5'
# default['vagrant']['url']         = vagrant_package_uri(node['vagrant']['version'])
# default['vagrant']['checksum']    = vagrant_sha256sum(node['vagrant']['version'])
default['vagrant']['plugins']     = []
default['vagrant']['msi_version'] = ''
