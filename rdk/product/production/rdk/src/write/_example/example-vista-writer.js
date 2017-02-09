'use strict';

var async = require('async');
var rpcClientFactory = require('../core/rpc-client-factory');
var RpcClient = require('vista-js').RpcClient;
var RpcParameter = RpcClient.RpcParameter;

module.exports.create = function(writebackContext, callback) {
    var pid = writebackContext.pid;

    rpcClientFactory.getRpcClient(writebackContext, null, function(error, rpcClient) {
        if (error) {
            return callback(error);
        }
        async.series([
            function firstVistaCall(callback) {
                var parameters = [];
                var rpcName = 'ORQPT MYRPC';
                parameters.push(new RpcParameter.literal('MYPARAM'));
                rpcClient.execute(rpcName, parameters, function(error, result) {
                    if (error) {
                        callback(error);
                    }
                    //TODO: result processing
                    callback(null, result);
                });
            },
            function secondVistaCall(callback) {
                var parameters = [];
                var rpcName = 'ORQPT MYRPC';
                parameters.push(new RpcParameter.literal('MYPARAM'));
                rpcClient.execute(rpcName, parameters, function(error, result) {
                    if (error) {
                        callback(error);
                    }
                    //TODO: result processing
                    callback(null, result);
                });
            }
        ], function(err, data) {
            if(err) {
                return callback(err, data);
            }
            writebackContext.vprModel = null;  // TODO set this by the VistA response
            var error = null;  // TODO set error if trouble writing back
            return callback(error);
        });
    });
};

function otherVistaFunction(writebackContext, rpcClient, callback) {
    var parameters = [];
    var rpcName = 'ORQPT MYRPC';
    parameters.push(new RpcParameter.literal('MYPARAM'));

    rpcClient.execute(rpcName, parameters, function(error, result) {
            if (error) {
                callback(error);
            }
            //TODO: result processing
            callback(null, result);
    });
}

module.exports.update = function(writebackContext, callback) {
    var pid = writebackContext.pid;

    rpcClientFactory.getRpcClient(writebackContext, null, function(error, rpcClient) {
        if (error) {
            return callback(error);
        }

        otherVistaFunction(writebackContext, rpcClient, callback);

        var parameters = [];
        var rpcName = 'ORQPT MYRPC';
        parameters.push(new RpcParameter.literal('MYPARAM'));
        rpcClient.execute(rpcName, parameters, function(error, result) {
            if(error) {
                return callback(error, result);
            }
            writebackContext.vprModel = null;  // TODO set this by the VistA response
            return callback(error);
        });
    });
};

module.exports.readNexTime = function(writebackContext, callback) {
    var pid = writebackContext.pid;
    async.series([
        function getDataFromVista(callback) {
            var parameters = [];
            var rpcName = 'ORQPT MYRPC';
            parameters.push(new RpcParameter.literal('MYPARAM'));
            RpcClient.callRpc(
                writebackContext.logger,
                writebackContext.vistaConfig,
                rpcName,
                parameters,
                callback);
        }
    ], function(err, data) {
        if(err) {
            return callback(err, data);
        }
        writebackContext.vprModel = null;  // TODO set this by the VistA response
        var error = null;  // TODO set error if trouble writing back
        return callback(error);
    });
};

