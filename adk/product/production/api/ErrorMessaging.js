define([
    'jquery',
    'underscore'
], function($, _) {
    'use strict';
    var ErrorMessaging = {};
    ErrorMessaging.statusCodeMessages = {
        401: 'Unauthorized User.',
        308: 'Sensitive Patient not acknowledged.',
        500: 'Internal Server Error: The server encountered an unexpected condition which prevented it from fulfilling the request.',
        502: 'Server Error: The server encountered a temporary error and could not complete your request.',
        404: 'Resource Not Found.',
        syncTimeout: 'The server has timed-out while loading patient data. Try again later.',
        default: 'An error has occurred.'
    };
    ErrorMessaging.getMessage = function(errorCode) {
        if (this.statusCodeMessages.hasOwnProperty(errorCode)) {
            return this.statusCodeMessages[errorCode];
        }
        return this.statusCodeMessages.default;
    };

    return ErrorMessaging;
});