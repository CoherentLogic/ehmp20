define([
    'underscore',
    'hbs!app/applets/vitalsObservationList/templates/vitalsObservationListFooterTemplate'
], function(_, vitalsObservationListFooterTemplate) {
    "use strict";

    var vitalsObservationListFooterView = Backbone.Marionette.ItemView.extend({
        'template': vitalsObservationListFooterTemplate
    });

    return vitalsObservationListFooterView;
});
