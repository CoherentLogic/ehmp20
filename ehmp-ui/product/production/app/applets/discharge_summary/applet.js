define([
    "app/applets/discharge_summary/detailController"
], function(DetailController) {
    "use strict";

    var appletDefinition = {
        appletId: "discharge_summary",
        resource:"patient-record-document"
    };

    DetailController.initialize(appletDefinition.appletId);

    return ADK.createSimpleApplet(appletDefinition);
});
