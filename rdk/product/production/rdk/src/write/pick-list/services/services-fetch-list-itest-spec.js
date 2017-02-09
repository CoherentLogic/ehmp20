'use strict';

var fetch = require('./services-fetch-list').fetch;

var log = sinon.stub(require('bunyan').createLogger({ name: 'services-fetch-list' }));

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

describe('services fetch integration test', function() {
    it('can call the RPC, takes no inputs', function(done) {
        this.timeout(20000);

        fetch(log, configuration, function(err, result) {
            expect(err).to.be.falsy();
            expect(result).to.be.truthy();
            done();
        }, {});
    });
});

