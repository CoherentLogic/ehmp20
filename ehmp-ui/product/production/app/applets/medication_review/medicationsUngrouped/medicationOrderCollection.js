define([
    'backbone',
    'app/applets/medication_review/medicationsUngrouped/medicationOrderModel'
], function(Backbone, MedicationOrderModel) {
    'use strict';

    return Backbone.Collection.extend({
        model: MedicationOrderModel,
        defaultResourceTitle: 'patient-record-med',
        defaultCriteria: {
            filter: 'nin(vaStatus,["CANCELLED", "UNRELEASED"])'
        },
        performFetch: function(options) {
            // if options.expireCache, etc.
            options = options || {};
            if (options.expireCache === true && this.url) {
                ADK.ResourceService.clearCache(this.url);
            }
            var fetchOptions = {
                resourceTitle: this.defaultResourceTitle,
                criteria: this.defaultCriteria,
                onSuccess: options.onSuccess,
                onError: options.onError
            };
            ADK.PatientRecordService.fetchCollection(fetchOptions, this);
        },
        refresh: function(options) {
            this.performFetch(options);
        }
    });

});