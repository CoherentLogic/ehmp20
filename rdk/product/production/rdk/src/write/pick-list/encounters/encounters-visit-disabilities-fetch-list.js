'use strict';
var parse = require('./encounters-visit-disabilities-parser').parse;
var validate = require('./../utils/validation-util');
var rpcUtil = require('./../utils/rpc-util');
var _ = require('lodash');


/**
 * Calls the RPC 'ORWPCE SCDIS' and parses out the data to populate Service Connection & Rated Disabilities<br/>
 *
 * <table border="1">
 * 	<tr><th colspan=2><b>REQUIRED PARAMS</b></th></tr>
 * 	<tr>
 * 		<td>dfn</td>
 * 		<td>
 * 			The dfn
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
 * <br/><br/>
 *
 * input:dfn<br/>
 * 1. code<br/>
 * 2. name <br/>
 * 3. title<br/>
 *
 * @param logger The logger
 * @param configuration This contains the information necessary to connect to the RPC.
 * @param callback This will be called with the data retrieved from the RPC (or if there's an error).
 * @param params object which can contain optional and/or required parameters as described above.
 */
module.exports.fetch = function(logger, configuration, callback, params) {
    var dfn = _.get(params, 'dfn');
    if (validate.isStringNullish(dfn)) {
        return callback('DFN Cannot be Empty');
    }

    return rpcUtil.standardRPCCall(logger, configuration, 'ORWPCE SCDIS', parse, callback);
};
