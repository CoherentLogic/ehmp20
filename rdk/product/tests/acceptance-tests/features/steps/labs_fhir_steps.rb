path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../helper', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require 'VerifyJsonRuntimeValue.rb'

#lab (Chem/Hem) and (MI) >> E102 - ONEHUNDREDSIXTEEN,PATIENT - 11016
#lab (Cyto) >> E103 - ZZZRETSIXTWENTYEIGHT,PATIENT - B362;230
#lab (Sp) and (Em) >> E? - ZZZRETFIVEFIFTYONE,PATIENT - B362;1

When(/^the client requests lab "(.*?)" results for that patient "(.*?)"$/) do |_not_used, pid|
  base_url = DefaultLogin.rdk_fetch_url
  path = "#{base_url}/resource/fhir/patient/#{pid}/DiagnosticReport?domain=lab&_ack=true"
  p path
  @response = HTTPartyRDK.get(path)
end

Then(/^the lab field\(s\) just contain "(.*?)"$/) do |expected_value, table|
  @json_object = JSON.parse(@response.body)
  result_array = @json_object["entry"]

  json_verify = VerifyJsonRuntimeValue.new
  json_verify.verify_json_runtime_just_contain_expected_value(result_array, table, expected_value)
end

Then(/^the results contain lab "(.*?)" results$/) do |_not_used, table|
  @json_object = JSON.parse(@response.body)
  result_array = @json_object["entry"]

  json_verify = VerifyJsonRuntimeValue.new
  json_verify.verify_json_runtime_value(result_array, table)
end

When(/^the client requests "(.*?)" results for that patient "(.*?)"$/) do |_not_used, pid|
  base_url = DefaultLogin.rdk_fetch_url
  path = "#{base_url}/resource/fhir/patient/#{pid}/DiagnosticReport?service=SP,CP,OTH&_ack=true"
  p path
  @response = HTTPartyRDK.get(path)
end

When(/^the client requests "(.*?)" "(.*?)" results for that patient "(.*?)" in FHIR format$/) do |limit, _not_used, pid|
  base_url = DefaultLogin.rdk_fetch_url
  path = "#{base_url}/resource/fhir/patient/#{pid}/DiagnosticReport?service=SP,CP,OTH&_ack=true&_count=" + limit
  p path
  @response = HTTPartyRDK.get(path)
end

When(/^the client requests "(.*?)" lab "(.*?)" results for that patient "(.*?)" in FHIR format$/) do |limit, _not_used, pid|
  base_url = DefaultLogin.rdk_fetch_url
  path = "#{base_url}/resource/fhir/patient/#{pid}/DiagnosticReport?domain=lab&_ack=true&_count=" + limit
  p path
  @response = HTTPartyRDK.get(path)
end
