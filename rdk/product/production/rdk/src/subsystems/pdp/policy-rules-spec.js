'use strict';

var rulesEngine = require('./rules-engine');
var rules = require('./policy-rules').rules;
var fact = {};

describe('Test all policy rules', function() {
    beforeEach(function() {
        fact = {};
    });

    it('systemUserPolicy- permit response', function() {
        fact = {
            consumerType: 'system',
            breakglass: false,
            sensitive: false,
            hasSSN: true,
            requestingOwnRecord: false,
            rptTabs: false,
            corsTabs: false,
            dgRecordAccess: false,
            dgSensitiveAccess: false
        };
        rulesEngine.executeRules(rules, fact, function (result) {
            expect(result.code).to.equal('Permit');
        });
    });
    it('cprsUserPolicy- deny response', function() {
        fact = {
            breakglass: false,
            sensitive: false,
            hasSSN: true,
            requestingOwnRecord: false,
            rptTabs: false,
            corsTabs: false,
            dgRecordAccess: false,
            dgSensitiveAccess: false
        };
        rulesEngine.executeRules(rules, fact, function (result) {
            expect(result.code).to.equal('Deny');
        });
    });
    it('accessOwnRecordPolicy', function() {
        fact = {
            breakglass: false,
            sensitive: false,
            hasSSN: true,
            requestingOwnRecord: true,
            rptTabs: true,
            corsTabs: true,
            dgRecordAccess: false,
            dgSensitiveAccess: false
        };
        rulesEngine.executeRules(rules, fact, function(result) {
            expect(result.code).to.equal('Deny');
        });
    });
    it('undefinedOrNoSSNPolicy', function() {
        fact = {
            breakglass: false,
            sensitive: false,
            hasSSN: false,
            requestingOwnRecord: false,
            rptTabs: true,
            corsTabs: true,
            dgRecordAccess: false,
            dgSensitiveAccess: false
        };
        rulesEngine.executeRules(rules, fact, function(result) {
            expect(result.code).to.equal('BreakGlass');
            expect(result.reason).to.equal('PatientHasUndefinedSSN');
        });
    });
    it('sensitivePolicyBreakglass', function() {
        fact = {
            breakglass: false,
            sensitive: true,
            hasSSN: true,
            requestingOwnRecord: false,
            rptTabs: true,
            corsTabs: true,
            dgRecordAccess: false,
            dgSensitiveAccess: false
        };
        rulesEngine.executeRules(rules, fact, function(result) {
            expect(result.code).to.equal('BreakGlass');
            expect(result.reason === 'SensitiveAccessRequired').to.be.true;
        });
    });
    it('sensitivePolicyPermit', function() {
        fact = {
            breakglass: true,
            sensitive: true,
            hasSSN: true,
            requestingOwnRecord: false,
            rptTabs: true,
            corsTabs: false,
            dgRecordAccess: false,
            dgSensitiveAccess: false
        };
        rulesEngine.executeRules(rules, fact, function(result) {
            expect(result.code).to.equal('Permit');
        });
    });
    it('default', function() {
        fact = {
            breakglass: false,
            sensitive: false,
            hasSSN: true,
            requestingOwnRecord: false,
            rptTabs: true,
            corsTabs: false,
            dgRecordAccess: false,
            dgSensitiveAccess: false
        };
        rulesEngine.executeRules(rules, fact, function (result) {
            expect(result.code).to.equal('Permit');
        });
    });
});
