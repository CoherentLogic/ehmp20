'use strict';

var vprOrder = require('./orders-common-vpr-order');

var writebackContext = {
    pid: '9E7A;3',
    siteHash:'9E7A',
    appConfig:{
        rpcConfig: {
            context: 'HMP UI CONTEXT'
        },
        vistaSites: {
            '9E7A': {
                name: 'PANORAMA',
                division: '500',
                host: 'IP_ADDRESS',
                port: 9210,
                production: false,
                accessCode: 'PW',
                verifyCode: 'PW',
                localIP: '127.0.0.1',
                localAddress: 'localhost'
            },
            'C877': {
                name: 'KODAK',
                division: '500',
                host: 'IP_ADDRESS',
                port: 9210,
                production: false,
                accessCode: 'PW',
                verifyCode: 'PW',
                localIP: '127.0.0.1',
                localAddress: 'localhost'
            }
        }
    },
    model: {
        "dfn": "3",
        "provider": "10000000231",
        "location": "285",
        "eSig": "mx1234!!",
        "orderList": [{
            'orderId': "38030;1",
            'orderDetailHash': "foobar"
        }, {
            'orderId': "38032;1",
            'orderDetailHash': "foobar"
        }]
    },
    logger: sinon.stub(require('bunyan').createLogger({name: 'order-detail-comparator'}))
};

describe('Checks getVprOrder functionality', function () {

    it ('retrieve existing vpr order', function(done) {
        var uid = 'urn:va:order:9E7A:3:12540';

        this.timeout(8000);

        vprOrder.getVprOrder(writebackContext, uid, function(err, result){
            expect(result).to.be.truthy();
            expect(err).to.be.falsy();
            expect(result.uid).to.be.equal(uid);
            done();
        });
    });

    it('attempt to retrieve a vpr order that does not exist', function(done) {

        this.timeout(8000);

        vprOrder.getVprOrder(writebackContext, 'urn:va:order:9E7A:3:99999999', function(err, result){
            expect(result).to.be.falsy();
            expect(err).to.be.truthy();
            expect(err.message).to.equal("Failed to parse order VPR result.");
            done();
        });
    });
});

describe('Checks get vpr orders functionality', function() {

    it('tests getVprOrders', function(done) {
        var self = this;
        self.timeout(10000);

        vprOrder.getVprOrders(writebackContext, function(err, result) {
            expect(err).to.be.falsy();
            expect(result).to.be.truthy();
            expect(result.length).to.equal(2);
            expect(result[0].localId).to.equal(38030);
            expect(result[1].localId).to.equal(38032);

            done();
        });
    });
});

