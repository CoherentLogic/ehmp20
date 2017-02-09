path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../helper', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)

require 'all_applets.rb'

class VerifyValueFormat
  include HTMLVerification
  def initialize(regex)
    @error_message = 'no error message'
    @regex = regex
  end

  def verify(html_element, value)
    text = html_element.attribute('value')
    @error_message = "Does element text match regex #{@regex}: #{text}"
    
    return !( @regex.match(text)).nil?
  end

  def pull_value(html_element, _value)
    text = html_element.text
  end

  def error_message
    return @error_message
  end
end

class VitalsWriteBack < AllApplets
  include Singleton
  def initialize
    super
    add_action(CucumberLabel.new("Vitals Add Button"), ClickAction.new, AccessHtmlElement.new(:css, "[data-appletid=vitals] .applet-add-button"))
    add_verify(CucumberLabel.new("Add Vitals Modal Title"), VerifyText.new, AccessHtmlElement.new(:css, '[id="main-workflow-label-Enter-Vitals"]'))
    add_verify(CucumberLabel.new("Date Taken"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='dateTakenInput']"))
    add_action(CucumberLabel.new("Date Taken Input Box"), SendKeysAction.new, AccessHtmlElement.new(:css, "#dateTakenInput"))
    add_verify(CucumberLabel.new('Date Taken Input Value'), VerifyValue.new, AccessHtmlElement.new(:css, "#dateTakenInput"))
    add_verify(CucumberLabel.new('Date Taken Error Message'), VerifyText.new, AccessHtmlElement.new(:css, '.dateTakenInput span.error'))
    add_verify(CucumberLabel.new("Time Taken"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='time-taken']"))
    add_action(CucumberLabel.new("Time Taken Input Box"), SendKeysAction.new, AccessHtmlElement.new(:css, "#time-taken"))
    add_verify(CucumberLabel.new('Time Taken Input Value'), VerifyValueFormat.new(Regexp.new("\\d{2}\:\\d{2}")), AccessHtmlElement.new(:css, '#time-taken'))
    add_action(CucumberLabel.new("Expand All"), ClickAction.new, AccessHtmlElement.new(:css, "div.expandCollapseAll > button"))
    add_action(CucumberLabel.new("Pass"), ClickAction.new, AccessHtmlElement.new(:css, "div.facility-name-pass-po > button"))
    add_verify(CucumberLabel.new("Modal Loaded"), VerifyText.new, AccessHtmlElement.new(:css, ".modal-content"))
    add_action(CucumberLabel.new("Add"), ClickAction.new, AccessHtmlElement.new(:id, "form-add-btn"))
    add_action(CucumberLabel.new("Cancel"), ClickAction.new, AccessHtmlElement.new(:id, "form-cancel-btn"))
    add_verify(CucumberLabel.new("Growl Alert Msg"), VerifyContainsText.new, AccessHtmlElement.new(:css, ".growl-alert"))
    add_action(CucumberLabel.new("GDF Region"), ClickAction.new, AccessHtmlElement.new(:css, "#date-region-minimized"))
    add_action(CucumberLabel.new("GDF 24 Hours"), ClickAction.new, AccessHtmlElement.new(:css, "[name='24hrRangeGlobal']"))
    add_action(CucumberLabel.new("GDF Apply"), ClickAction.new, AccessHtmlElement.new(:css, "#customRangeApplyGlobal"))
    add_action(CucumberLabel.new("24 HR Range Vital"), ClickAction.new, AccessHtmlElement.new(:css, "#24hr-range-vitals"))
    add_verify(CucumberLabel.new("BP label"), VerifyText.new, AccessHtmlElement.new(:xpath, "//*[@id='data-grid-vitals']/descendant::td[contains(string(), 'Blood Pressure')]"))
    #add_verify(CucumberLabel.new("BP value"), VerifyContainsText.new, AccessHtmlElement.new(:css, '[data-appletid=vitals] [data-infobutton=BP] td:nth-child(2)'))
    add_verify(CucumberLabel.new("BP value"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//*[@id='data-grid-vitals']/descendant::td[contains(string(), '130/80')]"))
    add_action(CucumberLabel.new("New Observation Button"), ClickAction.new, AccessHtmlElement.new(:css, "#patientDemographic-newObservation [type=button]"))
  end
end

class BPLabels < VitalsWriteBack
  include Singleton
  def initialize
    super 
    #Labels
    add_verify(CucumberLabel.new("Blood Pressure"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='bpInputValue']"))
    add_verify(CucumberLabel.new("BP Unavailable"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='bp-radio-po-Unavailable']"))  
    add_verify(CucumberLabel.new("BP Refused"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='bp-radio-po-Refused']"))
    add_verify(CucumberLabel.new("BP Location"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='bp-location-po']"))
    add_verify(CucumberLabel.new("BP Method"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='bp-method-po']"))
    add_verify(CucumberLabel.new("BP Cuff Size"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='bp-cuff-size-po']"))
    add_verify(CucumberLabel.new("BP Position"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='bp-position-po']"))      
    bp_units = "mm[HG]"    
    add_verify(CucumberLabel.new("BP Units"), VerifyText.new, AccessHtmlElement.new(:xpath, "//span[contains(@class, 'input-group-addon') and contains(string(), '#{bp_units}')]"))
    add_action(CucumberLabel.new("BP Input Box"), SendKeysAction.new, AccessHtmlElement.new(:css, "#bpInputValue"))
    add_action(CucumberLabel.new("BP Unavailable Input Box"), ClickAction.new, AccessHtmlElement.new(:css, "#bp-radio-po-Unavailable"))
    add_action(CucumberLabel.new("BP Refused Input Box"), ClickAction.new, AccessHtmlElement.new(:css, "#bp-radio-po-Refused"))
    add_action(CucumberLabel.new("BP Location Drop Down"), ComboSelectAction.new, AccessHtmlElement.new(:id, "bp-location-po"))
    add_action(CucumberLabel.new("BP Method Drop Down"), ComboSelectAction.new, AccessHtmlElement.new(:id, "bp-method-po"))
    add_action(CucumberLabel.new("BP Cuff Size Drop Down"), ComboSelectAction.new, AccessHtmlElement.new(:id, "bp-cuff-size-po"))
    add_action(CucumberLabel.new("BP Position Drop Down"), ComboSelectAction.new, AccessHtmlElement.new(:id, "bp-position-po"))
  end
end

class TempLabels < VitalsWriteBack
  include Singleton
  def initialize
    super 
    #Labels
    add_verify(CucumberLabel.new("Temperature"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='temperatureInputValue']"))
    add_verify(CucumberLabel.new("Temp Unavailable"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='temperature-radio-po-Unavailable']"))  
    add_verify(CucumberLabel.new("Temp Refused"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='temperature-radio-po-Refused']"))
    add_verify(CucumberLabel.new("Temp Units F"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='temperatureInputValue-F-radio-F']"))
    add_verify(CucumberLabel.new("Temp Units C"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='temperatureInputValue-C-radio-C']"))
    add_verify(CucumberLabel.new("Temp Location"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='temperature-location-po']"))
    add_action(CucumberLabel.new("Temp Input Box"), SendKeysAction.new, AccessHtmlElement.new(:css, "#temperatureInputValue"))
    add_action(CucumberLabel.new("Temp Units F Input Box"), ClickAction.new, AccessHtmlElement.new(:css, "#temperatureInputValue-F-radio"))
    add_action(CucumberLabel.new("Temp Units C Input Box"), ClickAction.new, AccessHtmlElement.new(:css, "#temperatureInputValue-C-radio"))
    add_action(CucumberLabel.new("Temp Unavailable Input Box"), ClickAction.new, AccessHtmlElement.new(:css, "#temperature-radio-po-Unavailable"))
    add_action(CucumberLabel.new("Temp Refused Input Box"), ClickAction.new, AccessHtmlElement.new(:css, "#temperature-radio-po-Refused"))
    add_action(CucumberLabel.new("Temp Location Drop Down"), ComboSelectAction.new, AccessHtmlElement.new(:id, "temperature-location-po"))      
  end
end

class PulseLabels < VitalsWriteBack
  include Singleton
  def initialize
    super 
    #Labels
    add_verify(CucumberLabel.new("Pulse"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='pulseInputValue']"))
    add_verify(CucumberLabel.new("Pulse Unavailable"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='pulse-radio-po-Unavailable']"))  
    add_verify(CucumberLabel.new("Pulse Refused"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='pulse-radio-po-Refused']"))
    add_verify(CucumberLabel.new("Pulse Method"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='pulse-method-po']"))
    add_verify(CucumberLabel.new("Pulse Position"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='pulse-position-po']"))
    add_verify(CucumberLabel.new("Pulse Site"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='pulse-site-po']"))
    add_verify(CucumberLabel.new("Pulse Location"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='pulse-location-po']"))
    pulse_units = "/min"    
    add_verify(CucumberLabel.new("Pulse Units"), VerifyText.new, AccessHtmlElement.new(:xpath, "//span[contains(@class, 'input-group-addon') and contains(string(), '#{pulse_units}')]"))
    add_action(CucumberLabel.new("Pulse Input Box"), SendKeysAction.new, AccessHtmlElement.new(:css, "#pulseInputValue"))
    add_action(CucumberLabel.new("Pulse Unavailable Input Box"), ClickAction.new, AccessHtmlElement.new(:css, "#pulse-radio-po-Unavailable"))
    add_action(CucumberLabel.new("Pulse Refused Input Box"), ClickAction.new, AccessHtmlElement.new(:css, "#pulse-radio-po-Refused"))
    add_action(CucumberLabel.new("Pulse Method Drop Down"), ComboSelectAction.new, AccessHtmlElement.new(:id, "pulse-method-po"))
    add_action(CucumberLabel.new("Pulse Position Drop Down"), ComboSelectAction.new, AccessHtmlElement.new(:id, "pulse-position-po"))
    add_action(CucumberLabel.new("Pulse Site Drop Down"), ComboSelectAction.new, AccessHtmlElement.new(:id, "pulse-site-po"))
    add_action(CucumberLabel.new("Pulse Location Drop Down"), ComboSelectAction.new, AccessHtmlElement.new(:id, "pulse-location-po"))
  end
end

class RespirationLabels < VitalsWriteBack
  include Singleton
  def initialize
    super 
    #Labels
    add_verify(CucumberLabel.new("Respiration"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='respirationInputValue']"))
    add_verify(CucumberLabel.new("Respiration Unavailable"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='respiration-radio-po-Unavailable']"))  
    add_verify(CucumberLabel.new("Respiration Refused"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='respiration-radio-po-Refused']"))
    add_verify(CucumberLabel.new("Respiration Method"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='respiration-method-po']"))
    add_verify(CucumberLabel.new("Respiration Position"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='respiration-position-po']"))
    resp_units = "/min"    
    add_verify(CucumberLabel.new("Respiration Units"), VerifyText.new, AccessHtmlElement.new(:xpath, "//span[contains(@class, 'input-group-addon') and contains(string(), '#{resp_units}')]"))
    add_action(CucumberLabel.new("Respiration Input Box"), SendKeysAction.new, AccessHtmlElement.new(:css, "#respirationInputValue"))
    add_action(CucumberLabel.new("Respiration Unavailable Input Box"), ClickAction.new, AccessHtmlElement.new(:css, "#respiration-radio-po-Unavailable"))
    add_action(CucumberLabel.new("Respiration Refused Input Box"), ClickAction.new, AccessHtmlElement.new(:css, "#respiration-radio-po-Refused"))
    add_action(CucumberLabel.new("Respiration Method Drop Down"), ComboSelectAction.new, AccessHtmlElement.new(:id, "respiration-method-po"))
    add_action(CucumberLabel.new("Respiration Position Drop Down"), ComboSelectAction.new, AccessHtmlElement.new(:id, "respiration-position-po"))

    add_verify(CucumberLabel.new('Respiration has error'), VerifyContainsText.new, AccessHtmlElement.new(:css, 'div.respirationInputValue.has-error'))
    add_verify(CucumberLabel.new('Respiration has error message'), VerifyContainsText.new, AccessHtmlElement.new(:css, 'div.respirationInputValue.has-error span.help-block.error'))
  end
end

class POLabels < VitalsWriteBack
  include Singleton
  def initialize
    super 
    #Labels
    add_verify(CucumberLabel.new("Pulse Oximetry"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='O2InputValue']"))
    add_verify(CucumberLabel.new("PO Unavailable"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='po-radio-po-Unavailable']"))  
    add_verify(CucumberLabel.new("PO Refused"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='po-radio-po-Refused']"))
    add_verify(CucumberLabel.new("PO Supplemental Oxygen Flow Rate"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='suppO2InputValue']"))
    add_verify(CucumberLabel.new("PO Method"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='po-method-po']"))
    po_units = "(liters/minute)"    
    add_verify(CucumberLabel.new("PO Units"), VerifyText.new, AccessHtmlElement.new(:xpath, "//span[contains(@class, 'input-group-addon') and contains(string(), '#{po_units}')]"))
    add_action(CucumberLabel.new("PO Input Box"), SendKeysAction.new, AccessHtmlElement.new(:css, "#O2InputValue"))
    add_action(CucumberLabel.new("PO Unavailable Input Box"), ClickAction.new, AccessHtmlElement.new(:css, "#po-radio-po-Unavailable"))
    add_action(CucumberLabel.new("PO Refused Input Box"), ClickAction.new, AccessHtmlElement.new(:css, "#po-radio-po-Refused"))
    add_action(CucumberLabel.new("PO Supplemental Oxygen Flow Rate Input Box"), SendKeysAction.new, AccessHtmlElement.new(:css, "#suppO2InputValue"))
    add_action(CucumberLabel.new("PO Method Drop Down"), ComboSelectAction.new, AccessHtmlElement.new(:id, "po-method-po"))

    add_verify(CucumberLabel.new('PO has error'), VerifyText.new, AccessHtmlElement.new(:css, 'div.O2InputValue.has-error'))
    add_verify(CucumberLabel.new('PO has error message'), VerifyText.new, AccessHtmlElement.new(:css, 'div.O2InputValue.has-error span.help-block.error'))
    add_verify(CucumberLabel.new('PO Supp Ox has error'), VerifyText.new, AccessHtmlElement.new(:css, 'div.suppO2InputValue.has-error'))
    add_verify(CucumberLabel.new('PO Supp Ox has error message'), VerifyText.new, AccessHtmlElement.new(:css, 'div.suppO2InputValue.has-error span.help-block.error'))
  end
end

class HtLabels < VitalsWriteBack
  include Singleton
  def initialize
    super 
    #Labels
    add_verify(CucumberLabel.new("Height"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='heightInputValue']"))
    add_verify(CucumberLabel.new("Ht Unavailable"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='height-radio-po-Unavailable']"))  
    add_verify(CucumberLabel.new("Ht Refused"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='height-radio-po-Refused']"))
    add_verify(CucumberLabel.new("Ht Units in"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='heightInputValue-in-radio-in']"))
    add_verify(CucumberLabel.new("Ht Units cm"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='heightInputValue-cm-radio-cm']"))
    add_verify(CucumberLabel.new("Ht Quality"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='height-quality-po']"))
    add_action(CucumberLabel.new("Ht Input Box"), SendKeysAction.new, AccessHtmlElement.new(:css, "#heightInputValue"))
    add_action(CucumberLabel.new("Ht Unavailable Input Box"), ClickAction.new, AccessHtmlElement.new(:css, "#height-radio-po-Unavailable"))
    add_action(CucumberLabel.new("Ht Refused Input Box"), ClickAction.new, AccessHtmlElement.new(:css, "#height-radio-po-Refused"))
    add_action(CucumberLabel.new("Ht Units in Input Box"), ClickAction.new, AccessHtmlElement.new(:css, "#heightInputValue-in-radio"))
    add_action(CucumberLabel.new("Ht Units cm Input Box"), ClickAction.new, AccessHtmlElement.new(:css, "#heightInputValue-cm-radio"))
    add_action(CucumberLabel.new("Ht Quality Drop Down"), ComboSelectAction.new, AccessHtmlElement.new(:id, "height-quality-po"))
  end
end

class WtLabels < VitalsWriteBack
  include Singleton
  def initialize
    super 
    #Labels
    add_verify(CucumberLabel.new("Weight"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='weightInputValue']"))
    add_verify(CucumberLabel.new("Wt Unavailable"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='weight-radio-po-Unavailable']"))  
    add_verify(CucumberLabel.new("Wt Refused"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='weight-radio-po-Refused']"))
    add_verify(CucumberLabel.new("Wt Units lb"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='weightInputValue-lb-radio-lb']"))
    add_verify(CucumberLabel.new("Wt Units kg"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='weightInputValue-kg-radio-kg']"))
    add_verify(CucumberLabel.new("Wt Method"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='weight-method-po']"))
    add_verify(CucumberLabel.new("Wt Quality"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='weight-quality-po']"))
    add_action(CucumberLabel.new("Wt Input Box"), SendKeysAction.new, AccessHtmlElement.new(:css, "#weightInputValue"))
    add_action(CucumberLabel.new("Wt Unavailable Input Box"), ClickAction.new, AccessHtmlElement.new(:css, "#weight-radio-po-Unavailable"))
    add_action(CucumberLabel.new("Wt Refused Input Box"), ClickAction.new, AccessHtmlElement.new(:css, "#weight-radio-po-Refused"))
    add_action(CucumberLabel.new("Wt Units lb Input Box"), ClickAction.new, AccessHtmlElement.new(:css, "#weightInputValue-lb-radio"))
    add_action(CucumberLabel.new("Wt Units kg Input Box"), ClickAction.new, AccessHtmlElement.new(:css, "#weightInputValue-kg-radio"))
    add_action(CucumberLabel.new("Wt Method Drop Down"), ComboSelectAction.new, AccessHtmlElement.new(:id, "weight-method-po"))
    add_action(CucumberLabel.new("Wt Quality Drop Down"), ComboSelectAction.new, AccessHtmlElement.new(:id, "weight-quality-po"))
  end
end

class PainLabels < VitalsWriteBack
  include Singleton
  def initialize
    super 
    #Labels
    add_verify(CucumberLabel.new("Pain"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='pain-value-po']"))
    add_verify(CucumberLabel.new("Pain Unavailable"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='pain-radio-po-Unavailable']"))  
    add_verify(CucumberLabel.new("Pain Refused"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='pain-radio-po-Refused']"))
    add_verify(CucumberLabel.new("Pain Unable to Respond"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='pain-checkbox-po']"))
    add_action(CucumberLabel.new("Pain Input Box"), SendKeysAction.new, AccessHtmlElement.new(:css, "#pain-value-po"))
    add_action(CucumberLabel.new("Pain Unavailable Input Box"), ClickAction.new, AccessHtmlElement.new(:css, "#pain-radio-po-Unavailable"))
    add_action(CucumberLabel.new("Pain Refused Input Box"), ClickAction.new, AccessHtmlElement.new(:css, "#pain-radio-po-Refused"))
    add_action(CucumberLabel.new("Pain Unable to Respond Input Box"), ClickAction.new, AccessHtmlElement.new(:css, "#pain-checkbox-po"))
  end
end

class CGLabels < VitalsWriteBack
  include Singleton
  def initialize
    super 
    #Labels
    add_verify(CucumberLabel.new("Circumference/Girth"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='circumValue']"))
    add_verify(CucumberLabel.new("CG Unavailable"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='cg-radio-po-Unavailable']"))  
    add_verify(CucumberLabel.new("CG Refused"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='cg-radio-po-Refused']"))
    add_verify(CucumberLabel.new("CG Units in"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='circumValue-in-radio-in']"))
    add_verify(CucumberLabel.new("CG Units cm"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='circumValue-cm-radio-cm']"))
    add_verify(CucumberLabel.new("CG Site"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='cg-site-po']"))
    add_verify(CucumberLabel.new("CG Location"), VerifyText.new, AccessHtmlElement.new(:css, "label[for='cg-location-po']"))
    add_action(CucumberLabel.new("CG Input Box"), SendKeysAction.new, AccessHtmlElement.new(:css, "#circumValue"))
    add_action(CucumberLabel.new("CG Unavailable Input Box"), ClickAction.new, AccessHtmlElement.new(:css, "#cg-radio-po-Unavailable"))
    add_action(CucumberLabel.new("CG Refused Input Box"), ClickAction.new, AccessHtmlElement.new(:css, "#cg-radio-po-Refused"))
    add_action(CucumberLabel.new("CG Units in Input Box"), ClickAction.new, AccessHtmlElement.new(:css, "#circumValue-in-radio"))
    add_action(CucumberLabel.new("CG Units cm Input Box"), ClickAction.new, AccessHtmlElement.new(:css, "#circumValue-cm-radio"))
    add_action(CucumberLabel.new("CG Site Drop Down"), ComboSelectAction.new, AccessHtmlElement.new(:id, "cg-site-po"))
    add_action(CucumberLabel.new("CG Location Drop Down"), ComboSelectAction.new, AccessHtmlElement.new(:id, "cg-location-po"))
  end
end

Then(/^user adds a new vitals$/) do
  aa = VitalsWriteBack.instance
  expect(aa.perform_action("Vitals Add Button")).to eq(true)
end

Then(/^user chooses to "([^"]*)" on add vitals modal detail screen$/) do | expand_all |
  aa = TempLabels.instance
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time)
  @ehmp = AddVitalModal.new
  @ehmp.wait_until_btn_expand_collapse_button_visible
  @ehmp.btn_expand_collapse_button.click
  @ehmp.wait_until_fld_temp_location_visible
  # btn_expand_collapse_button
  # wait.until { aa.get_element(expand_all).displayed? }
  # wait.until { aa.get_element(expand_all).enabled? }
  # expect(aa.perform_action(expand_all)).to eq(true)
  # expect(aa.am_i_visible?("Temp Location Drop Down")).to eq(true)
end

Then(/^add vital modal detail title says "([^"]*)"$/) do |modal_title|
  aa = VitalsWriteBack.instance
  expect(aa.perform_verification("Add Vitals Modal Title", modal_title.upcase)).to eq(true)
end

Then(/^the add vitals detail modal displays labels$/) do |table|
  aa = VitalsWriteBack.instance
  verify_vitals_modal_details(table, aa)
end

Then(/^the Date Taken is a mandatory field on the add vitals modal detail screen$/) do
  aa = VitalsWriteBack.instance
  expect(aa.perform_verification("Date Taken", "Date Taken *")).to eq(true)
end

Then(/^the add vitals detail modal displays "([^"]*)", "([^"]*)" and "([^"]*)" buttons$/) do |pass_btn, accept_btn, cancel_btn|
  aa = VitalsWriteBack.instance
  expect(aa.am_i_visible?(pass_btn)).to eq(true)
  expect(aa.am_i_visible?(accept_btn)).to eq(true)
  expect(aa.am_i_visible?(cancel_btn)).to eq(true)
end

Then(/^the add vitals detail modal displays labels and expanded labels for "([^"]*)"$/) do |vital_type, table|
  verify_vitals_modal_details(table, map_add_vitals_class(vital_type))
end

Then(/^the add vitals detail modal displays form fields for "([^"]*)"$/) do |vital_type, table|
  verify_vitals_modal_details(table, map_add_vitals_class(vital_type))
end

def map_add_vitals_class(vital_type)
  case vital_type
  when 'Blood Pressure'
    aa = BPLabels.instance
  when 'Temperature'
    aa = TempLabels.instance
  when 'Pulse'
    aa = PulseLabels.instance
  when 'Respiration'
    aa = RespirationLabels.instance
  when 'Pulse Oximetry'
    aa = POLabels.instance
  when 'Height'
    aa = HtLabels.instance
  when 'Weight'
    aa = WtLabels.instance
  when 'Pain'
    aa = PainLabels.instance
  when 'Circumference/Girth'
    aa = CGLabels.instance
  end  
  return aa
end

def verify_vitals_modal_details(table, modal)
  #expect(modal.wait_until_action_element_visible("Modal Loaded", DefaultLogin.wait_time)).to be_true
  @ehmp = PobCommonElements.new
  @ehmp.wait_until_fld_modal_body_visible
  table.rows.each do | row |
    expect(modal.am_i_visible?(row[0])).to eq(true)
  end
end

Then(/^user adds a Vital record for the current visit$/) do |table| 
  table.rows.each do | row |
    vital_class = map_add_vitals_class(row[0])
    expect(vital_class.perform_action(row[1], row[2])).to eq(true), "Vital Type #{row[0]}: could not input the value #{row[2]} for #{row[1]}"
  end
end

Then(/^user chooses unavailable for the vitals$/) do |table|
  table.rows.each do | row |
    vital_class = map_add_vitals_class(row[0])
    input_box = row[1] + " Unavailable Input Box"
    expect(vital_class.perform_action(input_box, "")).to eq(true)
  end
end

Then(/^user chooses refused for the vitals$/) do |table|
  table.rows.each do | row |
    vital_class = map_add_vitals_class(row[0])
    input_box = row[1] + " Refused Input Box"
    expect(vital_class.perform_action(input_box, "")).to eq(true)
  end
end

Then(/^user adds vitals to patient record$/) do
  aa = VitalsWriteBack.instance
  expect(aa.perform_action("Add")).to eq(true)
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time) # seconds # wait until list opens
  wait.until { element_is_not_present?(:id, 'form-add-btn') }
end

Then(/^the recently added vital record is displayed$/) do |table|
  aa = VitalsWriteBack.instance
#  expect(aa.perform_action("GDF Region")).to eq(true)
#  expect(aa.perform_action("GDF 24 Hours")).to eq(true)
#  expect(aa.perform_action("GDF Apply")).to eq(true)
  
#  expect(aa.perform_action("24 HR Range Vital")).to eq(true)
  table.rows.each do | row |
    expect(aa.perform_verification("BP label", row[0])).to eq(true)
    expect(aa.perform_verification("BP value", row[1])).to eq(true)
  end
end

# When(/^user keyboard enters$/) do
#   aa = RespirationLabels.instance
#   input_box = aa.get_element('Respiration Input Box')
#   input_box.send_keys [:enter]
# end

When(/^user attempts to add vital$/) do
  aa = VitalsWriteBack.instance
  expect(aa.perform_action("Add")).to eq(true)
end

Then(/^the Respiration error message displays "([^"]*)"$/) do |arg1|
  aa = RespirationLabels.instance
  expect(aa.wait_until_element_present('Respiration has error')).to eq(true), "Respiration is not indicating an error"
  expect(aa.perform_verification('Respiration has error message', arg1)).to eq(true), "Respiration error message is not correct"
end

Then(/^the Pulse Oximetry error message displays "([^"]*)"$/) do |arg1|
  aa = POLabels.instance
  expect(aa.wait_until_element_present('PO has error')).to eq(true), "Pulse Oximetry is not indicating an error"
  expect(aa.perform_verification('PO has error message', arg1)).to eq(true), "Pulse Oximetry error message is not correct"
end

Then(/^the Supplemental Oxygen error message displays "([^"]*)"$/) do |arg1|
  aa = POLabels.instance
  expect(aa.wait_until_element_present('PO Supp Ox has error')).to eq(true), "PO Supp Ox is not indicating an error"
  expect(aa.perform_verification('PO Supp Ox has error message', arg1)).to eq(true), "PO Supp Ox error message is not correct"
end

When(/^user chooses to Pass on entering vitals$/) do
  expect(VitalsWriteBack.instance.perform_action('Pass')).to eq(true)
  sleep(10)
end

Then(/^the form fields for "([^"]*)" are disabled$/) do |vital_type, table|
  elements = map_add_vitals_class(vital_type)
  table.rows.each do | row |
    element = elements.get_element(row[0])
    expect(element.enabled?).to eq(false), "Expected #{row[0]} to be disabled"
  end
end

Then(/^the Date Taken field defaults to Today$/) do
  aa = VitalsWriteBack.instance
  today = Date.today.strftime("%m/%d/%Y")

  expect(aa.perform_verification('Date Taken Input Value', today)).to eq(true), "Expected date to be today"
end

Then(/^the Time Taken field defaults to time in specific format$/) do
  aa = VitalsWriteBack.instance
  expect(aa.perform_verification('Time Taken Input Value', '')).to eq(true), "Expected time to be in specific format"
end

When(/^the user sets the Date Take field to Tomorrow$/) do
  aa = VitalsWriteBack.instance
  tomorrow = (Date.today + 1).strftime("%m/%d/%Y")
  p tomorrow
  expect(aa.perform_action('Date Taken Input Box', tomorrow)).to eq(true)
end

Then(/^the Date \/ Time error message displays "([^"]*)"$/) do |arg1|
  aa = VitalsWriteBack.instance
  expect(aa.perform_verification('Date Taken Error Message', arg1)).to eq(true)
end

class VitalsAlert < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_verify(CucumberLabel.new('Alert Title'), VerifyText.new, AccessHtmlElement.new(:css, '#alert-region h4.modal-title'))
    add_action(CucumberLabel.new('No button'), ClickAction.new, AccessHtmlElement.new(:xpath, xpath_footer_button('No')))
    add_action(CucumberLabel.new('Yes button'), ClickAction.new, AccessHtmlElement.new(:xpath, xpath_footer_button('Yes')))
  end

  def xpath_footer_button(text)
    "//div[@id='alert-region']/descendant::div[contains(@class, 'modal-footer')]/descendant::button[contains(string(), '#{text}')]"
  end
end

Then(/^an alert is displayed with title "([^"]*)"$/) do |title|
  alert = VitalsAlert.instance
  @alert_title = title
  expect(alert.perform_verification('Alert Title', title)).to eq(true)
end

When(/^user chooses "([^"]*)" button on the alert$/) do |button_text|
  alert = VitalsAlert.instance
  expect(alert.perform_action("#{button_text} button")).to eq(true)
end

Then(/^the alert is closed$/) do
  alert = VitalsAlert.instance
  expect(alert.perform_verification('Alert Title', @alert_title, 5)).to eq(false)
end

Then(/^user closes the new observation window$/) do
  aa = VitalsWriteBack.instance
  click_button = aa.perform_action("New Observation Button")
  unless click_button
    aa.add_action(CucumberLabel.new("ob button"), ClickAction.new, AccessHtmlElement.new(:css, "#patientDemographic-newObservation div.action-list-container button"))
    if aa.am_i_visible? 'ob button'
      p "observation tray still open, try to refresh page"
      TestSupport.driver.navigate.refresh
    end
  end
end
