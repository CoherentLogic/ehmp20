'use strict';

var async = require('async');
var RpcClient = require('vista-js').RpcClient;
var RpcParameter = RpcClient.RpcParameter;

module.exports = function(writebackContext, callback) {
    var pid = writebackContext.pid;
    async.series([
        function sendDataToVista(callback) {
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

