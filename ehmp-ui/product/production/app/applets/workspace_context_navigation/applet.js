define([
    'backbone',
    'marionette',
    'underscore',
    'app/applets/workspace_context_navigation/applicationHeaderItems/patientContextLink',
    'app/applets/workspace_context_navigation/applicationHeaderItems/patientSelectionLink',
    'app/applets/workspace_context_navigation/applicationHeaderItems/adminContextLink',
    'app/applets/workspace_context_navigation/applicationHeaderItems/staffContextLink'
], function(
    Backbone,
    Marionette,
    _,
    ApplicationHeaderPatientContextLink,
    ApplicationHeaderPatientSelectionLink,
    ApplicationHeaderAdminContextLink,
    ApplicationHeaderStaffContextLink
) {
    "use strict";

    var applet = {
        id: "workspace_context_navigation",
        viewTypes: [{
            type: 'applicationHeaderItem-patientContext',
            view: ApplicationHeaderPatientContextLink,
            chromeEnabled: false
        }, {
            type: 'applicationHeaderItem-patientSelection',
            view: ApplicationHeaderPatientSelectionLink,
            chromeEnabled: false
        }, {
            type: 'applicationHeaderItem-adminContext',
            view: ApplicationHeaderAdminContextLink,
            chromeEnabled: false
        }, {
            type: 'applicationHeaderItem-staffContext',
            view: ApplicationHeaderStaffContextLink,
            chromeEnabled: false
        }],
        defaultViewType: 'applicationHeaderItem-patientContext'
    };

    return applet;
});