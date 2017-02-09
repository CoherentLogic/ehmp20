'use strict';

var _ = require('underscore');

var logger = require('bunyan').createLogger({
	name: 'test:VistaJS-authenticate',
	level: 'fatal'
});

var wConfig = require('./config');
var callRpc = require('../../src/RpcClient').RpcClient.callRpc;

var config = _.defaults(wConfig.vistaSites['9E7A'], {
	host: 'IP_ADDRESS',
	port: 9210,
	accessCode: 'PW',
	verifyCode: 'PW',
	context: 'HMP SYNCHRONIZATION CONTEXT',
	localIP: '127.0.0.1',
	localAddress: 'localhost',
	connectTimeout: 1000,
	sendTimeout: 5000
});

describe('verify RpcClient.callRpc() against Panorama', function() {
	describe('verify correct config info yields good result', function() {
		it('verified', function() {
			var testError;
			var testResult;
			var called = false;

			var expectedError = null;
			var expectedResult = /[0-9]{11}\^PROXY,EHMP(\^[0-9]*){10}\^PANORAMA\.VISTACORE\.US(\^[0-9]*){13}/;

			function callback(error, result) {
				called = true;
				testError = error;
				testResult = result;
			}

			callRpc(logger, config, 'ORWU USERINFO', callback);

			waitsFor(function() {
				return called;
			}, 'should be called', 5000);

			runs(function() {
				expect(testError).toEqual(expectedError);
				expect(testResult).toMatch(expectedResult);
			});
		});
	});

	describe('verify incorrect config info yields error result', function() {
		it('verified', function() {
			var testError;
			var testResult;
			var called = false;

			var expectedResult = null;

			function callback(error, result) {
				called = true;
				testError = error;
				testResult = result;
			}

			var conf = _.clone(config);
			conf.PORT      ;
			callRpc(logger, conf, 'ORWU USERINFO', callback);

			waitsFor(function() {
				return called;
			}, 'should be called', 10000);

			runs(function() {
				expect(testError).not.toBeNull();
				expect(testResult).toEqual(expectedResult);
			});
		});
	});
});