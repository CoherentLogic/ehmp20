'use strict';

var _ = require('underscore');
// var inspect = _.partial(require('util').inspect, _, {
//     depth: null
// });

require('../../../../env-setup');

var logger = require(global.VX_DUMMIES + 'dummy-logger');
var jobUtil = require(global.VX_UTILS + 'job-utils');
var testHandler = require(global.VX_INTTESTS + 'framework/handler-test-framework').testHandler;
var patientIdUtil = require(global.VX_UTILS + 'patient-identifier-utils');
var handler = require(global.VX_HANDLERS + 'enterprise-sync-request/enterprise-sync-request-handler');
var VistaClient = require(global.VX_SUBSYSTEMS + 'vista/vista-client');
// var queueConfig = require(global.VX_JOBFRAMEWORK).QueueConfig;
var val = require(global.VX_UTILS + 'object-utils').getProperty;

var vx_sync_ip = require(global.VX_INTTESTS + 'test-config');

// var PublisherRouter = require(global.VX_JOBFRAMEWORK).PublisherRouter;
var MviClient = require(global.VX_SUBSYSTEMS + 'mvi/mvi-client');
var JdsClient = require(global.VX_SUBSYSTEMS + 'jds/jds-client');
var JobStatusUpdater = require(global.VX_SUBSYSTEMS + 'jds/JobStatusUpdater');
var wConfig = require(global.VX_ROOT + 'worker-config');

// logger = require('bunyan').createLogger({
//     name: 'dummy-log',
//     level: 'debug'
// });

describe('enterprise-sync-request-handler.js', function() {
    var patientIdentifier = patientIdUtil.create('icn', '5000000126V406128');
    var jpid;
    var job;
    var host = vx_sync_ip;
    var PORT       ;
    var tubename = 'vx-sync-test';

    var beanstalkConfig = ({
        repoUniversal: {
            priority: 10,
            delay: 0,
            ttr: 60,
            timeout: 10,
            initMillis: 1000,
            maxMillis: 15000,
            incMillis: 1000
        },
        repoDefaults: {
            host: host,
            port: port,
            tubename: tubename,
            tubePrefix: 'vxs-',
            jobTypeForTube: false
        },
        jobTypes: {
            'enterprise-sync-request': {},
            'vista-operational-subscribe-request': {},

            'vista-9E7A-subscribe-request': {},
            'vista-C877-subscribe-request': {},

            'hdr-sync-request': {},
            'vler-sync-request': {},
            'pgd-sync-request': {},
            'jmeadows-sync-request': {},

            'hdr-xform-vpr': {},
            'vler-xform-vpr': {},
            'pgd-xform-vpr': {},

            'jmeadows-sync-allergy-request': {},
            'jmeadows-sync-appointment-request': {},
            'jmeadows-sync-consult-request': {},
            'jmeadows-sync-demographics-request': {},
            'jmeadows-sync-dischargeSummary-request': {},
            'jmeadows-sync-encounter-request': {},
            'jmeadows-sync-immunization-request': {},
            'jmeadows-sync-lab-request': {},
            'jmeadows-sync-medication-request': {},
            'jmeadows-sync-note-request': {},
            'jmeadows-sync-order-request': {},
            'jmeadows-sync-problem-request': {},
            'jmeadows-sync-progressNote-request': {},
            'jmeadows-sync-radiology-request': {},
            'jmeadows-sync-vital-request': {},

            'jmeadows-xform-allergy-vpr': {},
            'jmeadows-xform-appointment-vpr': {},
            'jmeadows-xform-consult-vpr': {},
            'jmeadows-xform-demographics-vpr': {},
            'jmeadows-xform-dischargeSummary-vpr': {},
            'jmeadows-xform-encounter-vpr': {},
            'jmeadows-xform-immunization-vpr': {},
            'jmeadows-xform-lab-vpr': {},
            'jmeadows-xform-medication-vpr': {},
            'jmeadows-xform-note-vpr': {},
            'jmeadows-xform-order-vpr': {},
            'jmeadows-xform-problem-vpr': {},
            'jmeadows-xform-progressNote-vpr': {},
            'jmeadows-xform-radiology-vpr': {},
            'jmeadows-xform-vital-vpr': {},

            'jmeadows-pdf-document-transform': {},
            'jmeadows-document-retrieval': {},

            'record-enrichment': {},
            'store-record': {},
            'event-prioritization-request': {},
            'operational-store-record': {},
            'publish-data-change-event': {},
            'patient-data-state-checker': {}
        }
    });


    var config = {
        'vistaSites': {
            '9E7A': _.defaults(wConfig.vistaSites['9E7A'], {
                'name': 'panorama',
                'host': 'IP_ADDRESS',
                'port': 9210,
                'accessCode': 'PW',
                'verifyCode': 'PW',
                'localIP': '127.0.0.1',
                'localAddress': 'localhost',
                'connectTimeout': 3000,
                'sendTimeout': 10000
            }),
            'C877': _.defaults(wConfig.vistaSites.C877, {
                'name': 'kodak',
                'host': 'IP_ADDRESS',
                'port': 9210,
                'accessCode': 'PW',
                'verifyCode': 'PW',
                'localIP': '127.0.0.1',
                'localAddress': 'localhost',
                'connectTimeout': 3000,
                'sendTimeout': 10000
            })
        },
        beanstalkConfig: beanstalkConfig,
        mvi: {
            protocol: 'http',
            host: vx_sync_ip,
            port: 5400,
            path: '/mvi/correspondingIds'
        },
        jds: _.defaults(wConfig.jds, {
            protocol: 'http',
            host: 'IP_ADDRESS',
            port: 9080
        }),
        rules: {
            'accept-all': {},
            'rapid-fire': {},
            // 'operational-data-sync': {},
            'expiration': {
                'default': 3600000,
                'dod': 3600000
            }
        },
        synchronizationRules: ['accept-all-rule'],
        'hdr': {
            'operationMode': 'REQ/RES',
            'hdrSites': {
                'FFC7': {
                    'stationNumber': '536'
                },
                '2939': {
                    'stationNumber': '551'
                },
                '76C6': {
                    'stationNumber': '547'
                }
            }
        },
        'vistaSitesByStationCombined': _.defaults(wConfig.vistaSitesByStationCombined, {})
    };

    var environment = {
        // publisherRouter: {},
        mvi: new MviClient(logger, logger, config),
        jds: new JdsClient(logger, logger, config),
        metrics: logger,
        vistaClient: new VistaClient(logger, logger, config, null)
    };
    environment.jobStatusUpdater = new JobStatusUpdater(logger, config, environment.jds);
    // environment.publisherRouter = new PublisherRouter(logger, config, environment.jobStatusUpdater);

    var matchingJobTypes = [
        jobUtil.vistaSubscribeRequestType('9E7A'),
        jobUtil.vistaSubscribeRequestType('C877'),
        jobUtil.hdrSyncRequestType(),
        // jobUtil.pgdSyncRequestType(),
        jobUtil.vlerSyncRequestType(),
        // jobUtil.jmeadowsSyncRequestType()    //5000000126V406128 does not have a DOD record
    ];
    it('Set up and run test', function() {

        var setUpDone = false;

        runs(function() {
            environment.jds.storePatientIdentifier({
                patientIdentifiers: [patientIdentifier.value]
            }, function(error, response) {
                expect(error).toBeFalsy();

                jpid = val(response, ['headers', 'location']).replace(/(^http:\/\/.*\/vpr\/jpid\/)/, '');
                job = jobUtil.createEnterpriseSyncRequest(patientIdentifier, jpid, false);

                setUpDone = true;
            });
        });

        waitsFor(function() {
            return setUpDone;
        }, 'set up', 20000);

        runs(function() {
            testHandler(handler, logger, config, environment, host, port, tubename, job, matchingJobTypes, 90000, function(result) {
                expect(result).toBeTruthy();
            });
        });
    });

    afterEach(function() {
        var checkIdentifiersDone = false;
        // var expectedPatientIdentifierValues = [ '5000000126V406128', '9E7A;100625', 'C877;100625', 'HDR;5000000126V406128', 'DAS;5000000126V406128', 'VLER;5000000126V406128' ];
        var expectedPatientIdentifierValues = ['5000000126V406128', '9E7A;100625', 'C877;100625', 'HDR;5000000126V406128', 'JPID;' + jpid, 'VLER;5000000126V406128'];
        var jdsError, jdsResponse;
        runs(function() {
            environment.jds.getPatientIdentifier(job, function(error, response) {
                checkIdentifiersDone = true;
                jdsError = error;
                jdsResponse = response;
            });
        });

        waitsFor(function() {
            return checkIdentifiersDone;
        }, 'response from JDS', 10000);


        var checkVhicIdEventDone = false;
        runs(function() {
            environment.jds.getPatientDataByUid('urn:va:vhic-id:JPID:' + jpid + ':' + jpid, function(error, response, result) {
                checkVhicIdEventDone = true;
                expect(error).toBeFalsy();
                expect(response).toBeTruthy();
                expect(result).toBeTruthy();
                expect(val(result, ['data', 'items'])).toBeTruthy();
                var vhicIds = val(result, ['data', 'items', 0, 'vhicIds']);
                expect(vhicIds).toBeTruthy();
                expect(vhicIds).toContain(jasmine.objectContaining({
                    'vhicId': '1325'
                }));
            });
        });
        waitsFor(function() {
            return checkVhicIdEventDone;
        });

        var teardownDone = false;

        runs(function() {
            expect(jdsError).toBeFalsy();
            expect(jdsResponse).toBeTruthy();
            expect(val(jdsResponse, 'statusCode')).toEqual(200);

            var body;
            try {
                body = JSON.parse(jdsResponse.body);
            } catch (error) {
                // Do nothing
            }

            //Clean up the patient we created for the test
            expect(val(body, 'patientIdentifiers')).toEqual(expectedPatientIdentifierValues);
            environment.jds.deletePatientByPid(patientIdentifier.value, function() {
                teardownDone = true;
            });
        });

        waitsFor(function() {
            return teardownDone;
        }, 'clear test patient from JDS');
    });

});