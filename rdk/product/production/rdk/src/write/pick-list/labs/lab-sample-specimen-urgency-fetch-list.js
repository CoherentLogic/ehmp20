'use strict';
var parse = require('./lab-sample-specimen-urgency-parser').parse;
var validate = require('./../utils/validation-util');
var rpcUtil = require('./../utils/rpc-util');
var _ = require('lodash');


/**
 * Calls the RPC 'ORWDLR32 LOAD' and parses out the data<br/><br/>
 *
 * <table border="1">
 * 	<tr><th colspan=2><b>REQUIRED PARAMS</b></th></tr>
 * 	<tr>
 * 		<td>labTestIEN</td>
 * 		<td>
 * 			the IEN to obtain the lab sample, specimen, and urgency for.
 * 		</td>
 * 	</tr>
 * </table>
 * <br/>
 * <br/>
 *
 * <table border="1">
 * 	<tr><th colspan=2><b>OPTIONAL PARAMS</b></th></tr>
 * 	<tr><td colspan=2><b>NONE</b></td></tr>
 * </table>
 *
 * @param logger The logger
 * @param configuration This contains the information necessary to connect to the RPC.
 * @param callback This will be called with the data retrieved from the RPC (or if there's an error).
 * @param params object which can contain optional and/or required parameters as described above.
 */
module.exports.fetch = function(logger, configuration, callback, params) {
    var labTestIEN = _.get(params, 'labTestIEN');

    if (!validate.isWholeNumber(labTestIEN)) {
        return callback('labTestIEN cannot be empty and must be a whole number');
    }
    return rpcUtil.standardRPCCall(logger, configuration, 'ORWDLR32 LOAD', labTestIEN, parse, callback);
};
