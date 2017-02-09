/* jslint node: true */
/* jshint -W069 */ /* added exemption for uses of object['field'] over dot-notation, as this is consistent for the order object */
'use strict';

var rdk = require('../core/rdk');
var RpcClient = require('vista-js').RpcClient;
var getVistaRpcConfiguration = require('../utils/rpc-config').getVistaRpcConfiguration;
var nullchecker = rdk.utils.nullchecker;
var errorMessage = 'There was an error processing your request. The error has been logged.';
var errorVistaJSCallback = 'VistaJS RPC callback error: ';

function getResourceConfig(app) {
    return [{
        name: 'order-detail',
        path: '/detail',
        interceptors: {
            synchronize: false,
            convertPid: true
        },
        get: getOrderDetail,
        subsystems: ['patientrecord','jdsSync','authorization'],
        requiredPermissions: ['read-order'],
        isPatientCentric: true
    }];
}

/**
* Retrieves details about an order given a patient id, DFN and order
* id. Uses the site id that is stored in the user session.
*
* @param {Object} req - The default Express request that contains the
                        URL parameters needed to retrieve order details.
* @param {Object} res - The default Express response that will contain
                        order details.
* @param {function} next - The middleware to be executed after this
                        function has finished executing.
*/
function getOrderDetail(req, res) {

    var orderId = req.param('id');
    var pid = req.param('pid');
    var dfn = req.interceptorResults.patientIdentifiers.dfn;

    if (nullchecker.isNullish(orderId)) {
        return res.status(rdk.httpstatus.bad_request).rdkSend('Missing id parameter');
    } else if (nullchecker.isNullish(dfn)) {
        return res.status(rdk.httpstatus.bad_request).rdkSend('Missing dfn parameter');
    } else if (nullchecker.isNullish(pid)) {
        return res.status(rdk.httpstatus.bad_request).rdkSend('Missing pid parameter');
    } else {
        req.logger.info('single order detail resource GET called for orderId:' + orderId + ' and patient DFN:' + dfn);
    }

    var vistaConfig = getVistaRpcConfiguration(req.app.config, req.session.user.site, req.session.user);

    RpcClient.callRpc(req.logger, vistaConfig, 'ORQOR DETAIL', [orderId, dfn], function(error, result) {
        if (error) {
            req.logger.error({error: error}, errorVistaJSCallback);
            res.status(rdk.httpstatus.internal_server_error).rdkSend(errorMessage);
        } else {
            if (result) {
                req.logger.info('Successfully retrieved order detail from VistA.');
                var order = parseResult(result);
                res.set('Content-Type', 'application/json');
                res.rdkSend({
                    'data': {
                        'items': [order]
                    }
                });

            } else {
                req.logger.error({result: result}, errorVistaJSCallback + ' no result');
                res.status(rdk.httpstatus.internal_server_error).rdkSend(errorMessage);
            }
        }
    });

}

function parseResult(result) {
    //remove the first and last quotation marks within the string
    var vresult = JSON.stringify(result).replace(/^\"|\"$/g, '').trim();
    //split on double line feed with only spaces in between
    var resultSections = vresult.split(/\\r\\n\s*\\r\\n/);
    var sectionCount = resultSections.length;
    var order = {},
        i,
        section;

    for (i = 0; i < sectionCount; i++) {
        section = resultSections[i].trim();
        if (section.charAt(0) === '\"') {
            section = section.substring(1);
        }
        if (i === 0) {
            order['Title'] = section;
        } else if (section.indexOf('Activity:') === 0) {
            order['Activity'] = getSectionData(section);
        } else if (section.indexOf('Current Data:') === 0) {
            order['Current Data'] = getSectionData(section);
            order.id = order['Current Data']['Order#'];
        } else if (section.indexOf('Order:') === 0) {
            order['Order'] = getSectionData(section);
        } else if (section.indexOf('Order Checks:') === 0) {
            order['Order Checks'] = getSectionData(section);
        } else if (section.indexOf('Dispense Drugs (units/dose):') === 0) {
            //This section appears in Medication, Outpatient orders only
            //it comes without a section name but it is separated from the Order section by a blank line
            order['Dispense'] = getSectionData('Dispense:\\r\\n' + section);
            //This is for safety just in case we get a section that wasn't referenced above
        } else if (section.length > 0) {
            order['Notes'] = section;
        }
    }
    return order;
}

function getSectionData(section) {
    var subSections = section.split('\\r\\n'),
        subSectionsCount = subSections.length,
        subSectionName,
        subSection,
        prevSectionName,
        i,
        lineText = '',
        dataSection = {};

    for (i = 1; i < subSectionsCount; i++) {
        subSection = subSections[i].trim();
        //subSectionName must start with a lettter and end with ':'
        //'Order #' ends with '#' instead of :'
        //Diet orders have this entry: Cancel all current or future tray orders? which ends with '?'
        var index = subSection.search(/^[a-z](.*(\:|rder\s\#|on\sisolation\sprocedures\?|\sall\scurrent\sor\sfuture\stray\sorders\?))/i);
        if (index === 0) { //section name was located
            subSectionName = subSection.substring(0, subSection.indexOf(':')) || subSection.substring(0, subSection.indexOf('#')) || subSection.substring(0, subSection.indexOf('?'));
            if (prevSectionName !== undefined && subSectionName !== prevSectionName) {

                if (subSectionName === 'Order ') {
                    subSectionName = 'Order#';
                }
                //some order records have duplicate entries for 'Nature of Order' and 'Elec Signature'
                //This happens if the order was canceled.
                if (dataSection.hasOwnProperty(prevSectionName)) {
                    dataSection[prevSectionName] += '\\r\\n' + lineText;
                } else {
                    dataSection[prevSectionName] = lineText;
                }
                lineText = subSection.substring(subSectionName.length + 1).trim();

            } else {
                lineText = subSection.substring(subSectionName.length + 1).trim();
            }
            prevSectionName = subSectionName;
        } else {
            //first line within the Activity section always comes with no subSectionName
            if (subSectionName === undefined || subSectionName.length === 0) {
                prevSectionName = 'Summary'; //default first lint to 'Summary'
                lineText = subSection;
            } else {
                lineText += '\\r\\n' + subSection;
            }
        }

    }
    //save last section text
    if (prevSectionName !== undefined && lineText !== undefined && lineText.length > 0) {

        if (dataSection.hasOwnProperty(prevSectionName)) {
            dataSection[prevSectionName] += '\\r\\n' + lineText;
        } else {
            dataSection[prevSectionName] = lineText;
        }

    }
    return dataSection;
}

module.exports.getResourceConfig = getResourceConfig;
module.exports.getOrderDetail = getOrderDetail;
module.exports.parseResult = parseResult;
