@F282_coditions_gist @regression @triage
Feature: F82 - Problems Gist View

#TEAM JUPITER
	
@F282-1.1 @F282-2.1 @F282_1_problemsGist_problems @US3390 @US4317
Scenario: User views the problems gist view
	# Given user is logged into eHMP-UI
	And user searches for and selects "ZZZRETFOURFIFTYEIGHT,PATIENT"	
  	Then Overview is active
  	And user sees Problems Gist
  	And the user has selected All within the global date picker
  	And the problems gist detail view has headers
  	  | Headers       |
      | Problem       |
      | Acuity        |
      | Status        |
      | Facility      |
	And the problems gist detail view contains
	  | Problem                                        | Acuity  | Status | Facility              |
      | UPPER EXTREMITY                              | Unknown | Active | is valid facility     |
      | Chronic Sinusitis                            | Acute   | Active | is valid facility     |
      | MANIC DISORDER-MILD                          | Chronic | Active | is valid facility     |
      | ALCOH DEP NEC/NOS-REMISS                     | Unknown | Active | is valid facility     |
      | Essential Hypertension                       | Acute   | Active | is valid facility     |
      | Adjustment Reaction With Physical Symptoms   | Unknown | Active | is valid facility     |
    

@F282-1.2 @US3390 @US4317
Scenario: User views the problems gist view
	# Given user is logged into eHMP-UI
	And user searches for and selects "Sixhundred,PATIENT"	
  	Then Overview is active
  	And user sees Problems Gist
  	And "No Records Found" message is displayed in Problems Gist

#@F282-3.1 @US3390 @US4317
#since the color is not attached to the correct id, this test case is moved as being manual.
#Scenario: User views the problems gist view
#	Given user is logged into eHMP-UI
#	And user searches for and selects "ZZZRETFOURFIFTYEIGHT,PATIENT"	
#  	Then Overview is active
#  	And user sees Problems Gist
#  	When hovering over the "right" side of the tile "UPPER EXTREMITY" 
#  	Then right half of the tile "UPPER EXTREMITY" changes color to indicate that there are more records that can be review
#    When hovering over the "left" side of the tile "UPPER EXTREMITY" 
#  	Then left half of the tile "UPPER EXTREMITY" changes color to indicate that the user can go to the detailed view

#@F282-3.2 is a manual test case
  	
@F282-5.1 @F282_2_problemsGist_ExpandView @US3390 @4317 @DE1576 
Scenario: View Problems Applet Single Page by clicking on Expand View
  # Given user is logged into eHMP-UI
  And user searches for and selects "FORTYSIX,PATIENT"
  Then Overview is active
  And user sees Problems Gist
  When the user clicks the control "Expand View" in the "Problems Gist applet"
  Then the Problems Gist applet title is "PROBLEMS"
  And the Problems Gist Applet table contains headers
    | header text |
    | Description | 
    | Standardized Description |  
    | Acuity | 
    | Onset Date | 
    | Last Updated | 
    | Provider | 
    | Facility |
  And the Problems Applet contains data rows

@F282-4.1 @F282_3_problemsGist_filter_capability @US3390 @4317 @debug @DE5485
Scenario: Problems Applet Gist - filter problems
  # Given user is logged into eHMP-UI
  Given user searches for and selects "ZZZRETFOURFIFTYEIGHT,PATIENT"
  Then Overview is active
  And user sees Problems Gist
  And the user has selected All within the global date picker
  When the user clicks the control "Filter Toggle" in the "Problems Gist applet"
  And the user filters the Problems Gist Applet by text "Dia"
  Then the problems gist table only diplays rows including text "Dia"

@F282_4_problemsGist_global_datefilter @US3390 @4317 @vimm_observed
Scenario: Problems gist applet is able to filter data based date filter search
 # Given user is logged into eHMP-UI
  And user searches for and selects "ZZZRETFOURFIFTYEIGHT,PATIENT"
  Then Overview is active
  And user sees Encounters Gist
  #And the user clicks the control "Date Filter" on the "Overview"
  When the user opens the Global Date Filter
  And the Date Filter displays "18" months in the past and "6" months in the future
  And the user inputs "01/01/1999" in the "From Date" control on the "Overview"
  And the user inputs "12/31/2099" in the "To Date" control on the "Overview"
  #And the user clicks the control "Apply" on the "Overview"
  And the user clicks the Global Date Filter Apply button
  And the problems gist detail view contains
	| Problem									| Acuity	| Status	| Facility	|
	| MANIC DISORDER-MILD 		| Chronic	| Active	| TST1	    |
	| UPPER EXTREMITY					| Unknown	| Active	| TST1 	    |

@F282-7.1 @F282_5_problemsGist_quick_view @US4155 @4317 @DE1321
Scenario: Problems Applet Gist - quick view of problems
  # Given user is logged into eHMP-UI
 Given user searches for and selects "ZZZRETFOURFIFTYEIGHT,PATIENT"
  #Given user searches for and selects "FORTYSIX,PATIENT"
  
  Then Overview is active
  And user sees Problems Gist
  And the user has selected All within the global date picker
  And hovering over the right side of problem trend view and selecting the "quick view" pop-up link
  Then the "Problems Gist Quick View Table" table contains headers
    | Date | Description | Facility |
  And the Problems Gist Quick View Table table contains rows
  And clicking a second time on the "quick view" hover button will result in the closure of the quick draw data box

@F282-9.1 @F282_6_problemsGist_Column_Sorting_Problem @US4684 @DE1371
  Scenario: Problems Gist Applet is sorted by the column header Problems
    # Given user is logged into eHMP-UI
    And user searches for and selects "ZZZRETFOURFIFTYEIGHT,PATIENT"
    Then Overview is active
    And user sees Problems Gist
    And the user has selected All within the global date picker
    When user clicks on the column header "Problem" in Problems Gist
    Then "Problem" column is sorted in ascending order in Problems Gist
    When user clicks on the column header "Problem" in Problems Gist
    Then "Problem" column is sorted in descending order in Problems Gist
  
#@F282-9.1 @F282_7_problemsGist_Column_Sorting_Problem @US4684
#Scenario: Problems Gist Applet is sorted by the column header Problems
#  Given user is logged into eHMP-UI
#  And user searches for and selects "ZZZRETFOURFIFTYEIGHT,PATIENT"
#  Then Overview is active
#  And user sees Problems Gist
#  And the user has selected All within the global date picker
#  When user clicks on the column header "Problem" in Problems Gist
#  Then "Problem" column is sorted in ascending order in Problems Gist
#  When user clicks on the column header "Problem" in Problems Gist
#  Then "Problem" column is sorted in descending order in Problems Gist
  
@F282-9.1 @F282_8_problemsGist_Column_Sorting_Acuity @US4684
Scenario: Problems Gist Applet is sorted by the column header Acuity
  # Given user is logged into eHMP-UI
  And user searches for and selects "ZZZRETFOURFIFTYEIGHT,PATIENT"
  Then Overview is active
  And user sees Problems Gist
  And the user has selected All within the global date picker
  When user clicks on the column header "Acuity" in Problems Gist
  Then "Acuity" column is sorted in ascending order in Problems Gist
  When user clicks on the column header "Acuity" in Problems Gist
  Then "Acuity" column is sorted in descending order in Problems Gist
  
@F282-9.1 @F282_9_problemsGist_Column_Sorting_Status @US4684
Scenario: Problems Gist Applet is sorted by the column header Hx Occrrence
  # Given user is logged into eHMP-UI
  And user searches for and selects "ZZZRETFOURFIFTYEIGHT,PATIENT"
  Then Overview is active
  And user sees Problems Gist
 And the user has selected All within the global date picker
  When user clicks on the column header "Status" in Problems Gist
  Then "Status" column is sorted in ascending order in Problems Gist
  When user clicks on the column header "Status" in Problems Gist
  Then "Status" column is sorted in descending order in Problems Gist

@F282-9.1 @F282_10_problemsGist_Column_Sorting_facility @US4684
Scenario: Problems Gist Applet is sorted by the column header Last
  # Given user is logged into eHMP-UI
  And user searches for and selects "ZZZRETFOURFIFTYEIGHT,PATIENT"
  Then Overview is active
  And user sees Problems Gist
  And the user has selected All within the global date picker
  When user clicks on the column header "Facility" in Problems Gist
  Then "Facility" column is sorted in ascending order in Problems Gist
  # | 19y | 17y | 17y | 16y | 16y | 16y | 15y |
  When user clicks on the column header "Facility" in Problems Gist
  Then "Facility" column is sorted in descending order in Problems Gist
  # | 15y | 16y | 16y | 16y | 17y | 17y | 19y |
  
@F282_11_problemsGist_menu @US4317 @US4805 @debug @DE1400
Scenario: Problems Applet Gist - menu appears in any chosen problem 
  # Given user is logged into eHMP-UI
  Given user searches for and selects "ZZZRETFOURFIFTYEIGHT,PATIENT"
  Then Overview is active
  And user sees Problems Gist
  And the user has selected All within the global date picker
  When user clicks on the left hand side of the item "MANIC DISORDER-MILD" 
  Then a Menu appears on the Problems Gist for item "Mainic Disorder"

@F282-6.1 @F282_12_problemsGist_detail_view @US4317 @US4805 @DE1400
Scenario: Problems Applet Gist - detail view of most recent problem 
  # Given user is logged into eHMP-UI
  Given user searches for and selects "ZZZRETFOURFIFTYEIGHT,PATIENT"
  Then Overview is active
  And user sees Problems Gist
  And the user has selected All within the global date picker
  When user clicks on the left hand side of the item "MANIC DISORDER-MILD" 
  Then a Menu appears on the Problems Gist for item "Mainic Disorder"
  #When user select the menu "Detail View Icon" in Problems Gist
  Then user selects the "Mainic Disorder" detail icon in Problems Gist
  Then it should show the detail modal of the most recent for this problem
  And the modal's title is "MANIC DISORDER-MILD"

#This test works well in browsers. In phantomJs it doesn't work consistently.  So attached a debug tag.  
@F282-7.1 @F282_13_problemsGist_quick_view_from_menu @US4317 @US4805 @debug
Scenario: Problems Applet Gist - quick view of chosen problem 
  # Given user is logged into eHMP-UI
  Given user searches for and selects "ZZZRETFOURFIFTYEIGHT,PATIENT"
  Then Overview is active
  And user sees Problems Gist
  And the user has selected All within the global date picker
  When user clicks on the left hand side of the item "Manic Disorder" 
  Then a Menu appears on the Problems Gist for item "Mainic Disorder"
  #When user select the menu "Quick View Icon" in Problems Gist
  Then user selects the "Mainic Disorder" quick view icon in Problems Gist
  Then the "Problems Gist Quick View Table" table contains headers
    | Date | Description | Facility | 
  And the "Problems Gist Quick View Table" table contains rows
	| Date			| Description				| Facility	 	|
	| 04/22/1999	| MANIC DISORDER-MILD		| CAMP MASTER 	|
	| 04/22/1999	| MANIC DISORDER-MILD		| CAMP BEE	 	|
	| 03/22/1999	| MANIC DISORDER-MILD		| FT. LOGAN		|
	| 03/22/1999	| MANIC DISORDER-MILD		| FT. LOGAN		|
	| 02/03/1999  	| MANIC DISORDER-MILD		| FT. LOGAN		|
	
@f282_problems_refresh 
Scenario: Problems Gist displays all of the same details after applet is refreshed
  # Given user is logged into eHMP-UI
  And user searches for and selects "ZZZRETFOURFIFTYEIGHT"
  Then Overview is active
  And user sees Problems Gist
  And the user has selected All within the global date picker
  And the Problems Gist Applet contains data rows
  When user refreshes Problems Gist Applet
  Then the message on the Problems Gist Applet does not say "An error has occurred"
  
@f282_problems_exapnd_view_refresh 
Scenario: Problems Gist expand view displays all of the same details after applet is refreshed
  # Given user is logged into eHMP-UI
  And user searches for and selects "ZZZRETFOURFIFTYEIGHT"
  Then Overview is active
  And user sees Problems Gist
  And the user has selected All within the global date picker
  When the user clicks the control "Expand View" in the "Problems Gist applet"
  Then the expanded Problems Applet is displayed
  And the Problems Applet contains data rows
  When user refreshes Problems Applet
  Then the message on the Problems Applet does not say "An error has occurred"
  
@F282_problems_modal_details_expand_view
Scenario: User views the problems gist modal pop-up from expand view
	# Given user is logged into eHMP-UI
	And user searches for and selects "eight,patient"	
    Then Overview is active
    And user sees Problems Gist
    And the user has selected All within the global date picker
    When the user clicks the control "Expand View" in the "Problems Gist applet"
    Then the expanded Problems Applet is displayed
    And the user views a problem applet row's details
    Then the modal is displayed
    And the modal's title is "Diabetes Mellitus Type II or unspecified"
  
