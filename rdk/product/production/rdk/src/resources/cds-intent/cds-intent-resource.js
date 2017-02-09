/*jslint node: true */
'use strict';

var cdsIntent = require('./cds-intent');
var interceptors = {
    operationalDataCheck: false,
    pep: false,
    synchronize: false
};

exports.getResourceConfig = function(app) {

    // db setup
    cdsIntent.init(app);

    return [{
        name: 'cds-intent-cds-intent-get',
        path: '/registry',
        get: require('./cds-intent').getIntent,
        interceptors: interceptors,
        requiredPermissions: [],
        isPatientCentric: false
    }, {
        name: 'cds-intent-cds-intent-post',
        path: '/registry',
        post: require('./cds-intent').postIntent,
        interceptors: interceptors,
        requiredPermissions: [],
        isPatientCentric: false
    }, {
        name: 'cds-intent-cds-intent-put',
        path: '/registry',
        put: require('./cds-intent').putIntent,
        interceptors: interceptors,
        requiredPermissions: [],
        isPatientCentric: false
    }, {
        name: 'cds-intent-cds-intent-delete',
        path: '/registry',
        delete: require('./cds-intent').deleteIntent,
        interceptors: interceptors,
        requiredPermissions: [],
        isPatientCentric: false
    }];
};
