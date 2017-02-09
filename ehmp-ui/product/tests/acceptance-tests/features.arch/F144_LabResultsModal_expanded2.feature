@F144_Lab_Results_Modal @Lab_Results @regression
Feature: F144 - eHMP Viewer GUI - Numeric Lab Results in expanded view

# Team: Andromeda, inherited by Team Venus

Background:
  Given user is logged into eHMP-UI
  Given user searches for and selects "Eight,Patient"
  Then Cover Sheet is active
  Given the user has selected All within the global date picker
  And the user clicks the control "Expand View" in the "Numeric Lab Results applet"
  When the applet displays numeric lab results


# removed Lab Result modal traversal automated tests, they are too data dependent and too order specific
  @f144_numeric_lab_results_panel_modal_traversal @US2327 @TA6665a @modal_test @DE387 @DE1253 @future @DE1617
Scenario: Numeric Lab Results Modal - Moving through individual numeric lab results as part of a panel in modal view.
  Given the user is viewing the expanded view of the Numeric Lab Results Applet
  And the user inputs "Panel" in the "Text Filter" control in the "Numeric Lab Results applet"
  And the user clicks the Panel "COAG PROFILE BLOOD PLASMA WC LB #2988" in the Numeric Lab Results applet
  And the user clicks the Lab Test "PROTIME - PLASMA" in the Panel result details
  Then the modal is displayed
  Then the modal's title is "PROTIME - PLASMA"
  When the user clicks the control "Next Button" in the "Numeric Lab Results modal"
  Then the modal's title is "PTT - PLASMA"
  When the user clicks the control "Next Button" in the "Numeric Lab Results modal"
  Then the modal's title is "PROTIME - PLASMA"
  When the user clicks the control "Next Button" in the "Numeric Lab Results modal"
  Then the modal's title is "PTT - PLASMA"
  When the user clicks the control "Next Button" in the "Numeric Lab Results modal"
  Then the modal's title is "GLUCOSE - SERUM"
  When the user clicks the control "Previous Button" in the "Numeric Lab Results modal"
  Then the modal's title is "PTT - PLASMA"
  When the user clicks the control "Previous Button" in the "Numeric Lab Results modal"
  Then the modal's title is "PROTIME - PLASMA"
  When the user clicks the control "Previous Button" in the "Numeric Lab Results modal"
  Then the modal's title is "PTT - PLASMA"
  When the user clicks the control "Previous Button" in the "Numeric Lab Results modal"
  Then the modal's title is "PROTIME - PLASMA"

@f144_numeric_lab_results_modal_graph_percentages @US2213 @DE265 @modal_test @future @obe
Scenario: Numeric Lab Results Modal - ensure that results with percent data (ex. HEMOGLOBIN A1C) are graphed.
  Given the user is viewing the expanded view of the Numeric Lab Results Applet
  When the user inputs "HEMOGLOBIN+A1C" in the "Text Filter" control in the "Numeric Lab Results applet"
  And the Numeric Lab Results Applet table contains specific rows
    | row | Date               | Lab Test               | Flag | Result | Unit | Ref Range | Facility |
    | 1   | 03/05/2010 - 10:00 | HEMOGLOBIN A1C - BLOOD | H    | 6.2    | %    | 3.5-6     | TST1     |
  And the user clicks the first non-Panel result in the Numeric Lab Results applet
  Then the modal is displayed
  And the modal's title is "HEMOGLOBIN A1C - BLOOD"
  And the user clicks the date control "All" in the "Numeric Lab Results modal"
  And the "Total Tests" label has the value "14"
  And the number of "Graph Points" is "14" in the "Numeric Lab Results modal"
  And the number of "Date Range labels" is "5" in the "Numeric Lab Results modal"
  And the "Date Range labels" in the "Numeric Lab Results modal" are given as
    | Label        |
    | Jan 01 2006  |
    | Jan 01 2007  |
    | Jan 01 2008  |
    | Jan 01 2009  |
    | Jan 01 2010  |

# removed Lab Result modal traversal automated tests, they are too data dependent and too order specific
@f144_numeric_lab_results_modal_graph_date_axis_months @US2562 @TA7868b @modal_test @DE1249 @future
Scenario: Numeric Lab Results Modal - ensure data ranges are appropriate for number of tests.
  Given the user is viewing the expanded view of the Numeric Lab Results Applet
  When the user clicks the first non-Panel result in the Numeric Lab Results applet
  Then the modal is displayed
  And the modal's title is "Sodium, Blood Quantitative - PLASMA"
  And the user clicks the date control "All" in the "Numeric Lab Results modal"
  And the user waits for 5 seconds 
  And the "Total Tests" label has the value "6"
  And the number of "Graph Points" is "6" in the "Numeric Lab Results modal"
  And the number of "Date Range labels" is "5" in the "Numeric Lab Results modal"
  And the "Date Range labels" in the "Numeric Lab Results modal" are given as
    | Label       |
    | Mar 04 2013 |
    | Mar 18 2013 |
    | Apr 01 2013 |
    | Apr 15 2013 |
    | Apr 29 2013 |