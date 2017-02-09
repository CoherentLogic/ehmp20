'use strict';

require('../../../../env-setup');
var handle = require(global.VX_HANDLERS + 'jmeadows-sync-domain-request/jmeadows-sync-domain-request-handler');
var jobUtils = require(global.VX_UTILS + 'job-utils');
var dummyLogger = require(global.VX_DUMMIES + '/dummy-logger');
var VistaClientDummy = require(global.VX_DUMMIES + 'vista-client-dummy');
var jobStatusUpdaterDummy = require(global.VX_DUMMIES + '/JobStatusUpdaterDummy');
var testHandler = require(global.VX_INTTESTS + 'framework/handler-test-framework').testHandler;

var vx_sync_ip = require(global.VX_INTTESTS + 'test-config');

// dummyLogger = require('bunyan').createLogger({
//     name: 'test',
//     level: 'debug'
// });

var config = {
    jmeadows: {
        domains: ['allergy'],
        allergy: {
            host: vx_sync_ip,
            port: 5400,
            path: '/dod/allergy',
            method: 'GET'
        }
    },
};

var job = {
    type: jobUtils.jmeadowsDomainSyncRequestType('allergy'),
    patientIdentifier: {
        type: 'pid',
        value: 'DOD;0000000003'
    },
    dataDomain: 'allergy'
};

describe('jmeadows-sync-domain-request-handler.js', function() {
    var environment = {
        vistaClient: new VistaClientDummy(dummyLogger, config, null),
        jobStatusUpdater: jobStatusUpdaterDummy,
        metrics: dummyLogger
    };

    var host = vx_sync_ip;
    var PORT       ;
    var tubename = 'vx-sync-test';

    var jobTypes = [jobUtils.jmeadowsDomainXformVprType('allergy')];

    testHandler(handle, dummyLogger, config, environment, host, port, tubename, job, jobTypes, 30000);
});