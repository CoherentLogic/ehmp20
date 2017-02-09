'use strict';

var rdk = require('../../core/rdk');
var _ = require('lodash');
var httpUtil = rdk.utils.http;
var fs = require('fs');
var uds = require('./user-defined-screens-resource');
var dd = require('drilldown');
var nullchecker = rdk.utils.nullchecker;

var USER_SCREENS_CONFIG = 'UserScreensConfig';

var interceptors = {
    operationalDataCheck: false,
    synchronize: false
};
var permissions = [];
var healthcheck = {
    dependencies: ['jdsSync']
};

function getResourceConfig() {
    return [{
        name: 'user-defined-filter',
        path: '',
        get: getFilter,
        interceptors: interceptors,
        healthcheck: healthcheck,
        requiredPermissions: permissions,
        isPatientCentric: false
    }, {
        name: 'user-defined-filter',
        path: '',
        post: createFilter,
        interceptors: interceptors,
        healthcheck: healthcheck,
        requiredPermissions: permissions,
        isPatientCentric: false
    }, {
        name: 'user-defined-filter',
        path: '',
        delete: removeFilter,
        interceptors: interceptors,
        healthcheck: healthcheck,
        requiredPermissions: permissions,
        isPatientCentric: false
    }, {
        name: 'user-defined-filter',
        path: '',
        put: duplicateFilters,
        interceptors: interceptors,
        healthcheck: healthcheck,
        requiredPermissions: permissions,
        isPatientCentric: false
    }, {
        name: 'user-defined-filter-all',
        path: '/all',
        'delete': removeAllFilters,
        interceptors: interceptors,
        healthcheck: healthcheck,
        requiredPermissions: permissions,
        isPatientCentric: false
    }];
}

function getFilter(req, res) {
    req.audit.dataDomain = 'Filter';
    req.audit.logCategory = 'UDS';
    req.audit.authuser = '-';

    var filterId = createFilterId(req);
    if (!filterId) {
        var filterIdError = new Error('Unable to find filter ID parameter');
        req.logger.error(filterIdError);
        return res.status(rdk.httpstatus.internal_server_error).rdkSend(filterIdError);
    }

    getFilterData('', filterId, req, function(err, data) {
        if (err) {
            req.logger.error(err);
            res.status(rdk.httpstatus.internal_server_error).rdkSend(err);
        } else {
            res.status(rdk.httpstatus.ok).rdkSend(data);
        }
    });
}

function createFilter(req, res) {
    req.audit.dataDomain = 'Filter';
    req.audit.logCategory = 'UDS';
    req.audit.authuser = '-';

    //fail fast for missing params
    var instanceId = getInstanceIdParameter(req);
    if (!instanceId) {
        var idErr = new Error('Unable to find instance ID parameter');
        req.logger.error(idErr);
        return res.status(rdk.httpstatus.internal_server_error).rdkSend(idErr);
    }

    var filterName = getFilterParameter(req);
    if (!filterName) {
        var filterError = new Error('Unable to find filter name parameter');
        req.logger.error(filterError);
        return res.status(rdk.httpstatus.internal_server_error).rdkSend(filterError);
    }

    var screenId = createScreenIdFromRequest(req, USER_SCREENS_CONFIG);

    //Get UserScreensConfig and update with new or updated filter
    uds.getScreenData(screenId, req, function(err, data) {
        req.logger.debug({data: data}, 'getting data in createFilter for screenID: ' + screenId + ' and data returned');
        if (err) {
            req.logger.error('Unable to save custom filter due to error retrieving UserScreensConfig data');
            req.logger.error(err);
            return res.status(rdk.httpstatus.internal_server_error).rdkSend(err);
        } else {
            var udsData = {};
            var userDefinedFilterData = [];
            var count;
            var filterId = req.param('id');
            var filterData = {};
            var found;

            userDefinedFilterData = dd(data)('userDefinedFilters').val;

            if (nullchecker.isNotNullish(userDefinedFilterData)) {
                for (count = 0; count < userDefinedFilterData.length; count++) {
                    if (userDefinedFilterData[count].id === filterId) {
                        filterData = userDefinedFilterData[count];
                        count = userDefinedFilterData.length;
                        found = true;
                        filterData = processDataForCreate(filterId, instanceId, filterName, filterData);
                    }
                }

                if (!found) {
                    filterData = processDataForCreate(filterId, instanceId, filterName, filterData);
                    var updatedFilterData = userDefinedFilterData.concat(filterData);
                    userDefinedFilterData = updatedFilterData;
                }
            } else {
                userDefinedFilterData = [];
                filterData = processDataForCreate(filterId, instanceId, filterName, filterData);
                userDefinedFilterData.push(filterData);
            }

            data.userDefinedFilters = userDefinedFilterData;

            udsData = data;

            //The UI is coded to expect strings, store it as such
            var content = udsData;

            req.logger.debug({content: content}, 'Inside userDefinedFilters createFilter filter data before post');

            postFilterData(content, req, function(err) {
                if (err) {
                    req.logger.error(err);
                    res.status(rdk.httpstatus.internal_server_error).rdkSend(err);
                } else {
                    res.status(rdk.httpstatus.ok).rdkSend(content);
                }
            });
        }
    });


    /*getFilterData('', filterId, req, function(err, data) {
        if (err) {
            req.logger.error('Unable to save custom filter due to error retrieving existing filters');
            req.logger.error(err);
            return res.status(rdk.httpstatus.internal_server_error).rdkSend(err);
        } else {

            data = processDataForCreate(filterId, instanceId, filterName, data);

            //update if it does, create if not
            postFilterData(data, req, function(err, finalData) {
                if (err) {
                    req.logger.error(err);
                    res.status(rdk.httpstatus.internal_server_error).rdkSend(err);
                } else {
                    //res.status(rdk.httpstatus.ok).rdkSend(finalData);
                    res.status(rdk.httpstatus.ok).rdkSend(data);
                }
            });
        }
    });*/

}

function processDataForCreate(filterId, instanceId, filterName, data) {
    //look in data for filters for this applet
    if (!data.hasOwnProperty('id')) {
        data.id = filterId;
    }

    if (!data.hasOwnProperty(('applets'))) {
        data.applets = [];
    }

    var appletIndex = -1;
    var matchedApplet = _.find(data.applets, function(applet) {
        appletIndex++;
        if (applet && applet.hasOwnProperty('instanceId')) {
            if (applet.instanceId === instanceId) {
                return true;
            }
        }
        return false;
    });

    if (matchedApplet && matchedApplet.hasOwnProperty('filters')) {
        if (!_.find(matchedApplet.filters, function(filter) {
                if (filter === filterName) {
                    return true;
                }
                return false;
            })) {
            //filter is not already in the list
            data.applets[appletIndex].filters.push(filterName);
        } //else the filter already exists in the list and won't be added
    } else {
        //no matching applet id
        data.applets.push({
            instanceId: instanceId,
            filters: [filterName]
        });
    }

    return data;
}

function findApplet(data, instanceId, req) {
    var err;

    if (!data.hasOwnProperty('id')) {
        err = new Error('Unable to find filter with this id');
        req.logger.error(err);
    } else {
        if (!data.hasOwnProperty(('applets'))) {
            err = new Error('No filter found for this applet');
            req.logger.error(err);
        }
    }

    if (err) {
        return {
            err: err
        };
    }

    var appletIndex = -1;
    var matchedApplet = _.find(data.applets, function(applet) {
        appletIndex++;
        if (applet && applet.hasOwnProperty('instanceId')) {
            if (applet.instanceId === instanceId) {
                return true;
            }
        }
        return false;
    });

    if (matchedApplet === undefined) {
        err = new Error('Unable to find applet id with this id');
        req.logger.error(err);
        return {
            err: err
        };
    }

    if (!matchedApplet.hasOwnProperty('filters')) {
        req.logger.warn('applet was missing filters, so added an empty list');
        matchedApplet.filters = [];
    }

    return {
        matchedApplet: matchedApplet,
        appletIndex: appletIndex
    };
}

function duplicateFilters(req, res) {
    var sourceWorkspaceId = req.query.fromId;
    var destinationWorkSpaceId = req.query.toId;
    var filterIdError;
    req.audit.dataDomain = 'Filter';
    req.audit.logCategory = 'UDS';
    req.audit.authuser = '-';

    var sourceFilterId = createFilterIdFromString(req, sourceWorkspaceId);
    if (!sourceFilterId) {
        filterIdError = new Error('Unable to find source Workspace ID parameter');
        req.logger.error(filterIdError);
        return res.status(rdk.httpstatus.internal_server_error).rdkSend(filterIdError);
    }

    var destinationFilterId = createFilterIdFromString(req, destinationWorkSpaceId);
    if (!destinationFilterId) {
        filterIdError = new Error('Unable to find destination Workspace ID parameter');
        req.logger.error(filterIdError);
        return res.status(rdk.httpstatus.internal_server_error).rdkSend(filterIdError);
    }

    duplicateFilterData(req, sourceFilterId, destinationFilterId, function(err, finalData) {
        if (err) {
            req.logger.error(err);
            res.status(rdk.httpstatus.internal_server_error).rdkSend(err);
        } else {
            res.status(rdk.httpstatus.ok).rdkSend(finalData);
        }
    });
}

function duplicateFilterData(req, sourceFilterId, destinationFilterId, callback) {
    //get the filters from the source workspace
    getFilterData('', sourceFilterId, req, function(err, data) {
        if (err) {
            callback(err);
        } else {
            //Post the same filters to the new workspace after updating the _id
            if (data && data.hasOwnProperty('_id')) {
                data._id = destinationFilterId;
                postFilterData(data, req, callback);
            } else {
                callback(null, data);
            }
        }
    });
}

/*exported removeAllFilters */
function removeAllFilters(req, res) {
    req.audit.dataDomain = 'Filter';
    req.audit.logCategory = 'UDS';
    req.audit.authuser = '-';
    var userDefinedFilterData = [];

    var instanceId = getInstanceIdParameter(req);
    if (!instanceId) {
        var idErr = new Error('Unable to find instance ID parameter');
        req.logger.error(idErr);
        return res.status(rdk.httpstatus.internal_server_error).rdkSend(idErr);
    }

    var filterId = req.param('id');

    var screenId = createScreenIdFromRequest(req, USER_SCREENS_CONFIG);

    req.logger.debug('Request to delete all user defined filters for: ' + filterId);

    //get data for this filter
    //if more than 1 filter, try to remove 1 and update it
    //if 1 or less filters, delete entire filter obj

    //check if filter for this workspace already exists
    uds.getScreenData(screenId, req, function(err, data) {
        if (err) {
            req.logger.error('Unable to delete custom filter due to error retrieving existing filters');
            req.logger.error(err);
            return res.status(rdk.httpstatus.internal_server_error).rdkSend(err);
        }

        userDefinedFilterData = dd(data)('userDefinedFilters').val;
        var filterData = _.findWhere(userDefinedFilterData, {
            id: filterId
        }) || {};

        var appletResult = findApplet(filterData, instanceId, req);
        if (appletResult.err) {
            return res.status(rdk.httpstatus.internal_server_error).rdkSend(appletResult.err);
        }

        filterData = removeDataFilters(appletResult.appletIndex, filterData);
        var count = _.findIndex(userDefinedFilterData, function(udf) {
            return udf.id === filterId;
        });
        if (userDefinedFilterData[count].applets.length === 0) {
            userDefinedFilterData.splice(count, 1);
        }

        req.logger.debug({data: data}, 'About to overwrite data with');

        //updateOrDeleteApplet(data, screenId, req, res);

        //Update UserScreensConfig with updated filter data
        postFilterData(data, req, function(err) {
            if (err) {
                req.logger.error(err);
                res.status(rdk.httpstatus.internal_server_error).rdkSend(err);
            } else {
                res.status(rdk.httpstatus.ok).rdkSend(data);
            }
        });
    });

}

/*function removeAllFilters(req, res) {
    req.audit.dataDomain = 'Filter';
    req.audit.logCategory = 'UDS';
    req.audit.authuser = '-';

    var instanceId = getInstanceIdParameter(req);
    if (!instanceId) {
        var idErr = new Error('Unable to find instance ID parameter');
        req.logger.error(idErr);
        return res.status(rdk.httpstatus.internal_server_error).rdkSend(idErr);
    }

    var filterId = createFilterId(req);
    if (!filterId) {
        var filterIdError = new Error('Unable to find filter ID parameter');
        req.logger.error(filterIdError);
        return res.status(rdk.httpstatus.internal_server_error).rdkSend(filterIdError);
    }

    req.logger.debug('Request to delete all user defined filters for: ' + filterId);

    //get data for this filter
    //if more than 1 filter, try to remove 1 and update it
    //if 1 or less filters, delete entire filter obj

    //check if filter for this workspace already exists
    getFilterData('', filterId, req, function(err, data) {
        if (err) {
            req.logger.error('Unable to delete custom filter due to error retrieving existing filters');
            req.logger.error(err);
            return res.status(rdk.httpstatus.internal_server_error).rdkSend(err);
        }

        var appletResult = findApplet(data, instanceId, req);
        if (appletResult.err) {
            return res.status(rdk.httpstatus.internal_server_error).rdkSend(appletResult.err);
        }

        data = removeDataFilters(appletResult.appletIndex, data);
        req.logger.debug({data: data}, 'About to overwrite data with');

        updateOrDeleteApplet(data, filterId, req, res);
    });

}*/

function removeDataFilters(appletIndex, data) {
    data.applets.splice(appletIndex, 1);
    return data;
}

function getInstanceIdParameter(req) {
    return req.param('instanceId') || null;
}

//keep the below comment, as JSHint incorrectly believe this function is never used
// due to 'delete' being a reserved word in JS but also an HTTP verb
/*exported removeFilter */
function removeFilter(req, res) {
    req.audit.dataDomain = 'Filter';
    req.audit.logCategory = 'UDS';
    req.audit.authuser = '-';
    var userDefinedFilterData = [];

    //fail fast for missing params
    var instanceId = getInstanceIdParameter(req);
    if (!instanceId) {
        var idErr = new Error('Unable to find instance ID parameter');
        req.logger.error(idErr);
        return res.status(rdk.httpstatus.internal_server_error).rdkSend(idErr);
    }

    var filterName = getFilterParameter(req);
    if (!filterName) {
        var filterError = new Error('Unable to find filter name parameter');
        req.logger.error(filterError);
        return res.status(rdk.httpstatus.internal_server_error).rdkSend(filterError);
    }

    var filterId = req.param('id');

    var screenId = createScreenIdFromRequest(req, USER_SCREENS_CONFIG);

    req.logger.debug('Request to delete all user defined filters for: ' + filterId);

    //get data for this filter
    //if more than 1 filter, try to remove 1 and update it
    //if 1 or less filters, delete entire filter obj



    //check if filter for this workspace already exists
    uds.getScreenData(screenId, req, function(err, data) {
        if (err) {
            req.logger.error('Unable to delete custom filter due to error retrieving existing filters');
            req.logger.error(err);
            return res.status(rdk.httpstatus.internal_server_error).rdkSend(err);
        }

        userDefinedFilterData = dd(data)('userDefinedFilters').val;
        var filterData = _.findWhere(userDefinedFilterData, {
            id: filterId
        }) || {};

        var appletResult = findApplet(filterData, instanceId, req);
        if (appletResult.err) {
            return res.status(rdk.httpstatus.internal_server_error).rdkSend(appletResult.err);
        }

        filterData = removeDataFilter(filterName, appletResult.appletIndex, filterData);
        req.logger.debug({data: data}, 'About to overwrite data with');

        //updateOrDeleteApplet(data, screenId, req, res);

        //Update UserScreensConfig with updated filter data
        postFilterData(data, req, function(err) {
            if (err) {
                req.logger.error(err);
                res.status(rdk.httpstatus.internal_server_error).rdkSend(err);
            } else {
                res.status(rdk.httpstatus.ok).rdkSend(data);
            }
        });
    });

}


/*function removeFilter(req, res) {
    req.audit.dataDomain = 'Filter';
    req.audit.logCategory = 'UDS';
    req.audit.authuser = '-';

    //fail fast for missing params
    var instanceId = getInstanceIdParameter(req);
    if (!instanceId) {
        var idErr = new Error('Unable to find instance ID parameter');
        req.logger.error(idErr);
        return res.status(rdk.httpstatus.internal_server_error).rdkSend(idErr);
    }

    var filterName = getFilterParameter(req);
    if (!filterName) {
        var filterError = new Error('Unable to find filter name parameter');
        req.logger.error(filterError);
        return res.status(rdk.httpstatus.internal_server_error).rdkSend(filterError);
    }

    var filterId = createFilterId(req);
    if (!filterId) {
        var filterIdError = new Error('Unable to find filter ID parameter');
        req.logger.error(filterIdError);
        return res.status(rdk.httpstatus.internal_server_error).rdkSend(filterIdError);
    }

    //get data for this filter
    //if more than 1 filter, try to remove 1 and update it
    //if 1 or less filters, delete entire filter obj

    //check if filter for this workspace already exists
    getFilterData('', filterId, req, function(err, data) {
        if (err) {
            req.logger.error('Unable to delete custom filter due to error retrieving existing filters');
            req.logger.error(err);
            return res.status(rdk.httpstatus.internal_server_error).rdkSend(err);
        }

        var appletResult = findApplet(data, instanceId, req);
        if (appletResult.err) {
            return res.status(rdk.httpstatus.internal_server_error).rdkSend(appletResult.err);
        }

        data = removeDataFilter(filterName, appletResult.appletIndex, data);

        updateOrDeleteApplet(data, filterId, req, res);

    });

}*/

function updateOrDeleteApplet(data, filterId, req, res) {
    //delete entire filter definition if no applets remain
    if (data.userdefinedfilters.applets.length === 0) {
        deleteFilterData(filterId, req, function(err, finalData) {
            if (err) {
                req.logger.error(err);
                res.status(rdk.httpstatus.internal_server_error).rdkSend(err);
            } else {
                res.status(rdk.httpstatus.ok).rdkSend(finalData);
            }
        });
    } else {
        //otherwise save the updated filters
        postFilterData(data, req, function(err) {
            if (err) {
                req.logger.error(err);
                res.status(rdk.httpstatus.internal_server_error).rdkSend(err);
            } else {
                //res.status(rdk.httpstatus.ok).rdkSend(finalData);
                res.status(rdk.httpstatus.ok).rdkSend(data);
            }
        });
    }
}

function removeDataFilter(filterName, appletIndex, data) {
    //delete filter from array
    var removeIndex = data.applets[appletIndex].filters.indexOf(filterName);
    if (removeIndex > -1) {
        data.applets[appletIndex].filters.splice(removeIndex, 1);
    }

    //delete entire applet definition if no filters remain
    if (data.applets[appletIndex].filters.length === 0) {
        data.applets.splice(appletIndex, 1);
    }
    return data;
}

function getPredefinedFilterData(req, screenId, callback) {
    var cbwFilters = [];
    var filterData;
    var filename;

    filename = './src/resources/user-defined-screens/assets/' + screenId + '_filter.json';
    filterData = cbwFilters.filter(function(el) {
        return (el._id.indexOf(screenId) >= 0);
    });
    if (filterData.length === 0) {
        //just in case there were more matches than one, ignore it
        fs.exists(filename, function(exists) {
            if (exists) {
                fs.readFile(filename, 'utf8', function(err, result) {
                    if (err) {
                        req.logger.error(err.message);
                        callback(err);
                        return;
                    }
                    try {
                        result = JSON.parse(result);
                    } catch (ex) {
                        req.logger.error(ex);
                        callback(ex);
                        return;
                    }
                    cbwFilters.push(result);

                    filterData = dd(result)('userdefinedfilters').val;

                    if (!_.isUndefined(filterData)) {
                        filterData.id = screenId;
                    }
                    callback(null, filterData);
                });
            } else {
                callback(null, '');
            }
        });
    }
}

function getFilterData(predefinedScreensIdsArray, filterId, req, callback) {
    var cbwFilters = [];
    var predefinedFromRequest = req.query.predefined;
    var predefined = 'false';
    var screenName = (req.param('id') || req.param('fromId')).replace(/[^a-zA-Z0-9_\-\s\.]/gi, '');
    var options = _.extend({}, req.app.config.generalPurposeJdsServer, {
        url: '/user/get/' + filterId,
        logger: req.logger || {},
        json: true
    });

    _.each(predefinedScreensIdsArray, function(pdsId) {
        if (screenName === pdsId) {
            predefined = 'true';
        }
    });

    //Not all predefined screens have filters
    if (((predefined === 'true') || (predefinedFromRequest === 'true')) && (screenName.indexOf('-cbw') !== -1)) {
        req.logger.debug('predefined and -cbw: ' + screenName + ' predefined: ' + predefined);
        var returnedData;
        var filename = __dirname + '/assets/' + screenName + '_filter.json';
        returnedData = cbwFilters.filter(function(el) {
            return (el._id.indexOf(screenName) >= 0);
        });
        if (returnedData.length > 0) {
            //just in case there were more matches than one, return the first one
            callback(null, returnedData[0]);
        } else {
            fs.exists(filename, function(exists) {
                if (exists) {
                    fs.readFile(filename, 'utf8', function(err, result) {
                        if (err) {
                            options.logger.error(err.message);
                            callback(err);
                            return;
                        }
                        try {
                            returnedData = JSON.parse(result);
                        } catch (ex) {
                            options.logger.error(ex);
                            callback(ex);
                            return;
                        }
                        cbwFilters.push(returnedData);
                        callback(null, returnedData);
                    });
                } else {
                    callback(null, '');
                }
            });
        }

    } else {

        httpUtil.get(options, function(err, response, returnedData) {
            if (err) {
                options.logger.error(err.message);
                callback(err);
                return;
            }

            callback(null, returnedData);
        });
    }

}

function postFilterData(content, req, callback) {

    var options = _.extend({}, req.app.config.generalPurposeJdsServer, {
        url: '/user/set/this',
        logger: req.logger || {},
        body: content
    });

    httpUtil.post(options,
        function(err, response, data) {
            if (err) {
                options.logger.error({error: err}, 'Unable to POST filter data.');
                if (callback) {
                    callback(err);
                }
            } else {
                if (callback) {
                    callback(null, data);
                }
            }
        }
    );
}

//delete entire filter set for a workspace
//this is only called when all filters for all applets in a workspace have been removed
function deleteFilterData(filterId, req, callback) {
    var options = _.extend({}, req.app.config.generalPurposeJdsServer, {
        url: '/user/destroy/' + filterId,
        logger: req.logger || {}
    });

    httpUtil.get(options, function(err, response, result) {
        if (err) {
            options.logger.error(err.message);
            callback(err);
            return;
        }
        var returnedData;
        try {
            returnedData = JSON.parse(result);
            options.logger.debug(returnedData);
        } catch (ex) {
            options.logger.error(err.message);
            callback(err);
            return;
        }
        if (result === '{}') {
            callback(null, returnedData);
        } else {
            //malformed json
            err = new Error('Unexpected JSON format');
            callback(err);
            return;
        }
    });
}

function createScreenIdFromRequest(req, screenType) {
    var uid;
    var userSession = req.session.user;
    var site = dd(userSession)('site').val;
    var ien = dd(userSession)('duz')(site).val;

    if (!_.isUndefined(site) && !_.isUndefined(ien)) {
        uid = site.concat(';').concat(ien);
        uid = uid.concat('_').concat(screenType);
    }

    return uid;
}

function createFilterId(req) {
    var userSession = req.session.user || {};
    var id = req.param('id') || null;
    var site = userSession.site || null;
    var ien = userSession.duz[site] || null;

    if (ien && site && id) {
        return site + ';' + ien + '_' + id + '_filter';
    } else {
        return null;
    }
}

function createFilterIdFromString(req, id) {
    var userSession = req.session.user || {};
    var site = userSession.site || null;
    var ien = userSession.duz[site] || null;

    if (ien && site && id) {
        return site + ';' + ien + '_' + id + '_filter';
    } else {
        return null;
    }
}

function getInstanceIdParameter(req) {
    return req.param('instanceId') || null;
}

function getFilterParameter(req) {
    return req.param('filter') || null;
}

module.exports.getResourceConfig = getResourceConfig;
module.exports.createFilterId = createFilterId;
module.exports.deleteFilterData = deleteFilterData;
module.exports.getFilterData = getFilterData;
module.exports.postFilterData = postFilterData;
module.exports.findApplet = findApplet;
module.exports.updateOrDeleteApplet = updateOrDeleteApplet;
module.exports.createFilterIdFromString = createFilterIdFromString;
module.exports._processDataForCreate = processDataForCreate;
module.exports._removeDataFilter = removeDataFilter;
module.exports._duplicateFilters = duplicateFilters;
module.exports.duplicateFilterData = duplicateFilterData;
module.exports.getPredefinedFilterData = getPredefinedFilterData;
