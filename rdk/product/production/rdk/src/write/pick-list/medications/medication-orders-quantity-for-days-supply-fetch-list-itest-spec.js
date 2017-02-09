/*global sinon, describe, it */
'use strict';

var fetch = require('./medication-orders-quantity-for-days-supply-fetch-list').fetch;

var log = sinon.stub(require('bunyan').createLogger({ name: 'medication-orders-quantity-for-days-supply-fetch-list' }));
//var log = require('bunyan').createLogger({ name: 'medication-orders-quantity-for-days-supply-fetch-list' }); //Uncomment this line (and comment above) to see output in IntelliJ console

var configuration = {
    environment: 'development',
    context: 'OR CPRS GUI CHART',
    host: 'IP_ADDRESS',
    port: 9210,
    accessCode: 'PW',
    verifyCode: 'PW',
    localIP: 'IPADDRES',
    localAddress: 'localhost'
};

describe('medication-orders-quantity-for-days-supply resource integration test', function() {
    it('can call the fetch RPC', function (done) {
        this.timeout(20000);

        fetch(log, configuration, function(err, result) {
            expect(err).to.be.falsy();
            expect(result).to.be.truthy();
            done();
        }, {daysSupply: 90, unitsPerDose: '2^', schedule: 'Q6H PRN^', duration: '~^', patientDFN: '100615', drug: '213'});
    });

    it('will handle returning an empty field if schedule is not correct', function (done) {
        this.timeout(20000);

        fetch(log, configuration, function(err, result) {
            expect(err).to.be.falsy();
            expect(result).to.be.truthy();
            done();
        }, {daysSupply: 90, unitsPerDose: '2^', schedule: '^', duration: '~^', patientDFN: '100615', drug: '213'});
    });
});

