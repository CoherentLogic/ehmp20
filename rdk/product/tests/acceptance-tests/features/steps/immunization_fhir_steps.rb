When(/^the client requests immunization for the patient "(.*?)" in FHIR format$/) do |pid|
  temp = RDKQuery.new('immunization')
  temp.add_parameter("subject.identifier", pid)
  #temp.add_parameter("domain", "imun")
  temp.add_acknowledge("true")
  p temp.path
  @response = HTTPartyRDK.get(temp.path)
end

Then(/^the FHIR results contain immunization/) do |table|
  # the dateformat for immunization appears to be different that what was defined as default
  dateformat = /\d{4}[-\/]\d{1,2}[-\/]\d{1,2}T\d\d:\d\d:\d\d[\+\-]\d\d:\d\d/

  @json_object = JSON.parse(@response.body)
  json_verify = JsonVerifier.new

  result_array = @json_object["entry"]
  table.rows.each do |fieldpath, fieldvaluestring|
    json_verify.reset_output
    if fieldvaluestring.eql? "IS_FORMATTED_DATE"
      found = json_verify.all_matches_date_format(fieldpath, dateformat, result_array)
    elsif fieldvaluestring.eql? "IS_FHIR_FORMATTED_DATE"
      found = json_verify.all_matches_fhir_date_format(fieldpath, dateformat, result_array)
    elsif fieldvaluestring.eql? "IS_NOT_SET"
      found = json_verify.not_defined?([fieldpath], result_array)
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
    expect(found).to eq(true)
    expect(result_array.length).to_not eq(0)
  end # table.rows.each
end

When(/^the client requests immunization for that sensitive patient "(.*?)"$/) do |pid|
  temp = RDKQuery.new('immunization')
  temp.add_parameter("subject.identifier", pid)
  #temp.add_parameter("domain", "imun")
  temp.add_acknowledge("false")
  p temp.path
  @response = HTTPartyRDK.get(temp.path)
end

When(/^the client breaks glass and repeats a request for immunization for that patient "(.*?)"$/) do |pid|
  temp = RDKQuery.new('immunization')
  temp.add_parameter("subject.identifier", pid)
  #temp.add_parameter("domain", "imun")
  temp.add_acknowledge("true")
  p temp.path
  @response = HTTPartyRDK.get(temp.path)
end

When(/^the client requests "(.*?)" immunization for the patient "(.*?)" in FHIR format$/) do |limit, pid|
  temp = RDKQuery.new('immunization')
  temp.add_parameter("subject.identifier", pid)
  temp.add_parameter("limit", limit)
  temp.add_acknowledge("true")
  p temp.path
  @response = HTTPartyRDK.get(temp.path)
end
