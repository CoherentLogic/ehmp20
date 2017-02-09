'use strict';

/*!
 * connect-jds
 * Agilex Technologies
 *
 */

/**
 * Module dependencies
 */
var _ = require('lodash');
var rdk = require('../core/rdk');
var httpUtil = rdk.utils.http;

/**
 * Default options
 */
var defaultOptions = {
    jdsServer: {
        baseUrl: 'http://IP_ADDRESS:PORT'
    },
    defaultExpirationTime: 1000 * 60 * 60 * 24 * 14
};

/**
 * Default function export for the connect.session.Store
 */
module.exports = function(session) {
    /**
     * Express's session Store.
     */
    var Store = session.Store;
    var mylogger;

    /**
     * Initialize JDSStore with the given `options`.
     *
     * @param {Object} options
     * @api public
     * @param logger
     * @param app
     */
    function JDSStore(options, logger, app) {
        options = options || {};
        Store.call(this, options);

        this.defaultExpirationTime = options.defaultExpirationTime || defaultOptions.defaultExpirationTime;
        this.jdsServer = options.jdsServer || defaultOptions.jdsServer;
        this.app = app;
        mylogger = logger;
    }


    /**
     * Inherit from `Store` for JDSStore, and ignore the non-standard use of __proto__.
     */
    /* jshint ignore:start */
    JDSStore.prototype.__proto__ = Store.prototype;
    /* jshint ignore: end */

    /**
     * Attempt to fetch session by the given `sid`.
     *
     * @param {String} sid
     * @param {Function} callback
     * @api public
     */
    JDSStore.prototype.get = function(sid, callback) {
        mylogger.debug('In connect-jds.get method with passed in sid:' + sid);
        if (!sid) {
            return setImmediate(callback);
        }

        var jdsServer = this.jdsServer; //Get the JDS Server that we will do the HTTP Get from

        var jdsResource = '/session/get'; //The correct endpoint from the JDS for GET which is part of VPRJSES global

        var jdsOptions = _.extend({}, jdsServer, {
            url: jdsResource + '/' + sid, //JDS team decided to just append sit to URL for get
            timeout: 120000,
            logger: mylogger,
            json: true
        });
        mylogger.debug({sid: sid}, 'In connect-jds.get method with passed in sid: %s. Before httpUtil.get call', sid);
        httpUtil.get(jdsOptions,
            function(err, response, body) {
                if (err) {
                    mylogger.debug({sid: sid, error: err}, 'In connect-jds.get method with passed in sid: %s. After httpUtil.get call with error', sid);
                    if (callback) {
                        callback(err, null);
                    }
                    return;
                }
                if (body.session) {
                    //Always return the session. We will leave it up to the calling app to call destroy if session has expired.
                    mylogger.debug({sid: sid, body: body}, 'In connect-jds.get method with passed in sid: %s. After httpUtil.get call with returned session.', sid);
                    callback(null, body.session);
                } else {
                    mylogger.debug({sid: sid, response: response}, 'In connect-jds.get method with passed in sid: %s. After httpUtil.get call without returned session.', sid);
                    if (callback) {
                        callback();
                    }
                }
            }
        );
    };


    /**
     * Commit the given `sess` object associated with the given `sid`.
     *
     * @param {String} sid
     * @param {Session} session
     * @param {Function} callback
     * @api public
     */

    JDSStore.prototype.set = function(sid, session, callback) {
        mylogger.debug({sid: sid}, 'In connect-jds.set method with passed in sid:' + sid);

        var s = {
            _id: sid,
            session: session
        };
        if (session && session.cookie && session.cookie.expires) {
            s.expires = new Date(session.cookie.expires);
        } else {
            // If there's no expiration date specified, it is
            // browser-session cookie or there is no cookie at all,
            // as per the connect docs.
            //
            // So we set the expiration to two-weeks from now
            // - as is common practice in the industry (e.g Django) -
            // or the default specified in the options.
            var today = new Date();
            s.expires = new Date(today.getTime() + this.defaultExpirationTime);
        }


        var jdsServer = this.jdsServer; //Get the JDS Server that we will do the HTTP Get from
        var jdsResource = '/session/set/this'; //The correct endpoint from the JDS for SET which is part of VPRJSES global
        var content = JSON.stringify(s); //Stringify the session as it needs to go in to the JDS as JSON String
        var jdsOptions = _.extend({}, jdsServer, {
            url: jdsResource,
            timeout: 120000,
            logger: mylogger,
            body: content
        });
        mylogger.debug({sid: sid, session: s}, 'In connect-jds.set method with passed in sid:' + sid + ' and session. Before httpUtil.post call');
        httpUtil.post(jdsOptions,
            function(err, response, data) {
                if (err) {
                    mylogger.debug({sid: sid, error: err}, 'In connect-jds.set method with passed in sid:' + sid + '. Error on postJSONObject');
                    if (callback) {
                        callback(err);
                    }
                    return;
                }
                mylogger.debug({sid: sid}, 'In connect-jds.set method with passed in sid:' + sid + '. Success on postJSONObject.');
                if (callback) {
                    callback(null, data);
                }

            }
        );
    };

    /**
     * Destroy the session associated with the given `sid`.
     *
     * @param {String} sid
     * @param {Function} callback
     * @api public
     */
    JDSStore.prototype.destroy = function(sid, callback) {
        mylogger.debug({sid: sid}, 'In connect-jds.destroy method with passed in sid:' + sid);

        if (!sid) {
            return setImmediate(callback);
        }
        var jdsServer = this.jdsServer; //Get the JDS Server that we will do the HTTP Get from
        var jdsResource = '/session/destroy'; //The correct endpoint from the JDS for DESTROY which is part of VPRJSES global
        var jdsOptions = _.extend({}, jdsServer, {
            url: jdsResource + '/' + sid, //JDS Team decided to just append the SID onto the URL as it made things easier for them
            timeout: 120000,
            logger: mylogger
        });
        mylogger.debug({sid: sid}, 'In connect-jds.destroy method with passed in sid:' + sid + '. Before httpUtil.get call');
        httpUtil.get(jdsOptions,
            function(err) {
                if (err) {
                    mylogger.debug({sid: sid, error: err}, 'In connect-jds.destroy method with passed in sid:' + sid + '. After httpUtil.get call with error');
                    if (callback) {
                        callback(err);
                    }
                    return;
                }
                mylogger.debug({sid: sid}, 'In connect-jds.destroy method with passed in sid:' + sid + '. After httpUtil.get call with success.');
                if (callback) {
                    callback(null);
                }
            }
        );
    };


    /**
     * Fetch number of JDS sessions.
     *
     * @param {Function} callback
     * @api public
     */
    JDSStore.prototype.length = function(callback) {
        mylogger.debug('In connect-jds.length method');

        var jdsServer = this.jdsServer; //Get the JDS Server that we will do the HTTP Get from
        var jdsResource = '/session/length/this'; //The correct endpoint from the JDS for LENGTH which is part of VPRJSES global
        var jdsOptions = _.extend({}, jdsServer, {
            url: jdsResource,
            timeout: 120000,
            logger: mylogger
        });
        mylogger.debug('In connect-jds.length method. Before httpUtil.get call');
        httpUtil.get(jdsOptions,
            function(err, response, length) {
                if (err) {
                    mylogger.debug({error: err}, 'In connect-jds.length method. After httpUtil.get call with error');
                    if (callback) {
                        callback(err, null);
                    }
                    return;
                }
                mylogger.debug('In connect-jds.length method. After httpUtil.get call success.');
                if (callback) {
                    callback(null, length);
                }
            }
        );
    };

    /**
     * Clear all sessions.
     *
     * @param {Function} callback
     * @api public
     */
    JDSStore.prototype.clear = function(callback) {
        mylogger.debug('In connect-jds.clear method');

        var jdsServer = this.jdsServer; //Get the JDS Server that we will do the HTTP Get from
        var jdsResource = '/session/clear/this'; //The correct endpoint from the JDS for CLEAR which is part of VPRJSES global
        var jdsOptions = _.extend({}, jdsServer, {
            url: jdsResource,
            timeout: 120000,
            logger: mylogger
        });

        mylogger.debug('In connect-jds.clear method. Before httpUtil.get call');
        httpUtil.get(jdsOptions,
            function(err) {
                if (err) {
                    mylogger.debug({error: err}, 'In connect-jds.clear method. After httpUtil.get call with error');
                    if (callback) {
                        callback(err);
                    }
                    return;
                }
                mylogger.debug('In connect-jds.clear method. After httpUtil.get call with success.');
                if (callback) {
                    callback(null);
                }
            }
        );
    };

    return JDSStore;
};
