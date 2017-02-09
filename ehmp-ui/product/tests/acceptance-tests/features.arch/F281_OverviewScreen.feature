@F281_Overview @regression @base
Feature: F281-Intervention Gist View

#POC: Team Jupiter

@F281_1_Overview @US3489
Scenario: User views the Overview screen
#	Given user is logged into eHMP-UI
	And user searches for and selects "BCMA,Eight"
	Then Overview is active by default
	And the applets are displayed on the overview
      | applet                      |
      | CLINICAL REMINDERS          |
      | ENCOUNTERS                  |
      | REPORTS                     |
      | PROBLEMS                    |
      | ALLERGIES                   |
      | VITALS                      |
      | IMMUNIZATIONS               |
      | NUMERIC LAB RESULTS         |
      | Active & Recent MEDICATIONS |
    
