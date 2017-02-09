'use strict';

var rdk = require('../../core/rdk');
var _ = require('lodash');
var httpUtil = rdk.utils.http;
var dd = require('drilldown');
var userdefinedFilter = require('./user-defined-filter-resource');
var userDefinedGraph = require('./user-defined-stack-resource');
var async = require('async');
var nullchecker = rdk.utils.nullchecker;

function getResourceConfig() {
    return [{
        name: 'user-defined-screens',
        path: '',
        get: getUserDefinedScreens,
        interceptors: {
            operationalDataCheck: false,
            synchronize: false
        },
        requiredPermissions: [],
        isPatientCentric: false
    }];
}

function getUserDefinedScreens(req, res) {
    req.logger.debug('Inside Get user defined screens');

    var USER_SCREENS_CONFIG = 'UserScreensConfig';
    var screenConfigId = createScreenIdFromRequest(req, USER_SCREENS_CONFIG);
    //var filterId;
    //var stackedId;
    //var sortId;
    //var screenIds = [];
    //var userdefinedscreenIds = [];
    var UDSScreensNConfig = {};
    var userDefinedScreens = [];
    var userDefinedFilters = [];
    var userDefinedGraphs = [];
    //var userDefinedSorts = [];

    var tasks = [];

    var predefinedScreenIdsString = req.param('predefinedScreens');

    if(nullchecker.isNotNullish(predefinedScreenIdsString)) {
        tasks.push(function (callback) {
            //Get predefined filter data
            var predefinedScreensIdsArray = predefinedScreenIdsString.split(',');

            _.each(predefinedScreensIdsArray, function(screenId) {
                userdefinedFilter.getPredefinedFilterData(req, screenId, function(err, filterData) {
                    if (err) {
                        req.logger.error(err);
                    } else {

                        if(nullchecker.isNotNullish(filterData)) {
                            userDefinedFilters.push(filterData);
                        }
                    }
                    callback();
                });
            });

            req.logger.debug({filters: userDefinedFilters}, 'Inside getUserDefinedScreens returned predefined filter data');
        });

        tasks.push(function (callback) {
            //Get predefined stacked graph data
            var predefinedScreensIdsArray = predefinedScreenIdsString.split(',');

            _.each(predefinedScreensIdsArray, function(screenId) {
                userDefinedGraph.getPredefinedStackedGraphData(req, screenId, function(err, stackedGrpahData) {
                    if (err) {
                        req.logger.error(err);
                    } else {
                        if(nullchecker.isNotNullish(stackedGrpahData)) {
                            userDefinedGraphs.push(stackedGrpahData);
                        }
                    }
                    callback();
                });
            });

            req.logger.debug({graphs: userDefinedGraphs}, 'Inside getUserDefinedScreens returned predefined stacked graph data');
        });
    }

    tasks.push(function (callback) {
        getScreenData(screenConfigId, req, function(err, data) {
            if (err) {
                req.logger.error(err);
                res.status(rdk.httpstatus.internal_server_error).rdkSend(err);
            } else {
                //the UI is coded to work with data.userdefinedscreens
                //return as it expects it if we can,
                //but don't force that standard on other users of the getScreenData function
                //make UI happy by passing a string - even undefined/null
                //data = JSON.stringify(data.userdefinedscreens);
                //res.status(rdk.httpstatus.ok).rdkSend(data);

                req.logger.debug({data: data}, 'Inside getUserDefinedScreens data');

                if(_.keys(data).length === 0) {
                    UDSScreensNConfig.userScreensConfig = {screens:[]};
                    UDSScreensNConfig.userDefinedScreens = userDefinedScreens;
                    UDSScreensNConfig.userDefinedFilters = userDefinedFilters;
                    UDSScreensNConfig.userDefinedGraphs = userDefinedGraphs;
                    req.logger.debug({UDSScreensNConfig: UDSScreensNConfig}, 'Inside getUserDefinedScreens UDSScreensNConfig nullish');
                    res.status(rdk.httpstatus.ok).rdkSend(UDSScreensNConfig);
                } else {
                    //Add predefined filters to uderdefined filters
                    if(data.hasOwnProperty('userDefinedFilters')) {
                        var combinedFiltersArr = data.userDefinedFilters.concat(userDefinedFilters);
                        data.userDefinedFilters = combinedFiltersArr;
                    } else {
                        data.userDefinedFilters = userDefinedFilters;
                    }

                    //Add predefined graphs to uderdefined graphs
                    if(data.hasOwnProperty('userDefinedGraphs')) {
                        var combinedGraphsArr = data.userDefinedGraphs.concat(userDefinedGraphs);
                        data.userDefinedGraphs = combinedGraphsArr;
                    } else {
                        data.userDefinedGraphs = userDefinedGraphs;
                    }
                    req.logger.debug({data: data}, 'Inside getUserDefinedScreens UDSScreensNConfig');
                    res.status(rdk.httpstatus.ok).rdkSend(data);
                }
            }
            callback();
        });
    });

    async.series(tasks, function () {
    });
}

function createScreenIdFromRequest(req, screenType) {
    var uid;
    var userSession = req.session.user;
    var site = dd(userSession)('site').val;
    var ien = dd(userSession)('duz')(site).val;

    if(!_.isUndefined(site) && !_.isUndefined(ien)) {
        uid = site.concat(';').concat(ien);
        uid = uid.concat('_').concat(screenType);
    }

    return uid;
}

function getScreenData(screenId, req, callback) {
    var mdsResource = '/user/get'; //The correct endpoint from the JDS for GET which is part of VPRJSES global

    var conf_options = _.extend({}, req.app.config.generalPurposeJdsServer, {
        url: mdsResource + '/' + screenId, //JDS team decided to just append sit to URL for get
        logger: req.logger,
        json: true
    });

    httpUtil.get(conf_options,
        function(err, response, data) {
            if (err) {
                conf_options.logger.error({error: err}, 'userdefinedscreens getScreenData screenId:' + screenId + ' with err');
                callback(err);
            } else {
                req.logger.debug({data: data}, 'Inside Yea userdefinedscreens: ');
                callback(null, data);
            }
        }
    );
}

exports.getResourceConfig = getResourceConfig;
exports.getScreenData = getScreenData;
exports.createScreenIdFromRequest = createScreenIdFromRequest;
