define([
    'app/screens/VitalsFull'
], function(VitalsFull) {
    'use strict';
    var detailAppletChannels = {
        "med": "medication_review",
        "document": "documents"
    };
    var config = {
        id: 'hypertension-cbw',
        context: 'patient',
        contentRegionLayout: 'gridster',
        appletHeader: 'navigation',
        appLeft: 'patientInfo',
        predefined: true,
        freezeApplets: true, //if true, applets won't be draggable and resizable by gridster
        applets: [{
            "id": "problems",
            "title": "Problems",
            "instanceId": "htcbw-problems-1",
            "region": "htcbw-problems-1",
            "dataCol": "1",
            "dataMaxSizeX": 8,
            "dataMaxSizeY": 12,
            "dataMinSizeX": 4,
            "dataMinSizeY": 4,
            "dataRow": "1",
            "dataSizeX": "4",
            "dataSizeY": "6",
            "maximizeScreen": "problems-full",
            "filterName": "Hypertension",
            "viewType": "gist"
        }, {
            "id": "newsfeed",
            "title": "Timeline",
            "instanceId": "htcbw-newsfeed-1",
            "region": "htcbw-newsfeed-1",
            "dataCol": "1",
            "dataMaxSizeX": 8,
            "dataMaxSizeY": 12,
            "dataMinSizeX": 4,
            "dataMinSizeY": 4,
            "dataRow": "7",
            "dataSizeX": "4",
            "dataSizeY": "6",
            "filterName": "Hypertension",
            "viewType": "summary",
            "maximizeScreen": "news-feed"
        }, {
            "id": "vitals",
            "title": "Vitals",
            "instanceId": "htcbw-vitals-1",
            "region": "htcbw-vitals-1",
            "dataCol": "5",
            "dataMaxSizeX": 8,
            "dataMaxSizeY": 12,
            "dataMinSizeX": 4,
            "dataMinSizeY": 4,
            "dataRow": "1",
            "dataSizeX": "4",
            "dataSizeY": "6",
            "filterName": "Hypertension",
            "maximizeScreen": "vitals-full",
            "viewType": "gist"
        }, {
            "id": "lab_results_grid",
            "title": "Numeric Lab Results",
            "instanceId": "htcbw-lab_results_grid-1",
            "region": "htcbw-lab_results_grid-1",
            "dataCol": "9",
            "dataMaxSizeX": 8,
            "dataMaxSizeY": 12,
            "dataMinSizeX": 4,
            "dataMinSizeY": 4,
            "dataRow": "1",
            "dataSizeX": "4",
            "dataSizeY": "6",
            "filterName": "Hypertension",
            "maximizeScreen": "lab-results-grid-full",
            "viewType": "gist"
        }, {
            "id": "cds_advice",
            "title": "Clinical Reminders",
            "instanceId": "htcbw-cds_advice-1",
            "region": "htcbw-cds_advice-1",
            "dataCol": "13",
            "dataMaxSizeX": 8,
            "dataMaxSizeY": 12,
            "dataMinSizeX": 4,
            "dataMinSizeY": 4,
            "dataRow": "1",
            "dataSizeX": "4",
            "dataSizeY": "4",
            "filterName": "Hypertension",
            "maximizeScreen": "cds-advice-full",
            "viewType": "summary"
        }, {
            "id": "appointments",
            "title": "Appointments & Visits",
            "instanceId": "htcbw-appointments-1",
            "region": "htcbw-appointments-1",
            "dataCol": "13",
            "dataMaxSizeX": 8,
            "dataMaxSizeY": 12,
            "dataMinSizeX": 4,
            "dataMinSizeY": 4,
            "dataRow": "5",
            "dataSizeX": "4",
            "dataSizeY": "4",
            "filterName": "Hypertension",
            "maximizeScreen": "appointments-full",
            "viewType": "summary"
        }, {
            "id": "documents",
            "title": "Documents",
            "instanceId": "htcbw-documents-1",
            "region": "htcbw-documents-1",
            "dataCol": "13",
            "dataMaxSizeX": 8,
            "dataMaxSizeY": 12,
            "dataMinSizeX": 4,
            "dataMinSizeY": 4,
            "dataRow": "9",
            "dataSizeX": "4",
            "dataSizeY": "4",
            "filterName": "Hypertension",
            "viewType": "summary",
            "maximizeScreen": "documents-list"
        }, {
            "id": "medication_review",
            "title": "Medications Review",
            "instanceId": "htcbw-medication_review-1",
            "region": "htcbw-medication_review-1",
            "dataCol": "5",
            "dataMaxSizeX": 12,
            "dataMaxSizeY": 12,
            "dataMinSizeX": 8,
            "dataMinSizeY": 4,
            "dataRow": "7",
            "dataSizeX": "8",
            "dataSizeY": "6",
            "filterName": "Hypertension",
            "viewType": "expanded",
            "maximizeScreen": "medication-review"
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
                        deferredResponse.resolve({
                            view: response.view
                        });
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

            VitalsFull.setUpEvents();
            var searchAppletChannel = ADK.Messaging.getChannel("activeMeds");
            searchAppletChannel.on('detailView', this.onResultClicked);

        },
        onStop: function() {
            var searchAppletChannel = ADK.Messaging.getChannel("activeMeds");
            searchAppletChannel.off('detailView', this.onResultClicked);
        },
        patientRequired: true
    };

    return config;
});
