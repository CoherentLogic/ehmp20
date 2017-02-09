@Allergies_FHIR  @vxsync @patient

Feature: F138 Return of Allergies in FHIR format

#This feature item covers return of free text, observed, and historical allergies in FHIR format.


@US2345_fhir_freetext @fhir @9E7A1
Scenario: Client can request free text allergies in FHIR format
      Given a patient with "allergies" in multiple VistAs
      When the client requests allergies for the patient "9E7A;1" in FHIR format
      Then a successful response is returned
      And the FHIR results contain "allergy"
            | allergies_field_list            | panorama_allergies_values                                |
            | content.resourceType            | AdverseReaction                                          |
            | content.text.status             | generated                                                |
            | content.text.div                | <div>MILK, ICE CREAM, YOGURT ( FREE TEXT )</div>         |
            | content.identifier.value        | urn:va:allergy:9E7A:1:1                                  |
            | content.subject.reference       | urn:va:allergy:9E7A:1:1                                  |
            | content.didNotOccurFlag         | false                                                    |
            | content.extension.url           | http://vistacore.us/fhir/profiles/@main#entered-datetime |
            | content.extension.valueDateTime | IS_FHIR_FORMATTED_DATE                                               |
            | content.extension.url           | http://vistacore.us/fhir/profiles/@main#reaction-nature  |
            | content.extension.valueString   | allergy                                                  |
            #Patient
            | content.contained.resourceType     | Patient |
            | content.contained.identifier.label | 9E7A;1  |
            #Practitioner
            | content.contained.resourceType              | Practitioner |
            | content.contained.location.identifier.label | CAMP MASTER  |
            | content.contained.location.identifier.value | 500          |
            #Substance
            | content.contained.resourceType        | Substance                                        |
            | content.contained.text.status         | generated                                        |
            | content.contained.text.div            | <div>MILK, ICE CREAM, YOGURT ( FREE TEXT )</div> |
            | content.contained.type.coding.system  | urn:oid:2.16.840.1.113883.6.233                  |
            | content.contained.type.coding.code    | urn:va:vuid:                                     |
            | content.contained.type.coding.display | MILK, ICE CREAM, YOGURT ( FREE TEXT )            |
            | content.contained.type.text           | MILK, ICE CREAM, YOGURT ( FREE TEXT )            |
        And FHIR date and time conver to Zulu format for Allergies
      
@US2345_fhir_observed @fhir @5000000341V359724
Scenario: Client can request observed allergies in FHIR format
      Given a patient with "allergies" in multiple VistAs
      When the client requests allergies for the patient "9E7A;100022" in FHIR format
      Then a successful response is returned
      And the FHIR results contain "allergy"
      | allergies_field_list                | panorama_allergies_values       |
      | content.contained.type.text         | ERYTHROMYCIN                    |
      | content.symptom.code.text           | ANOREXIA                        |
      | content.symptom.code.coding.system  | urn:oid:2.16.840.1.113883.6.233 |
      | content.symptom.code.coding.code    | urn:va:vuid:4637051             |
      | content.symptom.code.coding.display | ANOREXIA                        |

@US2345_fhir_historical @fhir @5000000217V519385
Scenario: Client can request historical allergies in FHIR format
      Given a patient with "allergies" in multiple VistAs
      When the client requests allergies for the patient "9E7A;100716" in FHIR format
      Then a successful response is returned
      And the FHIR results contain "allergy"
      | allergies_field_list                  | panorama_allergies_values                                |
      | content.text.status                   | generated                                                |
      | content.extension.url                 | http://vistacore.us/fhir/profiles/@main#entered-datetime |
      | content.contained.text.status         | generated                                                |
      | content.contained.type.coding.system  | urn:oid:2.16.840.1.113883.6.233                          |
      | content.contained.type.coding.code    | urn:va:vuid:4636681                                      |
      | content.contained.type.coding.display | CHOCOLATE                                                |
      | content.contained.type.text           | CHOCOLATE                                                |
      | content.identifier.use                | official                                                 |
      | content.identifier.system             | urn:oid:2.16.840.1.113883.6.233                          |
      | content.identifier.value              | urn:va:allergy:9E7A:100716:973                           |
      | content.didNotOccurFlag               | false                                                    |
      | content.exposure.substance.reference  | IS_SET                                                   |
      | content.extension.url                 | http://vistacore.us/fhir/profiles/@main#reaction-nature  |
      | content.extension.valueString         | allergy                                                  |
      | content.contained.name.text           | DOCWITH,POWER                                            |
      | content.recorder.reference            | IS_SET                                                   |
      | content.contained.resourceType        | Substance                                                |
      | content.resourceType                  | AdverseReaction                                          |

@DE974_fhir_limit @fhir @5000000339V988748 @DE974
Scenario: Client can request observed allergies in FHIR format
      Given a patient with "allergies" in multiple VistAs
      When the client requests "10" allergies for the patient "9E7A;100840" in FHIR format
      Then a successful response is returned
      And the FHIR results contain "allergy"
      | allergies_field_list                  | panorama_allergies_values                                |
      | content.text.status                   | generated                                                |

