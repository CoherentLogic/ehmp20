/**
 * Created by alexluong on 5/26/15.
 */

'use strict';

var pidValidator = require('./pid-validator');

pidValidator.initialize({
    config: {
        vistaSites: {
            '9E7A': {
                name: 'PANORAMA',
                division: '500',
                host: 'IP_ADDRESS',
                localIP: 'IPADDRES',
                localAddress: 'localhost',
                port: 9210,
                production: false,
                accessCode: 'PW',
                verifyCode: 'PW',
                infoButtonOid: '1.3.6.1.4.1.3768'
            },
            'C877': {
                name: 'KODAK',
                division: '500',
                host: 'IP_ADDRESS',
                localIP: 'IPADDRES',
                localAddress: 'localhost',
                port: 9210,
                production: false,
                accessCode: 'PW',
                verifyCode: 'PW',
                infoButtonOid: '1.3.6.1.4.1.3768'
            }
        }
    },
    logger: sinon.stub(require('bunyan').createLogger({
        name: 'pid-validator-spec.js'
    }))
});

var patientIdentifiers = {
    icn: '1V1',
    dfn: '1',
    currentSiteDfn: 'currentSite;1',
    primarySiteDfn: '9E7A;1',
    edipi: '01',
    siteIcn: 'site;1V1'
};

describe('site checks', function() {
    describe('containsSite', function() {
        it('should determine if pid contains the site', function() {
            expect(pidValidator.containsSite(patientIdentifiers.siteIcn)).to.be.true();
            expect(pidValidator.containsSite(patientIdentifiers.icn)).to.be.false();
        });
    });
    describe('isCurrentSite', function() {
        it('should determine if pid site is the site currently logged in to', function() {
            expect(pidValidator.isCurrentSite('currentSite', patientIdentifiers.currentSiteDfn)).to.be.true();
            expect(pidValidator.isCurrentSite('currentSite', patientIdentifiers.primarySiteDfn)).to.be.false();
        });
    });
    describe('isPrimarySite', function() {
        it('should determine if pid site is a primary site', function() {
            expect(pidValidator.isPrimarySite(patientIdentifiers.primarySiteDfn)).to.be.truthy();
            expect(pidValidator.isPrimarySite(patientIdentifiers.edipi)).to.be.falsy();
        });
    });
});

describe('patient identifier format checks', function() {
    describe('icn regex', function() {
        it('should match a valid icn', function() {
            expect(pidValidator.icnRegex.test(patientIdentifiers.icn)).to.be.true();
        });
        it('should not match an invalid icn', function() {
            expect(pidValidator.icnRegex.test(patientIdentifiers.dfn)).to.be.false();
        });
    });
    describe('dfn regex', function() {
        it('should match a valid dfn', function() {
            expect(pidValidator.dfnRegex.test(patientIdentifiers.dfn)).to.be.true();
        });
        it('should not match an invalid dfn', function() {
            expect(pidValidator.dfnRegex.test(patientIdentifiers.icn)).to.be.false();
        });
    });
    describe('isIcn', function() {
        it('should determine if pid is icn', function() {
            expect(pidValidator.isIcn(patientIdentifiers.icn)).to.be.true();
            expect(pidValidator.isIcn(patientIdentifiers.dfn)).to.be.false();
        });
    });
    describe('isDfn', function() {
        it('should determine if pid is dfn', function() {
            expect(pidValidator.isDfn(patientIdentifiers.dfn)).to.be.true();
            expect(pidValidator.isDfn(patientIdentifiers.icn)).to.be.false();
        });
    });
    describe('isSiteIcn', function() {
        it('should determine if pid is site;icn', function() {
            expect(pidValidator.isSiteIcn(patientIdentifiers.siteIcn)).to.be.true();
            expect(pidValidator.isSiteIcn(patientIdentifiers.icn)).to.be.false();
        });
    });
    describe('isSiteDfn', function() {
        it('should determine if pid is site;dfn', function() {
            expect(pidValidator.isSiteDfn(patientIdentifiers.currentSiteDfn)).to.be.true();
            expect(pidValidator.isSiteDfn(patientIdentifiers.dfn)).to.be.false();
        });
    });
    describe('isEdipi', function() {
        it('should determine if pid is site;edipi', function() {
            expect(pidValidator.isEdipi(patientIdentifiers.edipi)).to.be.true();
            expect(pidValidator.isEdipi(patientIdentifiers.primarySiteDfn)).to.be.false();
        });
    });
});
