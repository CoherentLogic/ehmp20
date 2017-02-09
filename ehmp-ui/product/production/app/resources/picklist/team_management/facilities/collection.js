define([
], function() {
    'use strict';

    var Facility = ADK.Resources.Picklist.Model.extend({
        idAttribute: 'facilityID',
        label: 'vistaName',
        value: 'facilityID',
        childParse: 'false',
        defaults: {
            facilityID: '',
            vistaName: ''
        }
    });

    var Facilities = ADK.Resources.Picklist.Collection.extend({
        type: 'facilities',
        model: Facility,
        params: function(method, options) {
            return {
                siteCode: options.siteCode || ''
            };
        }
    });

    return Facilities;
});
