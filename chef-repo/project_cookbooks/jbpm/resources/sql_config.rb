actions :execute
default_action :execute

attribute :name, :kind_of => String, :required => true, :name_attribute => true
attribute :config_dir, :kind_of => String, :required => true
