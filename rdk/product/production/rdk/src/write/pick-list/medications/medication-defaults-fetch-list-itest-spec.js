'use strict';

var fetch = require('./medication-defaults-fetch-list').fetch;

var log = sinon.stub(require('bunyan').createLogger({ name: 'medication-defaults-fetch-list' }));
//var log = require('bunyan').createLogger({ name: 'medication-defaults-fetch-list' }); //Uncomment this line (and comment above) to see output in IntelliJ console

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

describe('medication-defaults resource integration test', function() {
    it('can call the RPC', function (done) {
        this.timeout(20000);
        fetch(log, configuration, function(err, result) {
            expect(err).to.be.falsy();
            expect(result).to.be.truthy();
            done();
        }, {pharmacyType: 'O', outpatientDfn: '100615', locationUid: 'urn:va:location:9E7A:64'});
    });
});
