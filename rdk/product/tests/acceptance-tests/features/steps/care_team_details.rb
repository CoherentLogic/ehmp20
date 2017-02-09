When(/^the client requests demographics for the patient "([^"]*)" with credentials$/) do |pid, table|
  path = QueryRDKDomain.new("patient", pid).path
  p table.rows[0][0]
  p table.rows[0][1]
  p table.rows[0][2]
  @response = HTTPartyRDK.get_as_user(path, "#{table.rows[0][0]};#{table.rows[0][1]}", table.rows[0][2])
end
