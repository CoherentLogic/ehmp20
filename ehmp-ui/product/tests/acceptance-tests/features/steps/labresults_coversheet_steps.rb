class LabResultsCoverSheet < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_verify(CucumberLabel.new("Date"), VerifyText.new, AccessHtmlElement.new(:id, "lab_results_grid-observed"))
    add_verify(CucumberLabel.new("Lab Test"), VerifyText.new, AccessHtmlElement.new(:id, "lab_results_grid-typeName"))
    add_verify(CucumberLabel.new("Result"), VerifyText.new, AccessHtmlElement.new(:id, "lab_results_grid-result"))
    add_verify(CucumberLabel.new("Site"), VerifyContainsText.new, AccessHtmlElement.new(:id, "lab_results_grid-facilityCode"))

    row_count = AccessHtmlElement.new(:xpath, "//table[@id='data-grid-lab_results_grid']/descendant::tr")
    add_verify(CucumberLabel.new("Num Numeric Lab Results"), VerifyXpathCount.new(row_count), row_count)

    add_action(CucumberLabel.new("Flag column"), ClickAction.new, AccessHtmlElement.new(:css, "#lab_results_grid-flag a"))
  end
end # LabResultsCoverSheet

class LabResultsSinglePage < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_verify(CucumberLabel.new("Date"), VerifyText.new, AccessHtmlElement.new(:id, "lab_results_grid-observed"))
    add_verify(CucumberLabel.new("Lab Test"), VerifyText.new, AccessHtmlElement.new(:id, "lab_results_grid-typeName"))
    add_verify(CucumberLabel.new("Result"), VerifyText.new, AccessHtmlElement.new(:id, "lab_results_grid-result"))
    add_verify(CucumberLabel.new("Site"), VerifyContainsText.new, AccessHtmlElement.new(:id, "lab_results_grid-facilityCode"))
    add_verify(CucumberLabel.new("Flag"), VerifyText.new, AccessHtmlElement.new(:id, "lab_results_grid-flag"))
    add_verify(CucumberLabel.new("Unit"), VerifyText.new, AccessHtmlElement.new(:id, "lab_results_grid-units"))
    add_verify(CucumberLabel.new("Ref Range"), VerifyText.new, AccessHtmlElement.new(:id, "lab_results_grid-referenceRange"))
  end
end # LabResultsSinglePage

When(/^the user clicks the header "(.*?)" in the Numeric Lab Results applet$/) do |arg1|
  expect(LabResultsCoverSheet.instance.perform_action(arg1)).to be_true
end

Then(/^the Numeric Lab Results coversheet table contains (\d+) rows$/) do |num_rows|
  cover = LabResultsCoverSheet.instance
  cover.wait_until_xpath_count("Num Numeric Lab Results", num_rows.to_i)
  expect(cover.perform_verification("Num Numeric Lab Results", num_rows.to_i)).to be_true, "expected #{num_rows}"
end

Then(/^the Numeric Lab Results coversheet table contains headers$/) do |table|
  verify_table_headers(LabResultsCoverSheet.instance, table)
end

Then(/^the Numeric Lab Results Single Page contains headers$/) do |table|
  verify_table_headers(LabResultsSinglePage.instance, table)
end

Then(/^the Lab Results Applet contains data rows$/) do
  compare_item_counts("#data-grid-lab_results_grid tr")
end

When(/^user refreshes Lab Results Applet$/) do
  applet_refresh_action("lab_results_grid")
end

Then(/^the message on the Lab Results Applet does not say "(.*?)"$/) do |message_text|
  compare_applet_refresh_action_response("lab_results_grid", message_text)
end
