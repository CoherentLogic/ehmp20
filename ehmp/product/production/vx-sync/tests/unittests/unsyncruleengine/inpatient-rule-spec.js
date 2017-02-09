/*global describe, it, expect, runs, waitsFor */
'use strict';
require('../../../env-setup');
var UnSyncRulesEngine =  require(global.VX_UNSYNCRULES + '/rules-engine');

var _ = require('underscore');
var log = {
    debug: function() {},
    warn: function(){},
    trace: function(){},
    info: function(){}
};

var config = {
    unsync: {
        rules: {
            'inpatient': {}
        }
    }
};
var environment = {
    metrics: log
};

describe('inpatient-rule', function(){
    it('Normal path: all patients are inpatient and discharge date is more than 1 month ago', function() {
        var done = false;
        var patientIds = [
            {value:'9E7A;3', type:'PID', 'inpatient':true, 'dischargeDate': 'Wed Sep 24 2014 14:58:49 GMT-0600 (MDT)'},
            {value:'10107V395912', type:'icn', 'inpatient':true, 'dischargeDate': 'Wed Sep 24 2014 14:58:49 GMT-0600 (MDT)'},
            {value:'302394234V323425', type:'ICN', 'inpatient':true, 'dischargeDate': 'Wed Sep 24 2014 14:58:49 GMT-0600 (MDT)'},
            {value:'DOD;0000000003',type:'PID', 'inpatient':true},
        ];

        var engine = new UnSyncRulesEngine(log, config, environment);
        runs(function() {
            engine.processUnSyncRules(patientIds, function(err, result) {
                expect(result.length).toEqual(3);
                done = true;
            });
        });
        waitsFor(function() {
            return done;
        });
    });
});