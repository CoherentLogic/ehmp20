define([
        "app/applets/vitals/gistConfig",
        "app/applets/vitals/vitalsCollectionHandler",
    ],
    function(GistConfig, CollectionHandler) {
        "use strict";

        var GistView = ADK.AppletViews.ObservationsGistView.extend({
            initialize: function(options) {
                var self = this;
                this._super = ADK.AppletViews.ObservationsGistView.prototype;
                var patientType = ADK.PatientRecordService.getCurrentPatient().patientStatusClass();

                this.appletOptions = {
                    filterFields: GistConfig.filterFields,
                    gistModel: GistConfig.gistModel,
                    collection: CollectionHandler.fetchVitalsCollection(GistConfig.fetchOptions, patientType, 'gist'),
                    collectionParser: GistConfig.transformCollection,
                    gistHeaders: GistConfig.gistHeaders,
                    enableTileSorting: GistConfig.enableTileSorting,
                    tileSortingUniqueId: GistConfig.tileSortingUniqueId,
                    onClickRow: function(model, event) {
                        var uid = model.get('uid');
                        var currentPatient = ADK.PatientRecordService.getCurrentPatient();
                        ADK.Messaging.getChannel("vitals").trigger('detailView', {
                            uid: uid,
                            patient: {
                                icn: currentPatient.attributes.icn,
                                pid: currentPatient.attributes.pid
                            }
                        });
                    }
                };
                this._super.initialize.apply(this, arguments);
            }
        });

        return GistView;
    });