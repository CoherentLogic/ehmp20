define([
    "backbone",
    "marionette"
], function(Backbone, Marionette) {
    'use strict';

    var VISIT = 'visit',
        ENFORCE_VISIT_SELECTION = 'enforceVisitSelection',
        MEDREVIEW_CHANNEL = 'medicationChannel',
        defaultCallback = function(event, options) {
            return function(response) {
                response.view.showModal(event, options);
            };
        },
        defaultChannelConfig = function(command, callback) {
            return {
                'channel': MEDREVIEW_CHANNEL, //all commands will go through this channel
                'command': command, //the command is specific to the applet action we wish to initiate
                'callback': callback //this is what we want to do when the visit operation has finished
            };
        };

    function issueVisitRequest(appletKey, options) {
        ADK.Messaging.getChannel(VISIT)
            .command(ENFORCE_VISIT_SELECTION, appletKey, options);
    }

    function onAddMedicationOrderClicked(event) {
        var options = defaultChannelConfig('addOrderModal', defaultCallback(event));
        issueVisitRequest('addOrder', options);
    }

    var medicationReviewConfig = {
        id: "medication-review",
        context: 'patient',
        contentRegionLayout: "gridster",
        appletHeader: "navigation",
        appLeft: "patientInfo",
        predefined: true,
        freezeApplets: true, //if true, applets won't be draggable and resizable by gridster
        applets: [{
            "id": "medication_review",
            "title": "Medication Review",
            "instanceId": "8afd050c9965",
            "region": "8afd050c9965",
            "dataRow": "1",
            "dataCol": "1",
            "dataSizeX": "12",
            "dataSizeY": "12",
            "dataMinSizeX": "4",
            "dataMinSizeY": "2",
            "dataMaxSizeX": "12",
            "dataMaxSizeY": "12",
            "viewType": "expanded",
            "fullScreen": true
        }],
        locked: {
            filters: false
        },
        onStart: function() {
            this.setUpEvents();
        },
        setUpEvents: function() {
            var channel = ADK.Messaging.getChannel(MEDREVIEW_CHANNEL);
            channel.on('addOrder:clicked', onAddMedicationOrderClicked);
        },
        patientRequired: true
    };

    return medicationReviewConfig;
});