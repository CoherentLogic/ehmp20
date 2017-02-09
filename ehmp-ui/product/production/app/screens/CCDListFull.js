define(function() {
    'use strict';
    var screenConfig = {
        id: 'ccd-list-full',
        context: 'patient',
        contentRegionLayout: 'gridOne',
        appletHeader: 'navigation',
        appLeft: 'patientInfo',
        applets: [{
            id: 'ccd_grid',
            title: 'Community Health Summaries',
            region: 'center',
            fullScreen: true,
            viewType: 'expanded'
        }],
        locked: {
            filters: false
        },
        patientRequired: true,
        globalDatepicker: false
    };

    return screenConfig;
});