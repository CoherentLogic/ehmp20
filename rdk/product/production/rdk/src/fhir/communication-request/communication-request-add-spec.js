'use strict';

var addHandler = require('./communication-request-add');

function stubRequest() {
    var logger = {
        trace: function() {},
        debug: function() {},
        info: function() {},
        warn: function() {},
        error: function() {},
        fatal: function() {}
    };
    var app = {
        config: {
            generalPurposeJdsServer: ''
        }
    };
    var req = {
        logger: logger,
        app: app
    };
    return req;
}

function stubResponse() {
    var res = {
        status: function() {},
        send: function() {},
        next: function() {}
    };
    return res;
}
describe('When adding a communication request', function() {
    var callback, spyEnqueue, message;
    var req = stubRequest();
    var res = stubResponse();

    var queue = {
        enqueue: function(queueNames, message, callback) {
            return callback(null, message);
        }
    };

    beforeEach(function() {
        spyEnqueue = sinon.spy(queue, 'enqueue');
        callback = sinon.spy();

        message = {
            recipient: [{
                reference: 'provider/pu1234'
            }, {
                reference: 'patient/9E7A;10045'
            }],
            payload: [{
                contentReference: {
                    reference: 'patient/9E7A;10045/lab/123'
                }
            }]
        };
    });

    afterEach(function() {
        spyEnqueue.reset();
        callback.reset();
    });

    it('a single communication request is added to multiple recipient queues', function(done) {

        addHandler.handle(queue, message, callback, req, res);
        expect(callback.callCount).to.be(1);

        var queueNames = spyEnqueue.args[0][0];
        expect(queueNames.length).to.be(2);
        expect(queueNames).must.include('provider/pu1234');
        expect(queueNames).must.include('patient/9E7A;10045');

        var queueMessage = spyEnqueue.args[0][1];
        expect(queueMessage.identifier).to.not.be.undefined();
        expect(queueMessage.identifier.value).to.not.be.undefined();
        expect(queueMessage.resourceType).to.be('CommunicationRequest');

        done();
    });
});
