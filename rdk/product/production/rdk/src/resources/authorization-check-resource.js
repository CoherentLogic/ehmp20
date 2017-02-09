/*jslint node: true*/
'use strict';

function getResourceConfig() {
    return [{
        name: 'authorize-authorize',
        path: '',
        interceptors: {
            synchronize: false
        },
        requiredPermissions: [],
        isPatientCentric: true,
        get: runRpc,
        subsystems: ['jds','solr','jdsSync','authorization']
    }];
}

/**
 * Does nothing.  Allows the interceptors to run, then returns the response.
 * @param  {Object} req - default Express request
 * @param  {Object} res - default Express result
 *
 * @return undefined
 *
 * 200 if user has access,
 * 307 if user needs to BTG,
 * 403 if unauthorized.
 */
function runRpc(req, res) {
    res.rdkSend();
}

module.exports.getResourceConfig = getResourceConfig;
