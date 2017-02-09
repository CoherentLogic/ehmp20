'use strict';

require('../../env-setup');
var inspect = require('util').inspect;
var rpcUtil = require(global.VX_UTILS + '/rpc-util');

var argv = require('yargs')
	.usage('Usage: $0 [options...]')
	.demand(['host', 'port', 'pid'])
	.describe('host', 'IP Address of the VistA host')
	.describe('port', 'Port of the VistA host')
	.describe('pid', 'PID of the patient for the unsubscribe request')
	.describe('accessCode', 'Value to use for accessCode for validation. Defaults to ep1234')
	.describe('verifyCode', 'Value to use for verifyCode for validation. Defaults to ep1234!!')
	.describe('localIP', 'Value to use for the localIP parameter in the RPC call. Defaults to 127.0.0.1')
	.describe('localAddress', 'Value to use for the localAddress parameter in the RPC call. Defaults to localhost')
	.describe('connectTimeout', 'Value in milliseconds to use for the connectTimeout parameter in the RPC call. Defaults to 3000')
	.describe('sendTimeout', 'Value in milliseconds to use for the sendTimeout parameter in the RPC call. Defaults to 10000')
	.describe('context', 'Context to set for running the RPC. Defaults to HMP SYNCHRONIZATION CONTEXT')
	.describe('hmpServerId', 'Value for the hmpServerId parameter. Defaults to hmp-development-box')
	.describe('logLevel', 'bunyan log levels, one of: trace, debug, info, warn, error, fatal. Defaults to error.')
	.argv;


var logger = require('bunyan').createLogger({
	name: 'rpc',
	level: argv.logLevel || 'error'
});

var config = {
	host: argv.host,
	port: argv.port,
	accessCode: argv.accessCode || 'ep1234',
	verifyCode: argv.verifyCode || 'ep1234!!',
	localIP: argv.localIP || '127.0.0.1',
	localAddress: argv.localAddress || 'localhost',
	context: argv.context || 'HMP SYNCHRONIZATION CONTEXT',
	connectTimeout: argv.connectTimeout || 3000,
	sendTimeout: argv.sendTimeout || 10000
};


var rpc = 'HMPDJFS DELSUB';
var params = {
	'"hmpSrvId"': argv.hmpServerId || 'hmp-development-box',
	'"pid"': argv.pid
};


rpcUtil.standardRPCCall(logger, config, rpc, params, null, function(error, response) {
	logger.debug('Completed calling Unsubscribe RPC for pid: %s; result: %j', argv.pid, response);
	if (error) {
		console.log('Error calling Unsubscribe for pid: %s', argv.pid);
		console.log(error);
		if(response) {
			console.log(response);
		}
		process.exit(1);
	}

	console.log('Called Unsubscribe for pid: %s', argv.pid);
	console.log('Response:');
	try {
		console.log(inspect(JSON.parse(response), {
			depth: null
		}));
	} catch (err) {
		console.log(response);
	}
	process.exit(0);
});