/*jslint node: true */
'use strict';

var pickListConfig = require('./config/pick-list-config-in-memory-rpc-call').pickListConfig;


var dbList = require('./pick-list-db');
var async = require('async');
var nullUtil = require('../core/null-utils');
var validate = require('./utils/validation-util');
var _ = require('lodash');


module.exports.config = pickListConfig;


/**
 * These RPC's will be cached in memory.
 *
 * @param req The request object - we will be retrieving the param's from it.
 * @param site The site as retrieved from req.param('site') and converted to uppercase.
 * @param type The site as retrieved from req.param('type') and converted to lowercase.
 * @param callback The method that will send this data back to the person calling it.
 * @returns {boolean} True if this processed the call, false otherwise.
 */
module.exports.inMemoryRpcCall = function(req, site, type, callback) {

    if (type.toLowerCase() === 'refresh') {
        if (dbList.refreshInProgress) {
            return callback(null, 'Refresh in progress');
        }
        else {
            dbList.refresh(req.app, true,function(err, result) {
                if (err) {
                    return callback(err);
                }

                return callback(null,result);
            });
        }
    }

    var i = _.indexOf(_.pluck(pickListConfig, 'name'), type);
    if (i === -1) {
        return callback(type+ ' Not yet implemented');
    }

    // We already checked type and site at the start of this function.
    var params = {
        'pickList': type,
        'site': site
    };
    var filters = null;
    if (_.has(pickListConfig[i], 'requiredParams')) {
        var aborted = false;
        _.each(pickListConfig[i].requiredParams, function(paramName) {
            if (nullUtil.isNullish(req.param(paramName)) || _.isEmpty(req.param(paramName))) {
                callback('Parameter \'' + paramName + '\' cannot be null or empty');
                aborted = true;
                return false;//Break out of _.each
            }
            _.set(params, paramName, req.param(paramName).toUpperCase());
        });
        if (aborted) {
            return true;//Callback was already called; stop here.
        }
    }
    if (_.has(pickListConfig[i], 'optionalParams')) {
        _.each(pickListConfig[i].optionalParams, function(paramName) {
            if (!(nullUtil.isNullish(req.param(paramName)) || _.isEmpty(req.param(paramName)))) {
                _.set(params, paramName, req.param(paramName).toUpperCase());
            } else {
                _.set(params, paramName, null);
            }
        });
    }
    if (pickListConfig[i].needsFullConfig) {
        _.set(params, 'fullConfig', req.app.config);
    }
    if (_.has(pickListConfig[i], 'filterForEntireRecursiveCollection')) {
        if (!validate.isStringNullish(req.param(pickListConfig[i].filterForEntireRecursiveCollection.paramNameForStringToSearchFor))) {
            filters = {};
            _.set(filters, 'fieldToCheckAgainst', pickListConfig[i].filterForEntireRecursiveCollection.fieldToCheckAgainst);
            _.set(filters, 'stringToSearchFor', req.param(pickListConfig[i].filterForEntireRecursiveCollection.paramNameForStringToSearchFor));
        }
    }
    var siteConfig = req.app.config.vistaSites[site];
    siteConfig.jdsServer = req.app.config.jdsServer;

    if (nullUtil.isNullish(siteConfig)) {
        return callback('The site (' + site + ') was not found in the configuration');
    }

    if (!pickListConfig[i].vistaContext) {
        return callback('The vistaContext was not found in the pick-list-config-in-memory-rpc-call.json configuration');
    }
    siteConfig.context = pickListConfig[i].vistaContext;

    dbList.retrievePickList(req.logger, siteConfig, params, filters, pickListConfig[i].modulePath, pickListConfig[i].dataNeedsRefreshAfterMinutes, callback);
};


/**
 * Utility function to make it easy to log what is contained in params.
 */
function paramsAsString(params) {
    var str = 'Site: ' + params.site + ', pick-list: ' + params.pickList + '(';
    if (_.has(pickListConfig[params.index], 'requiredParams')) {
        var first = true;
        _.each(pickListConfig[params.index].requiredParams, function(requiredName) {
            if (!first) {
                str += ', ';
            }
            str += requiredName + '=' + params[requiredName];
            first = false;
        });
    }
    str += ')';
    return str;
}

/**
 * Loads all of the large pick lists as determined in pick-list-config-in-memory-rpc-call.json
 */
module.exports.loadLargePickLists = function(app) {
    //This queue will populate each pick list.
    var q = async.queue(function (params, callback) {
        app.logger.info('PROCESSING LOADING OF LARGE PICK LIST - ' + paramsAsString(params));

        var siteConfig = app.config.vistaSites[params.site];
        if (nullUtil.isNullish(siteConfig)) {
            return callback('The site (' + params.site + ') was not found in the configuration');
        }

        if (!pickListConfig[params.index].vistaContext) {
            return callback('The vistaContext was not found in the pick-list-config-in-memory-rpc-call.json configuration');
        }
        siteConfig.context = pickListConfig[params.index].vistaContext;
        siteConfig.jdsServer = app.config.jdsServer;

        dbList.initialLoadPickList(app.logger, siteConfig, params, pickListConfig[params.index].modulePath, function(error) {
                if (error) {
                    app.logger.error(error);
                }
                else {
                    app.logger.debug('Loaded');
                }

                app.logger.info('FINISHED PROCESSING LOADING OF LARGE PICK LIST - ' + paramsAsString(params));
                callback();
            }
        );
    }, 1);

    //Called when all queues are finished being processed.
    q.drain = function() {
        app.logger.info('FINISHING LOADING ALL LARGE PICK LISTS');
    };

    //For each pick list in the configuration which has a largePickListRetry, add it to the queue.
    //If that largePickListRetry also has requiredParams, then a matching entry will be found in initialLoadDefaultParams.
    //Iterate through each of them and add to the queue a separate call to populate for each default entry that is found.
    _.each(_.pluck(pickListConfig, 'name'), function(name, i) {
        if (_.has(pickListConfig[i], 'largePickListRetry')) {
            _.each(app.config.vistaSites, function(siteObject, siteName) {
                if (_.has(pickListConfig[i], 'requiredParams')) {
                    if (_.isEmpty(pickListConfig[i].initialLoadDefaultParams)) {
                        app.logger.error('cannot have an empty initialLoadDefaultParams in the configuration if there are requiredParams');
                        return;
                    }

                    if (!_.isArray(pickListConfig[i].initialLoadDefaultParams)) {
                        app.logger.error('initialLoadDefaultParams was not an array');
                        return;
                    }

                    _.each(pickListConfig[i].requiredParams, function (requiredName) {
                        var found = _.result(_.find(pickListConfig[i].initialLoadDefaultParams, requiredName), requiredName);

                        if (found === null || found === undefined) {
                            app.logger.error('could not find ' + requiredName + ' in initialLoadDefaultParams - it is a requiredParams');
                            return;
                        }
                    });
                }

                if (!_.isEmpty(pickListConfig[i].initialLoadDefaultParams)) {
                    _.each(pickListConfig[i].initialLoadDefaultParams, function (initialLoadDefaultParam) {
                        var params = {
                            'pickList': pickListConfig[i].name,
                            'site': siteName,
                            'index': i
                        };

                        _.each(initialLoadDefaultParam, function (initialLoadDefaultParamFieldValue, initialLoadDefaultParamFieldName) {
                            params[initialLoadDefaultParamFieldName] = initialLoadDefaultParamFieldValue;
                        });

                        q.push(params);
                    });
                }
                else {
                    var params = {
                        'pickList': pickListConfig[i].name,
                        'site': siteName,
                        'index': i
                    };
                    q.push(params);
                }
            });
        }
    });
};

