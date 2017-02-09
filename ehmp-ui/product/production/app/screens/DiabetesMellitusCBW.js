define([
    'app/screens/OrdersFull'
], function(OrdersFull) {
    'use strict';
    var detailAppletChannels = {
        "med": "medication_review",
        "document": "documents"
    };
    var config = {
        id: 'diabetes-mellitus-cbw',
        context: 'patient',
        contentRegionLayout: 'gridster',
        appletHeader: 'navigation',
        appLeft: 'patientInfo',
        predefined: true,
        freezeApplets: true, //if true, applets won't be draggable and resizable by gridster
        applets: [{
            "id": "problems",
            "title": "Problems",
            "instanceId": "dmcbw-problems-1",
            "region": "dmcbw-problems-1",
            "maximizeScreen": "problems-full",
            "dataRow": "1",
            "dataCol": "1",
            "dataSizeX": "4",
            "dataSizeY": "6",
            "dataMinSizeX": 4,
            "dataMinSizeY": 4,
            "dataMaxSizeX": 8,
            "dataMaxSizeY": 12,
            "viewType": "gist",
            "filterName": "Diabetes"
        }, {
            "id": "newsfeed",
            "title": "Timeline",
            "instanceId": "dmcbw-newfeed-1",
            "region": "dmcbw-newfeed-1",
            "dataRow": "7",
            "dataCol": "1",
            "dataMaxSizeX": 8,
            "dataMaxSizeY": 12,
            "dataMinSizeX": 4,
            "dataMinSizeY": 4,
            "dataSizeX": "4",
            "dataSizeY": "6",
            "filterName": "Diabetes",
            "viewType": "summary",
            "maximizeScreen": "news-feed"
        }, {
            "id": "stackedGraph",
            "title": "Stacked Graphs",
            "instanceId": "dmcbw-stackedGraph-1",
            "region": "dmcbw-stackedGraph-1",
            "dataRow": "1",
            "dataCol": "5",
            "dataSizeX": "8",
            "dataSizeY": "8",
            "dataMaxSizeX": 12,
            "dataMaxSizeY": 12,
            "dataMinSizeX": 8,
            "dataMinSizeY": 4,
            "filterName": "Diabetes",
             "viewType": "expanded"
        }, {
            "id": "appointments",
            "title": "Appointments & Visits",
            "instanceId": "dmcbw-appointments-1",
            "region": "dmcbw-appointments-1",
            "dataRow": "1",
            "dataCol": "13",
            "dataMaxSizeX": 8,
            "dataMaxSizeY": 12,
            "dataMinSizeX": 4,
            "dataMinSizeY": 4,
            "dataSizeX": "4",
            "dataSizeY": "4",
            "filterName": "Diabetes",
            "maximizeScreen": "appointments-full",
            "viewType": "summary"
        }, {
            "id": "orders",
            "title": "Orders",
            "instanceId": "dmcbw-orders-1",
            "region": "dmcbw-orders-1",
            "dataRow": "5",
            "dataCol": "13",
            "dataMaxSizeX": 8,
            "dataMaxSizeY": 12,
            "dataMinSizeX": 4,
            "dataMinSizeY": 4,
            "dataSizeX": "4",
            "dataSizeY": "4",
            "filterName": "Diabetes",
            "maximizeScreen": "orders-full",
            "viewType": "summary"
        }, {
            "id": "cds_advice",
            "title": "Clinical Reminders",
            "instanceId": "dmcbw-cds_advice-1",
            "region": "dmcbw-cds_advice-1",
            "dataRow": "1",
            "dataCol": "17",
            "dataMaxSizeX": 8,
            "dataMaxSizeY": 12,
            "dataMinSizeX": 4,
            "dataMinSizeY": 4,
            "dataSizeX": "4",
            "dataSizeY": "6",
            "filterName": "Diabetes",
            "maximizeScreen": "cds-advice-full",
            "viewType": "summary"
        }, {
            "id": "vista_health_summaries",
            "title": "VistA Health Summaries",
            "instanceId": "dmcbw-vista_health_summaries-1",
            "region": "dmcbw-vista_health_summaries-1",
            "dataRow": "7",
            "dataCol": "17",
            "dataMaxSizeX": 8,
            "dataMaxSizeY": 12,
            "dataMinSizeX": 4,
            "dataMinSizeY": 4,
            "dataSizeX": "4",
            "dataSizeY": "6",
            "filterName": "Diabetes",
            "viewType": "summary"
        }, {
            "id": "medication_review",
            "title": "Medications Review",
            "instanceId": "dmcbw-medication_review-1",
            "region": "dmcbw-medication_review-1",
            "dataRow": "9",
            "dataCol": "5",
            "dataMaxSizeX": 12,
            "dataMaxSizeY": 12,
            "dataMinSizeX": 8,
            "dataMinSizeY": 4,
            "dataSizeX": "8",
            "dataSizeY": "4",
            "filterName": "Diabetes",
            "viewType": "expanded",
            "maximizeScreen": "medication-review"
        }, {
            "id": "documents",
            "title": "Documents",
            "instanceId": "dmcbw-documents-1",
            "region": "dmcbw-documents-1",
            "dataRow": "9",
            "dataCol": "13",
            "dataMaxSizeX": 8,
            "dataMaxSizeY": 12,
            "dataMinSizeX": 4,
            "dataMinSizeY": 4,
            "dataSizeX": "4",
            "dataSizeY": "4",
            "filterName": "Diabetes",
            "viewType": "summary",
            "maximizeScreen": "documents-list"
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

            OrdersFull.setUpEvents();
            var searchAppletChannel = ADK.Messaging.getChannel("activeMeds");
            searchAppletChannel.on('detailView', this.onResultClicked);

        },
        onStop: function() {
            var searchAppletChannel = ADK.Messaging.getChannel("activeMeds");
            searchAppletChannel.off('detailView', this.onResultClicked);
            OrdersFull.turnOffEvents();
        },
        patientRequired: true
    };

    return config;
});
