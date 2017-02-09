When(/^the client performs a fullName search through RDK API with search term "(.*?)"$/) do |name|
  temp = SearchRDK.new
  temp.add_parameter("fullName", name)
  @response = HTTParty.get(temp.path)
end

When(/^the client performs a fullName search through RDK API with search term "(.*?)" and the startIndex (\d+)$/) do |name, start_index|
  temp = SearchRDK.new
  temp.add_parameter("fullName", name)
  temp.add_parameter("startIndex", start_index)
  @response = HTTParty.get(temp.path)
end

When(/^the client performs a fullName search through RDK API with search term "(.*?)" and the limit (\d+)$/) do |name, limit|
  temp = SearchRDK.new
  temp.add_parameter("fullName", name)
  temp.add_parameter("itemsPerPage", limit)

  @response = HTTParty.get(temp.path)
end

When(/^the client performs a fullName summary search through RDK API with search term "(.*?)" and the startIndex (\d+)$/) do |name, start_index|
  temp = SearchRDK.new
  temp.add_parameter("fullName", name)
  temp.add_parameter("startIndex", start_index)
  temp.add_parameter("resultsRecordType", "summary")
  @response = HTTParty.get(temp.path)
end

When(/^the client performs a fullName  summary search through RDK API with search term "(.*?)" and the limit (\d+)$/) do |name, limit|
  temp = SearchRDK.new
  temp.add_parameter("fullName", name)
  temp.add_parameter("itemsPerPage", limit)
  temp.add_parameter("resultsRecordType", "summary")

  @response = HTTParty.get(temp.path)
end

When(/^the client performs a fullName summary search through RDK API with search term "(.*?)"$/) do |name|
  temp = SearchRDK.new
  temp.add_parameter("fullName", name)
  temp.add_parameter("resultsRecordType", "summary")
  @response = HTTParty.get(temp.path)
end

Then(/^the RDK results contain (\d+) items per page$/) do |num_items|
  json_object = JSON.parse(@response.body)
  total_results = json_object["data"]["itemsPerPage"]
  expect(total_results).to eq(num_items.to_i)
end

Then(/^the RDS results contain (\d+) total pages$/) do |num_pages|
  json_object = JSON.parse(@response.body)
  total_results = json_object["data"]["totalPages"]
  expect(total_results).to eq(num_pages.to_i)
end
Then(/^the client receives (\d+) RDK VistA result\(s\)$/) do |num_results|
  json_object = JSON.parse(@response.body)
  total_results = json_object["data"]["totalItems"]
  expect(total_results).to eq(num_results.to_i)
end

Then(/^the RDK search results does not contain$/) do |table|
  @json_object = JSON.parse(@response.body)
  json_verify = JsonVerifier.new

  result_array = @json_object["data"]["items"]
  table.rows.each do | field |
    expect(json_verify.not_defined?(field, result_array)).to be_true, "Expected field #{field} to not exist in this json"
  end #table
end

Then(/^the RDK search results contain$/) do |table|
  dateformat = /\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d-\d\d:\d\d/

  @json_object = JSON.parse(@response.body)
  json_verify = JsonVerifier.new

  result_array = @json_object["data"]["items"]
  table.rows.each do | fieldpath, fieldvaluestring |
    json_verify.reset_output
    if fieldvaluestring.eql? "IS_FORMATTED_DATE"
      found = json_verify.matches_date_format(fieldpath, dateformat, result_array)
    elsif fieldvaluestring.eql? "IS_SET"
      found = json_verify.defined?([fieldpath], result_array)
    elsif fieldvaluestring.start_with? "CONTAINS"
      term = fieldvaluestring.split(' ')
      fieldvalue = [term[1]]
      found = json_verify.object_contains_partial_value(fieldpath, fieldvalue, result_array)
    else
      found = json_verify.build_subarray(fieldpath, fieldvaluestring, result_array)
      result_array = json_verify.subarry
    end

    # p "subarray #{found} #{fieldvaluestring} #{json_verify.subarry.length}"
    # p "------------------------"
    if found == false
      # output = json_verify.output()
      # output.each do | msg|
      # p msg
      # end #output.each
      puts json_verify.error_message
      #
    end # if found == false
    expect(found).to be_true
    expect(result_array.length).to_not eq(0)
  end # table.rows.each
end

Then(/^the RDK results contain the substring "(.*?)"$/) do |subst|
  json = JSON.parse(@response.body)
  output_string = ""

  fieldsource = "data.items.displayName"
  steps_source = fieldsource.split('.')

  source_allvalues = []

  json_verify = JsonVerifier.new
  json_verify.save_all_values_of_path(0, steps_source, json, output_string, source_allvalues)

  pattern = /#{subst}/

  found_subst = false
  source_allvalues.each do | name |
    contains_pattern = pattern.match(name)
    found_subst = true unless contains_pattern.nil?
  end
  expect(found_subst).to be_true
end
