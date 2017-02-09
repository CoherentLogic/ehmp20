'use strict';
var fetch = require('../multifunction/orwpce4-lex-lookup-fetch-list').getOrwpce4LexLookUp;
var _ = require('lodash');


/**
 * Calls the RPC 'ORWPCE LEX' and parses out the data to retrieve a list of specimens<br/><br/>
 *
 * <table border="1">
 * 	<tr><th colspan=2><b>REQUIRED PARAMS</b></th></tr>
 * 	<tr>
 * 		<td>searchString</td>
 * 		<td>
 * 			used when an RPC call requires a minimum of 3 characters in order to return data<br/>
 * 			This is not a filter - it is a search string.  For example, searching for RAD may return RADIACARE;<br/>
 * 			however, searching for DIA will not return RADIACARE.  Also, the search term may not always be the<br/>
 * 			first 3 characters.  For example, DIA will also return "CONTRAST MEDIA <DIAGNOSTIC DYES>".
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
 *
 * Each element is as follows:<br/>
 * 1. ien<br/>
 * 2. name  (CODE)<br/>
 * A CODE can appear inside parentheses.<br/><br/>
 *
 * CPRS uses the view 'CHP' to retrieve its procedures so that's what we do here as well.
 *
 * @param logger The logger
 * @param configuration This contains the information necessary to connect to the RPC.
 * @param callback This will be called with the data retrieved from the RPC (or if there's an error).
 * @param params object which can contain optional and/or required parameters as described above.
 */
module.exports.fetch = function(logger, configuration, callback, params) {
    var searchString = _.get(params, 'searchString');

    fetch(logger, configuration, searchString, 'CHP', function(status, data) {

        var retValue = [];
        // filter out the procedures in our model without a CPT code
        _.each(data, function(line) {
            if (line.conceptId) {
                retValue.push(line);
            }
        });

        callback(status, retValue);
    });
};
