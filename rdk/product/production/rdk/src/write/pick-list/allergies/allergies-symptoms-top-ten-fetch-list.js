'use strict';
var parse = require('./allergies-symptoms-top-ten-parser').parse;
var rpcUtil = require('./../utils/rpc-util');


/**
 * Calls the RPC 'ORWDAL32 DEF' and parses out the data<br/><br/>
 *
 * <table border="1">
 * 	<tr><th colspan=2><b>REQUIRED PARAMS</b></th></tr>
 * 	<tr><td colspan=2><b>NONE</b></td></tr>
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
 */
module.exports.fetch = function(logger, configuration, callback) {
	return rpcUtil.standardRPCCall(logger, configuration, 'ORWDAL32 DEF', parse, callback);
};
