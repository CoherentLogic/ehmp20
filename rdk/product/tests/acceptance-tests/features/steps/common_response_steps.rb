Then(/^a created response is returned$/) do
  expect(@response.code).to eq(201), "response code was #{@response.code}: response body #{@response.body}"
end

Then(/^a successful response is returned$/) do
  expect(@response.code).to eq(200), "response code was #{@response.code}: response body #{@response.body}"
end

Then(/^a accepted response is returned$/) do
  expect(@response.code).to eq(202), "response code was #{@response.code}: response body #{@response.body}"
end

Then(/^a no-content response is returned$/) do
  expect(@response.code).to eq(204), "response code was #{@response.code}: response body #{@response.body}"
end

Then(/^an unauthorized response is returned$/) do
  expect(@response.code).to eq(401), "response code was #{@response.code}: response body #{@response.body}"
end

Then(/^a bad request response is returned$/) do
  expect(@response.code).to eq(400), "response code was #{@response.code}: response body #{@response.body}"
end

Then(/^a forbidden response is returned$/) do
  expect(@response.code).to eq(403), "response code was #{@response.code}: response body #{@response.body}"
end

Then(/^a non-found response is returned$/) do
  expect(@response.code).to eq(404), "response code was #{@response.code}: response body #{@response.body}"
end

Then(/^a not-found response is returned$/) do
  expect(@response.code).to eq(404), "response code was #{@response.code}: response body #{@response.body}"
end

Then(/^a not acceptable response is returned$/) do
  expect(@response.code).to eq(406), "response code was #{@response.code}: response body #{@response.body}"
end

Then(/^a unprocessible response is returned$/) do
  expect(@response.code).to eq(422), "response code was #{@response.code}: response body #{@response.body}"
end

Then(/^a temporary redirect response is returned$/) do
  expect(@response.code).to eq(307), "response code was #{@response.code}: response body #{@response.body}"
end

Then(/^a permanent redirect response is returned$/) do
  expect(@response.code).to eq(308), "response code was #{@response.code}: response body #{@response.body}"
end

Then(/^a internal server error response is returned$/) do
  expect(@response.code).to eq(500), "response code was #{@response.code}: response body #{@response.body}"
end

Then(/^a internal server error response or a bad request response is returned$/) do
  valid_error_code = false
  if @response.code == 400 || @response.code == 500
    valid_error_code = true
  end
  expect(valid_error_code).to eq(true), "response code was #{@response.code}: response body #{@response.body}"
end

Then(/^the VPR results contain$/) do |table|
  @json_object = JSON.parse(@response.body)
  json_verify = JsonVerifier.new
  result_array = @json_object["data"]["items"]
  search_json(result_array, table)
end

Then(/^the client receives (\d+) result\(s\)$/) do |number_of_results|
  num_results_int = number_of_results.to_i
  json = JSON.parse(@response.body)

  query_results = json["data"]["totalItems"]
  expect(query_results).to eq(num_results_int), "recieved incorrect value for totalItems: expected #{num_results_int} received #{query_results}"

  query_results = json["data"]["currentItemCount"]
  expect(query_results).to eq(num_results_int), "recieved incorrect value for currentItemCount: expected #{num_results_int} received #{query_results}"

  query_results = json["data"]["items"]
  expect(query_results.length).to eq(num_results_int)
end

Then(/^the client receives( at least)? (\d+) VPR VistA result\(s\)$/) do |at_least, number_of_results|
  json = JSON.parse(@response.body)
  output_string = ''

  fieldsource = 'data.items.uid'
  steps_source = fieldsource.split('.')

  source_allvalues = []

  json_verify = JsonVerifier.new
  json_verify.save_all_values_of_path(0, steps_source, json, output_string, source_allvalues)

  num_vista_results = 0
  source_panorama = /urn:va:.*:9E7A/
  source_kodak = /urn:va:.*:C877/
  source_allvalues.each do |value|
    unless source_panorama.match(value).nil?
      num_vista_results += 1
    end
    unless source_kodak.match(value).nil?
      num_vista_results += 1
    end
  end

  fieldsource = 'data.items.pid'
  steps_source = fieldsource.split('.')

  source_allvalues = []

  json_verify = JsonVerifier.new
  json_verify.save_all_values_of_path(0, steps_source, json, output_string, source_allvalues)

  source_panorama = /9E7A;*/
  source_kodak = /C877;*/
  source_allvalues.each do |value|
    unless source_panorama.match(value).nil?
      num_vista_results += 1
    end
    unless source_kodak.match(value).nil?
      num_vista_results += 1
    end
  end  

  if at_least.nil?
    expect(num_vista_results).to eq(number_of_results.to_i)
  else
    expect(num_vista_results).to be >= (number_of_results.to_i)
  end
end
