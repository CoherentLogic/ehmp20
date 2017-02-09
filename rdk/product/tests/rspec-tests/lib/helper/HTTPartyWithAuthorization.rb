require "httparty"

path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require "DefaultLogin.rb"
require "TestSupport.rb"
require "DomAccess.rb"
require "PatientPickerDomElements.rb"

# Call HTTParty with hardcoded Authorization
class HTTPartyWithAuthorization
  include HTTParty

  # Authorization header is Base64 encoding of "9E7A;500:pu1234;pu1234!!"
  #@@header = { 'Authorization' => 'Basic OUU3QTs1MDA6cHUxMjM0O3B1MTIzNCEh' }
  @@time_start = Time.new
  @@time_done = Time.new
  @@default_timeout = 420
  @@authParam = { :accessCode => "pu1234", :verifyCode => "pu1234!!", :site => "9E7A" }

  def self.time_elapsed_last_call
    return @@time_done - @@time_start
  end

  def self.post_with_authorization(path)
    @@time_start = Time.new
    directory = post(path, { :verify => false, :query => @@authParam, :timeout => @@default_timeout })
    @@time_done = Time.new
    log_id = directory.headers['logid']
    p "logId: #{log_id}" if log_id
    return directory
  end

  def self.get_with_authorization(path)
    @@time_start = Time.new
    directory = get(path, { :verify => false, :query => @@authParam, :timeout => @@default_timeout })
    @@time_done = Time.new
    log_id = directory.headers['logid']
    p "logId: #{log_id}" if log_id
    return directory
  end
end

if __FILE__ == $PROGRAM_NAME
  p '-------- WAS HERE -----------'

  base_url = DefaultLogin.hmp_url
  path = "#{base_url}/sync/loadOperationalData?domain=Allergy"

  p "Posting-------------------"
  p HTTPartyWithAuthorization.post_with_authorization(path)

  p "Getting-------------------"
  path = "#{base_url}/sync/operationalSyncStatus"
  p HTTPartyWithAuthorization.get_with_authorization(path)

end
