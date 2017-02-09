'use strict';
var audit = require('./audit');
var httpMocks = require('node-mocks-http');

var patient = '9E7A;167';
// var authorization = 'Basic OUU3QTtwdTEyMzQ6cHUxMjM0ISE=';

function buildRequest(pid) {


    var request = httpMocks.createRequest({
        method: 'GET',
        url: '/audit'

    });

    request.param = function(key) {
        return request.params[key];
    };

    request.get = function(header) {
        return this.headers[header];
    };

    request.audit = {
        patientId: pid
    };

    request.logger = {
        trace: function() {},
        debug: function() {},
        info: function() {},
        warn: function() {},
        error: function() {}
    };

    request.query.pid = patient;

    request.session = {
        user: {
            site: 'TEST',
            duz: {
                'TEST': '123456'
            },
            username: 'TEST;123456',
            password: 'password'
        }
    };

    // request.headers['Authorization'] = authorization;

    return request;
}


xdescribe('onFinish()', function(test) {
    it('Expect audit is save on Finish Call', function() {

        var req = buildRequest(patient);
        var onFinish = {
            finish: function() {
            }
        };

        req.app = {};
        req.app.auditer = {};
        req.app.auditer.save = sinon.spy();


        var res = httpMocks.createResponse();
        res.statusCode = '-';
        res.rdkSend = function(body) {
            res.send(body);
        };


        res.on = function(name, callback) {
            callback();
        };

        audit(req, res, onFinish.finish);
        expect(req.app.auditer.save.called).to.be.true();
    });

    it('Expect audit is save on Close Call', function() {

        var req = buildRequest(patient);

        var onCloseFunction = {
            close: function() {
            }
        };

        req.app = {};
        req.app.auditer = {};
        req.app.auditer.save = sinon.spy();

        var res = httpMocks.createResponse();
        res.statusCode = '-';
        res.rdkSend = function(body) {
            res.send(body);
        };

        res.on = function(name, callback) {
            callback();
        };

        audit(req, res, onCloseFunction.close);
        expect(req.app.auditer.save.called).to.be.true();
    });
});
