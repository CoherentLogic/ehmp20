define([
    'app/resources/picklist/encounters/new_persons/collection',
    'app/resources/picklist/encounters/new_persons_direct/collection',
    'app/resources/picklist/encounters/providers/collection',
    'app/resources/picklist/encounters/diagnoses/collection',
    'app/resources/picklist/encounters/visit_type/collection',
    'app/resources/picklist/encounters/cpt_modifiers/collection',
    'app/resources/picklist/encounters/procedures/collection',
    'app/resources/picklist/encounters/other_procedures/collection',
    'app/resources/picklist/encounters/locations/collection'
], function(NewPersons, NewPersonsDirect, Providers, Diagnoses, VisitType, CptModifiers, Procedures, OtherProcedures, Locations) {
    'use strict';

    return {
        NewPersons: NewPersons,
        NewPersonsDirect: NewPersonsDirect,
        Providers: Providers,
        Diagnoses: Diagnoses,
        VisitType: VisitType,
        CptModifiers: CptModifiers,
        Procedures: Procedures,
        OtherProcedures: OtherProcedures,
        Locations: Locations
    };
});
