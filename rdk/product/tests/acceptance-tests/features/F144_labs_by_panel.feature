@F144_labs_by_panel @vxsync @enrich
Feature: F144 - eHMP Viewer GUI

#As a user viewing labs inside of a panel the labs will be sorted in a given order as specified by the displayorder

#Andromeda

  @F144_labsByPanel_pid @US2833 @debug
  Scenario: When a user views, the sort order, to the order of the labs within panels, is on displayOrder
  When the client requests a response in VPR format from RDK API with the labsbypanel parameters
    | pid              | _ack     | observedFrom | observedTo | start | limit |
    | 9E7A;1           | true     |              |            |       |       |
    Then a successful response is returned
    And the VPR results contain
      | field                 | value                |
      | CH 0917 3.groupName   | CH 0917 3            |
      | CH 0917 3.displayName | GLUCOSE              |
      | CH 0917 3.displayOrder| 1                    |
      | CH 0917 3.groupName   | CH 0917 3            |
      | CH 0917 3.displayName | BUN                  |
      | CH 0917 3.displayOrder| 1.1                  |
      | CH 0917 3.groupName   | CH 0917 3            |
      | CH 0917 3.displayName | NA                   |
      | CH 0917 3.displayOrder| 1.2                  |
      | CH 0917 3.groupName   | CH 0917 3            |
      | CH 0917 3.displayName | K                    |
      | CH 0917 3.displayOrder| 1.20000001           |

@f144_labsByPanel_start_limit_filter @US2523
Scenario: Limiting the number of results with the 'start', 'limit', 'observedFrom' and 'observedTo' parameters.
  Given a patient with pid "9E7A;3" has been synced through the RDK API
  When the client requests a response in VPR format from RDK API with the labsbypanel parameters
    | pid              | _ack     | observedFrom | observedTo | start | limit |
    | 9E7A;3     | true     |              |            |       |       |
    Then a successful response is returned
  When the client requests a response in VPR format from RDK API with the labsbypanel parameters
    | pid              | _ack     | observedFrom | observedTo | start | limit |
    | 9E7A;3     | true     | 2007         | 2008       | 10    | 14    |
    Then a successful response is returned
    And the client receives "453" total items but only "14" current items with a start index of "10"

@US2034 @DE377 @labsByPanel_anatomic_pathology
Scenario: Show the anatomic pathology results from labs applet
  Given a patient with pid "9E7A;239" has been synced through the RDK API
  When the client requests a response in VPR format from RDK API with the labsbypanel parameters
    | pid              | _ack     | observedFrom | observedTo | start | limit |
    | 9E7A;239     | true     |              |            |       |       |
  Then a successful response is returned
  And the VPR results contain
      | field           | value              |
      | pid             | 9E7A;239           |
      | observed        | 19951205           |
      | kind            | Surgical Pathology |
      | specimen        | LYMPH NODES        |
  And the VPR results contain
      | field           | value              |
      | pid             | C877;239           |
      | observed        | 19951205           |
      | kind            | Surgical Pathology |
      | specimen        | LYMPH NODES        |
  And the VPR results contain
      | field           | value              |
      | pid             | 9E7A;239           |
      | observed        | 19951116           |
      | kind            | Surgical Pathology |
      | specimen        | BONE MARROW BIOPSY |
  And the VPR results contain
      | field           | value              |
      | pid             | C877;239           |
      | observed        | 19951116           |
      | kind            | Surgical Pathology |
      | specimen        | BONE MARROW BIOPSY |

@US2034 @DE377 @labsByPanel_microbiology
Scenario: Show the microbiology results from labs applet
  Given a patient with pid "9E7A;9" has been synced through the RDK API
   When the client requests a response in VPR format from RDK API with the labsbypanel parameters
    | pid              | _ack     | observedFrom | observedTo | start | limit |
    | 9E7A;9           | true     |              |            |       |       |
  Then a successful response is returned
  And the VPR results contain
      | field           | value        |
      | pid             | 9E7A;9       |
      | observed        | 19930911231500 |
      | kind            | Microbiology |
      | sample          | URINE        |
      | specimen        | URINE        |
