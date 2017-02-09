path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
#require 'VerifyJsonRuntimeValue.rb'

When(/^the client requests authentication with accessCode "(.*?)" and verifyCode "(.*?)" and site "(.*?)" and contentType "(.*?)"$/) do |accessCode, verifyCode, site, _contentType|
  auth_details = {}
  auth_details[:site] = site
  auth_details[:accessCode] = accessCode
  auth_details[:verifyCode] = verifyCode
  @response = HTTPartyRDK.acquire_tokens(auth_details)
end

Then(/^the authentication result contains$/) do |table|
  @json_object = JSON.parse(@response.body)
  json_verify = JsonVerifier.new
  result_array = []
  result_array.push(@json_object["data"])
  search_json(result_array, table)
end
