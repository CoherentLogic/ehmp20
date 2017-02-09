/*jslint node: true */
'use strict';

var jdsSyncConfig = require('./jds-sync-config');

describe('jds-sync-config\'s', function() {
    var req;

    beforeEach(function() {
        req = buildRequest();
    });

    describe('getSyncConfig', function() {
        it('should use the app config\'s timeout', function() {
            var config = jdsSyncConfig.getSyncConfig('loadPatient', req);
            expect(config.timeout).to.equal(req.app.config.jdsSync.settings.timeoutMillis);
        });

        it('should use the app\'s server config', function() {
            req.app.config.vxSyncServer.baseUrl = 'http://testHost';
            var config = jdsSyncConfig.getSyncConfig('loadPatient', req);
            expect(config.baseUrl).to.equal('http://testHost');
        });

        it('should deep clone the config', function() {
            var config = jdsSyncConfig.getSyncConfig('loadPatient', req);
            config.wrong = true;
            config = jdsSyncConfig.getSyncConfig('loadPatient', req);
            expect(config.wrong).to.be.undefined();
        });
    });

    describe('setupAudit', function() {
        it('should set the audit category and pid', function() {
            var pid = 'test;id';
            jdsSyncConfig.setupAudit(pid, req);
            expect(req.audit.logCategory).to.equal('SYNC');
            expect(req.audit.patientId).to.equal(pid);
        });

        it('shouldn\'t overwrite with a missing pid', function() {
            req.audit.patientId = 'original';
            jdsSyncConfig.setupAudit(null, req);
            expect(req.audit.logCategory).to.equal('SYNC');
            expect(req.audit.patientId).to.equal('original');
        });
    });

    function buildRequest(request) {
        if (!request) {
            request = {};
        }

        request.logger = {
            trace: function(){},
            debug: function(){},
            info: function(){},
            warn: function(){},
            error: function(){}
        };

        request.audit = {};

        request.app = {
            config: {
                jdsServer: {
                    host: 'jdshost',
                    port: 1
                },
                vxSyncServer: {
                    host: 'vxsynchost',
                    port: 2
                },
                hmpServer: {
                    host: 'hmphost',
                    port: 3,
                    accessCode: '9E7A;500',
                    verifyCode: 'ep1234;ep1234!!'
                },
                jdsSync: {
                    settings: {
                        timeoutMillis: 100,
                        waitMillis: 40
                    }
                },
                vistaSites: {
                    '9E7A': {},
                    'C877': {}
                }
            },
            subsystems: {}
        };

        return request;
    }
});
