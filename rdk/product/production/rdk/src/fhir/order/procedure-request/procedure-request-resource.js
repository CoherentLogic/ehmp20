'use strict';
var rdk = require('../../../core/rdk');
var nullchecker = rdk.utils.nullchecker;
var procedureRequest = require('./procedure-request.js');

function getResourceConfig() {
    return [{
        name: 'order-procedure-request-procedure-request',
        path: '',
        get: getProcedureRequest,
        subsystems: ['patientrecord', 'jds', 'solr', 'jdsSync', 'authorization'],
        interceptors: {
            fhirPid: true
        },
        requiredPermissions: [],
        isPatientCentric: true,
        permitResponseFormat: true
    }];
}

/**
 * @api {get} /fhir/patient/{id}/procedurerequest Get Procedure Request
 * @apiName getProcedureRequest
 * @apiGroup Procedure Request
 * @apiParam {Number} [_count] The number of results to show.
 *
 * @apiDescription
 *
 * @apiExample {js} Request Examples:
 *      // Limiting results count
 *      http://IPADDRESS:POR/resource/fhir/patient/9E7A;253/procedurerequest?_count=1
 *
 * @apiSuccess {json} data Json object conforming to the <a href="http://www.hl7.org/FHIR/2015May/procedurerequest.html">Procedure Request FHIR DTSU2 specification</a>.
 * @apiSuccessExample Success-Response:
 *
 * @apiError (Error 400) Invalid parameter values.
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *      Invalid parameter values.
 * }
 */
function getProcedureRequest(req, res) {
    var pid = req.query.pid;
    var params = {
        _count: req.query._count
    };

    if (nullchecker.isNullish(pid)) {
        return res.status(rdk.httpstatus.bad_format).send('Missing required parameter: pid');
    }

    procedureRequest.getData(req.app.config, req.logger, pid, params, function(err, inputJSON) {
        if (nullchecker.isNotNullish(err)) {
            res.status(err.code).send(err.message);
        } else {
            var fhirBundle = procedureRequest.convertToFhir(inputJSON, req);
            res.status(rdk.httpstatus.ok).send(fhirBundle);
        }
    });
}

module.exports.getResourceConfig = getResourceConfig;
module.exports.getProcedureRequest = getProcedureRequest;
