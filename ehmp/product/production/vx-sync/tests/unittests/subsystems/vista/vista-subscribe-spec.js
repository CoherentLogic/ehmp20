'use strict';

//-----------------------------------------------------------------------------------------
// This tests the vista-subscribe.js module.
//-----------------------------------------------------------------------------------------
require('../../../../env-setup');
var _ = require('underscore');
var VistaClient = require(global.VX_SUBSYSTEMS + 'vista/vista-client');
var dummyLogger = require(global.VX_DUMMIES + 'dummy-logger');
var dummyRpcClient = require(global.VX_DUMMIES + '/dummy-RpcClient').RpcClient;
var idUtil = require(global.VX_UTILS + 'patient-identifier-utils');

var hmpServer = 'TheHmpServer';

var config = {
    'vistaSites': {
        '9E7A': {
            'name': 'panorama',
            'host': 'IP_ADDRESS',
            'port': 9210,
            'accessCode': 'pu1234',
            'verifyCode': 'pu1234!!',
            'localIP': '127.0.0.1',
            'localAddress': 'localhost',
            'connectTimeout': 3000,
            'sendTimeout': 10000
        },
        'C877': {
            'name': 'kodak',
            'host': 'IP_ADDRESS',
            'port': 9210,
            'accessCode': 'pu1234',
            'verifyCode': 'pu1234!!',
            'localIP': '127.0.0.1',
            'localAddress': 'localhost',
            'connectTimeout': 3000,
            'sendTimeout': 10000
        }
    },
    'hmp.server.id': hmpServer,
    'hmp.version': '0.7-S65',
    'hmp.batch.size': '1000',
    'hmp.extract.schema': '3.001'
};

describe('vista-subscribe.js', function() {
    // beforeEach(function() {
    //     // Underlying JDS and RPC calls to monitor and make sure that they are made.
    //     //---------------------------------------------------------------------------
    //     spyOn(dummyRpcClient, 'callRpc').andCallThrough();
    // });

    describe('_createRpcConfigVprContext()', function() {
        it('Verify context was added correctly', function() {
            var siteConfig = config.vistaSites;
            var rpcConfig = VistaClient._createRpcConfigVprContext(siteConfig, 'C877');
            //          console.log("rpcConfig: %j", rpcConfig);
            expect(rpcConfig).toBeTruthy();
            expect(rpcConfig.name).toEqual('kodak');
            expect(rpcConfig.context).toEqual('HMP SYNCHRONIZATION CONTEXT');
        });
    });

    describe('fetchAppointment()', function() {
        it('Happy Path', function() {
            var handler = new VistaClient(dummyLogger, dummyLogger, config, dummyRpcClient);
            var site = 'C877';
            var dummyrpc = handler._getRpcClient(site);
            spyOn(dummyrpc, 'execute').andCallThrough();
            var expectedError;
            var expectedResponse;
            var called = false;
            handler.fetchAppointment(site, function(error, response) {
                expectedError = error;
                expectedResponse = response;
                called = true;
            });

            waitsFor(function() {
                return called;
            }, 'Call to fetchAppointment failed to return in time.', 500);

            runs(function() {
                expect(expectedError).toBeNull();
                //expect(expectedResponse).toEqual('success');
                expect(dummyrpc.execute.calls.length).toEqual(1);
                expect(dummyrpc.execute).toHaveBeenCalledWith('HMP PATIENT ACTIVITY', jasmine.any(Object), jasmine.any(Function));
            });
        });
    });

    describe('subscribe()', function() {
        it('Happy Path', function() {
            var handler = new VistaClient(dummyLogger, dummyLogger, config, dummyRpcClient);
            var site = 'C877';
            var dummyrpc = handler._getRpcClient(site);
            spyOn(dummyrpc, 'execute').andCallThrough();
            var dfn = '3';
            var patientIdentifier = idUtil.create('pid', site + ';' + dfn);
            var rootJobId = '1';
            var jobIds = [{domain:'allergy', jobId:'3'}];
            var jobPriority = 5;
            var expectedError;
            var expectedResponse;
            var called = false;
            handler.subscribe('C877', patientIdentifier, rootJobId, jobIds, jobPriority, function(error, response) {
                expectedError = error;
                expectedResponse = response;
                called = true;
            });

            waitsFor(function() {
                return called;
            }, 'Call to subscribe failed to return in time.', 500);

            runs(function() {
                expect(expectedError).toBeNull();
                expect(expectedResponse).toEqual('success');
                expect(dummyrpc.execute.calls.length).toEqual(1);
                expect(dummyrpc.execute).toHaveBeenCalledWith('HMPDJFS API',
                    jasmine.objectContaining({
                        '"server"': hmpServer,
                        '"command"': 'putPtSubscription',
                        '"localId"': dfn,
                        '"rootJobId"': rootJobId,
                        '"HMPPriority"': jobPriority.toString(),
                        '"jobDomainId-allergy"': jobIds[0].jobId
                    }), jasmine.any(Function));
            });
        });
    });

    describe('unsubscribe()', function() {
        it('Happy Path', function() {
            var handler = new VistaClient(dummyLogger, dummyLogger, config, dummyRpcClient);
            var site = 'C877';
            var dummyrpc = handler._getRpcClient(site);
            spyOn(dummyrpc, 'execute').andCallThrough();
            var dfn = '3';
            var patientIdentifier = idUtil.create('pid', site + ';' + dfn);
            var expectedError;
            var expectedResponse;
            var called = false;
            handler.unsubscribe(patientIdentifier.value, function(error, response) {
                expectedError = error;
                expectedResponse = response;
                called = true;
            });

            waitsFor(function() {
                return called;
            }, 'Call to subscribe failed to return in time.', 500);

            runs(function() {
                expect(expectedError).toBeNull();
                expect(expectedResponse).toEqual('success');
                expect(dummyrpc.execute.calls.length).toEqual(1);
                expect(dummyrpc.execute).toHaveBeenCalledWith('HMPDJFS DELSUB',
                    jasmine.objectContaining({
                        '"hmpSrvId"': hmpServer,
                        '"pid"': patientIdentifier.value
                    }), jasmine.any(Function));
            });
        });
    });

    describe('status()', function() {
        it('invokes the HMP SUBSCRIPTION STATUS RPC', function() {
            var handler = new VistaClient(dummyLogger, dummyLogger, config, dummyRpcClient);
            var site = 'C877';
            var dummyrpc = handler._getRpcClient(site);
            spyOn(dummyrpc, 'execute').andCallThrough();
            var dfn = '3';
            var patientIdentifier = idUtil.create('pid', site + ';' + dfn);
            var expectedError;
            var expectedResponse;
            var called = false;
            handler.status(patientIdentifier.value, function(error, response) {
                expectedError = error;
                expectedResponse = response;
                called = true;
            });

            waitsFor(function() {
                return called;
            }, 'Call to subscribe failed to return in time.', 500);

            runs(function() {
                expect(expectedError).not.toBeNull();
                expect(expectedResponse).toBeUndefined();
                expect(dummyrpc.execute.calls.length).toEqual(1);
                expect(dummyrpc.execute).toHaveBeenCalledWith('HMP SUBSCRIPTION STATUS',
                    jasmine.objectContaining({
                        '"server"': hmpServer,
                        '"localId"': patientIdentifier.value.split(';')[1]
                    }), jasmine.any(Function));
            });
        });
    });

    describe('getDemographics()', function() {
        it('Happy Path', function() {
            var handler = new VistaClient(dummyLogger, dummyLogger, config, dummyRpcClient);
            var vistaId = 'C877';
            var dummyrpc = handler._getRpcClient(vistaId);
            spyOn(dummyrpc, 'execute').andCallThrough();
            var dfn = '3';
            var expectedError;
            var expectedResponse;

            var called = false;
            handler.getDemographics(vistaId, dfn, function(error, response) {
                expectedError = error;
                expectedResponse = response;
                called = true;
            });

            waitsFor(function() {
                return called;
            }, 'Call to subscribe failed to return in time.', 500);

            runs(function() {
                expect(expectedError).toBeTruthy(); // This is because we are calling the dummyRPC and it does not return a valid result.
                expect(expectedResponse).toBeNull(); // This is because we are calling the dummyRPC
                expect(dummyrpc.execute.calls.length).toEqual(1);
                expect(dummyrpc.execute).toHaveBeenCalledWith('HMP GET PATIENT DATA JSON',
                    jasmine.objectContaining({
                        '"patientId"': dfn,
                        '"domain"': 'patient',
                        '"extractSchema"': '3.001'
                    }), jasmine.any(Function));
            });
        });
    });

    describe('fetchNextBatch()', function() {
        it('Happy Path', function(){
            var complete = false;
            var fakeVista = {
                log: dummyLogger,
                metrics: dummyLogger,
                config: config,
                rpcClient: {
                    callNumber: -1,
                    execute: function(rpc, params, callback){
                        this.callNumber++;
                        expect(params['"max"']).toEqual(this.batchSize[this.callNumber]);
                        callback(this.errors[this.callNumber],this.results[this.callNumber]);
                    },
                    batchSize: ['1000'],
                    errors: [null],
                    results: ['{\"apiVersion\": 1.02,\"params\":{\"domain\":\"KODAK.VISTACORE.US\",\"systemId\":\"C877\"},\"data\":{\"updated\":\"20150721120512\",\"totalItems\":1000,\"lastUpdate\" : \"3150721-11303\"},\"items\":[{},{}]}']
                },
                _getRpcClient: function(){
                    return this.rpcClient;
                }
            };
            var vistaId = '9E7A';
            var hmpBatchSize = '1000';
            var lastupdatetime = '0';
            runs(function() {
                VistaClient.prototype.fetchNextBatch.call(fakeVista,vistaId, lastupdatetime, hmpBatchSize, function(error, response){
                    complete = true;
                    expect(error).toBeFalsy();
                    expect(response).toBeTruthy();
                    expect(response.rawResponse).toBeFalsy();
                    expect(response.hmpBatchSize).toEqual(hmpBatchSize);
                    expect(response.data).toEqual(JSON.parse(fakeVista.rpcClient.results[0]).data);
                });
            });
            waitsFor(function(){
                return complete;
            }, 'Waiting for Vista client to process response');
        });


        it('One JSON processing error then error out single record', function(){
            var complete = false;
            var fakeVista = {
                log: dummyLogger,
                metrics: dummyLogger,
                config: config,
                fetchNextBatch: function(vistaId, lastupdatetime, hmpBatchSize, callback){
                    expect(_.isString(hmpBatchSize)).toBeTruthy();
                    VistaClient.prototype.fetchNextBatch.call(fakeVista, vistaId, lastupdatetime, hmpBatchSize, callback);
                },
                rpcClient: {
                        callNumber: -1,
                        execute: function(rpc, params, callback){
                            this.callNumber++;
                            expect(params['"max"']).toEqual(this.batchSize[this.callNumber]);
                            callback(this.errors[this.callNumber],this.results[this.callNumber]);
                        },
                        errors: [null, null],
                        batchSize: ['2', '1'],
                        results: ['{\"apiVersion\": 1.02,\"params\":{\"domain\":\"KODAK.VISTACORE.US\",\"systemId\":\"C877\"},\"data\":{\"updated\":\"20150721120512\",\"totalItems\":,\"lastUpdate\" : \"3150721-11303\"},\"items\":[{},{}]}',
                        '{\"apiVersion\": 1.02,\"params\":{\"domain\":\"KODAK.VISTACORE.US\",\"systemId\":\"C877\"},\"data\":{\"updated\":\"20150721120512\",\"totalItems\":,\"lastUpdate\" : \"3150721-11303\"},\"items\":[{},{}]}']
                    },
                _getRpcClient: function(){
                    return this.rpcClient;
                }
            };
            var vistaId = '9E7A';
            var hmpBatchSize = '2';
            var lastupdatetime = '0';
            runs(function() {
                VistaClient.prototype.fetchNextBatch.call(fakeVista,vistaId, lastupdatetime, hmpBatchSize, function(error, response){
                    complete = true;
                    expect(error).toBeTruthy();
                    expect(response).toBeTruthy();
                    expect(response.rawResponse).toBe(fakeVista.rpcClient.results[1]);
                    expect(response.data).toBeFalsy();
                });
            });
            waitsFor(function(){
                return complete;
            }, 'Waiting for Vista client to process response');
        });

        it('One JSON processing error then success', function(){
            var complete = false;
            var fakeVista = {
                log: dummyLogger,
                metrics: dummyLogger,
                config: config,
                fetchNextBatch: function(vistaId, lastupdatetime, hmpBatchSize, callback){
                    expect(_.isString(hmpBatchSize)).toBeTruthy();
                    VistaClient.prototype.fetchNextBatch.call(fakeVista, vistaId, lastupdatetime, hmpBatchSize, callback);
                },
                rpcClient: {
                        callNumber: -1,
                        execute: function(rpc, params, callback){
                            this.callNumber++;
                            expect(params['"max"']).toEqual(this.batchSize[this.callNumber]);
                            callback(this.errors[this.callNumber],this.results[this.callNumber]);
                        },
                        errors: [null, null],
                        batchSize: ['1000', '500'],
                        results: ['{\"apiVersion\": 1.02,\"params\":{\"domain\":\"KODAK.VISTACORE.US\",\"systemId\":\"C877\"},\"data\":{\"updated\":\"20150721120512\",\"totalItems\":,\"lastUpdate\" : \"3150721-11303\"},\"items\":[{},{}]}',
                        '{\"apiVersion\": 1.02,\"params\":{\"domain\":\"KODAK.VISTACORE.US\",\"systemId\":\"C877\"},\"data\":{\"updated\":\"20150721120512\",\"totalItems\":1000,\"lastUpdate\" : \"3150721-11303\"},\"items\":[{},{}]}']
                    },
                _getRpcClient: function(){
                    return this.rpcClient;
                }
            };
            var vistaId = '9E7A';
            var hmpBatchSize = '1000';
            var lastupdatetime = '0';
            runs(function() {
                VistaClient.prototype.fetchNextBatch.call(fakeVista,vistaId, lastupdatetime, hmpBatchSize, function(error, response){
                    complete = true;
                    expect(error).toBeFalsy();
                    expect(response).toBeTruthy();
                    expect(response.rawResponse).toBeFalsy();
                    expect(response.data).toEqual(JSON.parse(fakeVista.rpcClient.results[1]).data);
                });
            });
            waitsFor(function(){
                return complete;
            }, 'Waiting for Vista client to process response');
        });

        it('More than one JSON processing error then success', function(){
            var complete = false;
            var fakeVista = {
                log: dummyLogger,
                metrics: dummyLogger,
                config: config,
                fetchNextBatch: function(vistaId, lastupdatetime, hmpBatchSize, callback){
                    expect(_.isString(hmpBatchSize)).toBeTruthy();
                    VistaClient.prototype.fetchNextBatch.call(fakeVista, vistaId, lastupdatetime, hmpBatchSize, callback);
                },
                rpcClient: {
                        callNumber: -1,
                        execute: function(rpc, params, callback){
                            this.callNumber++;
                            expect(params['"max"']).toEqual(this.batchSize[this.callNumber]);
                            callback(this.errors[this.callNumber],this.results[this.callNumber]);
                        },
                        errors: [null, null, null],
                        batchSize: ['3', '2', '1'],
                        results: ['{\"apiVersion\": 1.02,\"params\":{\"domain\":\"KODAK.VISTACORE.US\",\"systemId\":\"C877\"},\"data\":{\"updated\":\"20150721120512\",\"totalItems\":,\"lastUpdate\" : \"3150721-11303\"},\"items\":[{},{}]}',
                        '{\"apiVersion\": 1.02,\"params\":{\"domain\":\"KODAK.VISTACORE.US\",\"systemId\":\"C877\"},\"data\":{\"updated\":\"20150721120512\",\"totalItems\":,\"lastUpdate\" : \"3150721-11303\"},\"items\":[{},{}]}',
                        '{\"apiVersion\": 1.02,\"params\":{\"domain\":\"KODAK.VISTACORE.US\",\"systemId\":\"C877\"},\"data\":{\"updated\":\"20150721120512\",\"totalItems\":1000,\"lastUpdate\" : \"3150721-11303\"},\"items\":[{},{}]}']
                    },
                _getRpcClient: function(){
                    return this.rpcClient;
                }
            };
            var vistaId = '9E7A';
            var hmpBatchSize = '3'; //try batch size that isn't a power of 2
            var lastupdatetime = '0';
            runs(function() {
                VistaClient.prototype.fetchNextBatch.call(fakeVista,vistaId, lastupdatetime, hmpBatchSize, function(error, response){
                    complete = true;
                    expect(error).toBeFalsy();
                    expect(response).toBeTruthy();
                    expect(response.rawResponse).toBeFalsy();
                    expect(response.data).toEqual(JSON.parse(fakeVista.rpcClient.results[2]).data);
                });
            });
            waitsFor(function(){
                return complete;
            }, 'Waiting for Vista client to process response');
        });

        it('No data or warn message from Vista', function(){
            var complete = false;
            var fakeVista = {
                log: dummyLogger,
                metrics: dummyLogger,
                config: config,
                fetchNextBatch: function(vistaId, lastupdatetime, hmpBatchSize, callback){
                    expect(_.isString(hmpBatchSize)).toBeTruthy();
                    VistaClient.prototype.fetchNextBatch.call(fakeVista, vistaId, lastupdatetime, hmpBatchSize, callback);
                },
                rpcClient: {
                        callNumber: -1,
                        execute: function(rpc, params, callback){
                            this.callNumber++;
                            expect(params['"max"']).toEqual(this.batchSize[this.callNumber]);
                            callback(this.errors[this.callNumber],this.results[this.callNumber]);
                        },
                        errors: [null],
                        batchSize: ['1000'],
                        results: ['{\"apiVersion\": 1.02,\"params\":{\"domain\":\"KODAK.VISTACORE.US\",\"systemId\":\"C877\"}}']
                    },
                _getRpcClient: function(){
                    return this.rpcClient;
                }
            };
            var vistaId = '9E7A';
            var hmpBatchSize = '1000';
            var lastupdatetime = '0';
            runs(function() {
                VistaClient.prototype.fetchNextBatch.call(fakeVista,vistaId, lastupdatetime, hmpBatchSize, function(error, response){
                    complete = true;
                    expect(error).toBeTruthy();
                    expect(response).toBeTruthy();
                    expect(response.rawResponse).toBeFalsy();
                    expect(response.hmpBatchSize).toEqual(hmpBatchSize);
                    expect(response.data).toBeFalsy();
                });
            });
            waitsFor(function(){
                return complete;
            }, 'Waiting for Vista client to process response');
        });

    });

});