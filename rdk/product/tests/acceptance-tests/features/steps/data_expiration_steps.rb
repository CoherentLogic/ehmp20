path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require 'VerifyJsonRuntimeValue.rb'

When(/^the client requests manual expiration time "(.*?)" for patient with pid "(.*?)" and site "(.*?)"$/) do |time, pid, site_name|
  # http://IP_ADDRESS:PORT/sync/expire?pid=11016V630869&vistaId=CDS&time=20140916170917.123
  # path = QueryRDKSync.new("expirepatientdata", pid)
  path = RDKQuery.new('synchronization-expirepatientdata')
  path.add_parameter("pid", pid)
  path.add_parameter("vistaId", site_name)
  path.add_parameter("time", time)
  p path.path
  
  user = "9E7A;500"
  pass = "PW;PW"
  begin
    @response = HTTPartyRDK.post(path.path)
  rescue Timeout::Error
    p "Sync timed out"
  end
end

Then(/^the sync status for patient contain:$/) do |table|
  @json_object = JSON.parse(@response.body)
  result_array = @json_object["data"]["items"]

  json_verify = VerifyJsonRuntimeValue.new
  json_verify.verify_json_runtime_value(result_array, table)
end
