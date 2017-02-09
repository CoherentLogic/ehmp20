@F299_Global_Date_Timeline 
Feature: F299 - Global Timeline Date Filter
# This feature allows a user to select a date range using custom date filter.  Date selection for "from" will be limited to the previous day and all past dates and t he date selection for "to" will be allowed to current to future date.

# Team: Andromeda
# This test is being moved to archive.
# Manual test is defined in functional test F299_US4025 GDT- Custom Date Fields Selection & Masking

Background:
  Given user is logged into eHMP-UI


@F298-13.2 @US4052 @future
Scenario: Displaying on the coversheet and timeline - assuming the user has logged in and patient has data to display on the  "coversheet and timeline"
Given the timeline sheet is active
Then the inline timeline is not display
And the global data timeline picker is displayed
When the user clicks the global date picker
Then the timeline is active
When the user clicks a time frame on the global data picker
Then the timeline list is updated to reflect the selected data range

@f299-3.1_to_date_calendar_picker_selection @US4025 @TA13178a @manual 
Scenario: F299-3.1 To date calendar picker date selection

Given user searches for and selects "Eight,Patient"
Then Cover Sheet is active
When the user clicks the control "Date Filter Toggle" on the "Coversheet"
And the user waits for 5 seconds
Then the Custom date fields should be "enabled" on the "Coversheet"
And user enters today's date in "to field"
And clicks on the "to calendar" 
Then days earlier than the current are disabled
And the user selects the current date

@f299-3.2_form_date_calendar_picker_selection @US4025 @TA13178b @manual
Scenario: F299-3.2 From date calendar picker date selection
 
Given user searches for and selects "Eight,Patient"
Then Cover Sheet is active
When the user clicks the control "Date Filter Toggle" on the "Coversheet"
And the user waits for 5 seconds
Then the Custom date fields should be "enabled" on the "Coversheet"
And user enters yesterday's date in "from field"
And clicks on the "from calendar" 
Then the current day and all future dates are disabled
And the user selects a day in the past


@f299-3.6_date_values_for_All_selection @US4025 @TA13178f @DE864 @manual
Scenario: F299-3.6 Date values for the "All" selection

Given user searches for and selects "Eight,Patient"
Then Cover Sheet is active
When the user clicks the control "Date Filter Toggle" on the "Coversheet"
And the user waits for 5 seconds
And the user clicks the date control "All" on the "Coversheet"
Then the "From Date" input should have the value "07/16/1993" on the "Coversheet"
And the to date displays today's date

@f299_changing_patient_updates_date @US4233 @TA14424 @vimm @DE864 @f299-3.17 @f299-3.18 @manual
Scenario: F299-3.17, 3.18 Changing patient updates global timeline data

Given user searches for and selects "Eight,Patient"
Then Cover Sheet is active
When the user clicks the control "Date Filter Toggle" on the "Coversheet"
And the user waits for 5 seconds
And the user clicks the date control "All" on the "Coversheet"
Then the "From Date" input should have the value "07/16/1993" on the "Coversheet"
And the to date displays today's date
Given user searches for and selects "Bcma,Eight"
Then Cover Sheet is active
And the "Viewing __ to __" text is correctly set to "18" months in the past and "6" months in the future  
When the user clicks the control "Date Filter Toggle" on the "Coversheet"
And the user waits for 5 seconds
And the user waits for 5 seconds
And the user clicks the date control "All" on the "Coversheet"
Then the "From Date" input should have the value "11/30/1994" on the "Coversheet"
And the to date displays today's date

@f299-3.5_apply_button_to_close_calender @US4025 @TA13178e @future @manual
Scenario: F299-3.5 Apply button to close calendar

Given user searches for and selects "Eight,Patient"
Then Cover Sheet is active
When the user clicks the control "Date Filter Toggle" on the "Coversheet"
And the user waits for 5 seconds
When the user inputs "01/01/2010" in the "From Date" control in the "Coversheet"
And the user inputs "01/01/2018" in the "To Date" control in the "Coversheet"
Then the Custom date field "Apply" button should be "enabled" on the "Coversheet"
And the user clicks the control "Apply" on the "Coversheet"
Then the date filter closes

