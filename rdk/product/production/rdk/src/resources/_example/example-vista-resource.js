'use strict';

var RpcClient = require('vista-js').RpcClient;
var RpcParameter = RpcClient.RpcParameter;
var _ = require('lodash');

function getResourceConfig() {
    return [{
        name: 'test-vista',
        path: '/test/vista',
        get: exampleVistaGet,
        interceptors: {
            operationalDataCheck: false,
            synchronize: false
        },
        subsystems: [],
        requiredPermissions: [],
        isPatientCentric: true
    }];
}

function exampleVistaGet(req, res) {
    req.logger.debug('example VistA resource GET called');

    var vistaSite = '9E7A';
    var patientDfn = '3';
    req.audit.patientId = vistaSite + ';' + patientDfn;
    req.audit.logCategory = 'RETRIEVE';

    // Extend onto an empty object to prevent overwriting the
    // running configuration with our custom values in the
    // last object
    var vistaConfig = _.extend({}, req.app.config.vistaSites[vistaSite], {
        context: 'HMP UI CONTEXT',
        accessCode: req.session.user.accessCode,
        verifyCode: req.session.user.verifyCode
    });
    var parameters = [];
    var rpcName = 'ORWPT CWAD';
    parameters.push(new RpcParameter.literal(patientDfn));
    return RpcClient.callRpc(
        req.logger, vistaConfig, rpcName, parameters,
        function(err, result) {
            if(err) {
                req.logger.error(err, 'exampleVistaGet response error');
                return res.status(500).rdkSend(err);
            }
            return res.rdkSend({data: result});
        }
    );
}

module.exports.getResourceConfig = getResourceConfig;
