define(function() {
    "use strict";

    return {
        id: "problems-add-edit",
        context: 'patient',
        contentRegionLayout: "gridTwo",
        appletHeader: "patient",
        applets: [
        {
            id: "visit",
            region: "right"
        },
        {
            id: "problems_add_edit",
            title: "Add/Edit Problem",
            region: "left"
        }],
        patientRequired: true
    };
});
