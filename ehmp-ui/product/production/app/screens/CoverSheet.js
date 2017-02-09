define([
    'app/screens/AllergyGridFull',
    'app/screens/VitalsFull',
    'app/screens/ImmunizationsFull',
    'app/screens/OrdersFull',
    "main/ADK"
], function(AllergyGridFull, VitalsFull, ImmunizationsFull, OrdersFull, ADK) {
    'use strict';
    var detailAppletChannels = {
        // mapping of domain --> appletId
        "med": "medication_review",
        "document": "documents"
    };

    var config = {
        id: 'cover-sheet',
        context: 'patient',
        contentRegionLayout: 'gridster',
        appletHeader: 'navigation',
        appLeft: 'patientInfo',
        predefined: true,
        freezeApplets: true, //if true, applets won't be draggable and resizable by gridster
        applets: [{
            "id": "problems",
            "title": "Problems",
            "maximizeScreen": "problems-full",
            "region": "bc2652653929",
            "dataRow": "1",
            "dataCol": "1",
            "dataSizeX": "4",
            "dataSizeY": "4",
            "dataMinSizeX": "4",
            "dataMinSizeY": "2",
            "dataMaxSizeX": "6",
            "dataMaxSizeY": "12",
            "viewType": "summary"
        }, {
            "id": "vitals",
            "title": "Vitals",
            "maximizeScreen": "vitals-full",
            "region": "dc49ad17e67c",
            "dataRow": "1",
            "dataCol": "5",
            "dataSizeX": "4",
            "dataSizeY": "4",
            "dataMinSizeX": "4",
            "dataMinSizeY": "2",
            "dataMaxSizeX": "6",
            "dataMaxSizeY": "12",
            "viewType": "summary"
        }, {
            "id": "allergy_grid",
            "title": "Allergies",
            "maximizeScreen": "allergy-grid-full",
            "region": "e543e81ca31a",
            "dataRow": "1",
            "dataCol": "9",
            "dataSizeX": "4",
            "dataSizeY": "4",
            "dataMinSizeX": "2",
            "dataMinSizeY": "1",
            "dataMaxSizeX": "4",
            "dataMaxSizeY": "4",
            "viewType": "gist"
        }, {
            "id": "appointments",
            "title": "Appointments & Visits",
            "maximizeScreen": "appointments-full",
            "region": "c7c6294343c0",
            "dataRow": "5",
            "dataCol": "1",
            "dataSizeX": "4",
            "dataSizeY": "4",
            "dataMinSizeX": "4",
            "dataMinSizeY": "2",
            "dataMaxSizeX": "6",
            "dataMaxSizeY": "12",
            "viewType": "summary"
        }, {
            "id": "immunizations",
            "title": "Immunizations",
            "maximizeScreen": "immunizations-full",
            "region": "a7dace4f6e1f",
            "dataRow": "9",
            "dataCol": "1",
            "dataSizeX": "4",
            "dataSizeY": "4",
            "dataMinSizeX": "4",
            "dataMinSizeY": "2",
            "dataMaxSizeX": "6",
            "dataMaxSizeY": "12",
            "viewType": "summary"
        }, {
            "id": "activeMeds",
            "title": "Active & Recent Medications",
            "region": "041456e4af17",
            "dataRow": "9",
            "dataCol": "5",
            "dataSizeX": "4",
            "dataSizeY": "4",
            "dataMinSizeX": "4",
            "dataMinSizeY": "2",
            "dataMaxSizeX": "6",
            "dataMaxSizeY": "12",
            "viewType": "summary",
            "maximizeScreen": "medication-review"
        }, {
            "id": "lab_results_grid",
            "title": "Numeric Lab Results",
            "maximizeScreen": "lab-results-grid-full",
            "region": "9dc9f289d846",
            "dataRow": "5",
            "dataCol": "5",
            "dataSizeX": "4",
            "dataSizeY": "4",
            "dataMinSizeX": "4",
            "dataMinSizeY": "2",
            "dataMaxSizeX": "6",
            "dataMaxSizeY": "12",
            "viewType": "summary"
        }, {
            "id": "orders",
            "title": "Orders",
            "maximizeScreen": "orders-full",
            "region": "54cdb996d9c8",
            "dataRow": "9",
            "dataCol": "9",
            "dataSizeX": "4",
            "dataSizeY": "4",
            "dataMinSizeX": "4",
            "dataMinSizeY": "2",
            "dataMaxSizeX": "6",
            "dataMaxSizeY": "12",
            "viewType": "summary"
        }, {
            "id": "ccd_grid",
            "title": "Community Health Summaries",
            "maximizeScreen": "ccd-list-full",
            "region": "76fed10ec8c0",
            "dataRow": "5",
            "dataCol": "9",
            "dataSizeX": "4",
            "dataSizeY": "4",
            "dataMinSizeX": "4",
            "dataMinSizeY": "2",
            "dataMaxSizeX": "6",
            "dataMaxSizeY": "12",
            "viewType": "summary"
        }],
        onResultClicked: function(clickedResult) {

            var domain = clickedResult.uid.split(":")[2],
                channelName = detailAppletChannels[domain],
                modalView = null,
                deferredResponse = $.Deferred();

            if (channelName) {
                if (!clickedResult.suppressModal) {
                    // display spinner in modal while detail view is loading
                    var modal = new ADK.UI.Modal({
                        view: ADK.Views.Loading.create(),
                        options: {
                            size: "large",
                            title: "Loading..."
                        }
                    });
                    modal.show();
                }

                // request detail view from whatever applet is listening for this domain
                var channel = ADK.Messaging.getChannel(channelName),
                    deferredDetailResponse = channel.request('detailView', clickedResult);

                deferredDetailResponse.done(function(response) {
                    if (!clickedResult.suppressModal) {
                        var modal = new ADK.UI.Modal({
                            view: response.view,
                            options: {
                                size: "large",
                                title: response.title
                            }
                        });
                        modal.show();
                        deferredResponse.resolve();
                    } else {
                        deferredResponse.resolve(response);
                    }
                });
                deferredDetailResponse.fail(function(response) {
                    deferredResponse.reject(response);
                });
            } else {
                // no detail view available; use the default placeholder view
                var detailView = new DefaultDetailView();

                if (!clickedResult.suppressModal) {
                    var modalView2 = new ADK.UI.Modal({
                        view: detailView,
                        options: {
                            size: "large",
                            title: "Detail - Placeholder"
                        }
                    });
                    modalView2.show();
                    deferredResponse.resolve();
                } else {
                    deferredResponse.resolve({
                        view: detailView
                    });
                }
            }

            return deferredResponse.promise();
        },
        onStart: function() {
            AllergyGridFull.setUpEvents();
            VitalsFull.setUpEvents();
            ImmunizationsFull.setUpEvents();
            OrdersFull.setUpEvents();
            var searchAppletChannel = ADK.Messaging.getChannel("activeMeds");
            searchAppletChannel.on('detailView', this.onResultClicked);
        },
        // afterStart: function() {
        //     ADK.Messaging.trigger('appletsCreated');
        // },
        onStop: function() {
            var searchAppletChannel = ADK.Messaging.getChannel("activeMeds");
            searchAppletChannel.off('getDetailView', this.onResultClicked);
            OrdersFull.turnOffEvents();
        },
        patientRequired: true
    };
    ADK.Messaging.getChannel("lab_results_grid").reply('extDetailView', config.onResultClicked);
    ADK.Messaging.getChannel("narrative_lab_results_grid").reply('extDetailView', config.onResultClicked);
    return config;
});
