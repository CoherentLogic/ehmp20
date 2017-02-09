'use strict';

var resource = require('./orders-resources');

describe('write-back orders Resources', function() {
    it('tests that getResourceConfig() is setup correctly for create order', function() {
        var resources = resource.getResourceConfig();
        expect(resources.length).to.equal(10);

        expect(resources[0].name).to.equal('orders-lab-create');
        expect(resources[0].path).to.equal('/lab');
        expect(resources[0].interceptors).to.eql({
            operationalDataCheck: false,
            synchronize: false
        });
        //expect(resources[0].permissions).not.to.be.undefined();
        expect(resources[0].post).not.to.be.undefined();
    });

    it('tests that getResourceConfig() is setup correctly for update order', function() {
        var resources = resource.getResourceConfig();
        expect(resources.length).to.equal(10);

        expect(resources[1].name).to.equal('orders-lab-update');
        expect(resources[1].path).to.equal('/lab/:resourceId');
        expect(resources[1].interceptors).to.eql({
            operationalDataCheck: false,
            synchronize: false
        });
        //expect(resources[1].permissions).not.to.be.undefined();
        expect(resources[1].put).not.to.be.undefined();
    });

    it('tests that getResourceConfig() is setup correctly for discontinue order', function() {
        var resources = resource.getResourceConfig();
        expect(resources.length).to.equal(10);

        expect(resources[2].name).to.equal('orders-lab-edit');
        expect(resources[2].path).to.equal('/lab/:resourceId');
        expect(resources[2].interceptors).to.eql({
            operationalDataCheck: false,
            synchronize: false
        });
        //expect(resources[2].permissions).not.to.be.undefined();
        expect(resources[2].get).not.to.be.undefined();
    });

    it('tests that getResourceConfig() is setup correctly for detail order', function() {
        var resources = resource.getResourceConfig();
        expect(resources.length).to.equal(10);

        expect(resources[3].name).to.equal('orders-lab-detail');
        expect(resources[3].path).to.equal('/detail-lab/:resourceId');
        expect(resources[3].interceptors).to.eql({
            operationalDataCheck: false,
            synchronize: false
        });
        //expect(resources[3].permissions).not.to.be.undefined();
        expect(resources[3].get).not.to.be.undefined();
    });

    it('tests that getResourceConfig() is setup correctly for sign-details order', function() {
        var resources = resource.getResourceConfig();
        expect(resources.length).to.equal(10);

        expect(resources[4].name).to.equal('orders-lab-sign-details');
        expect(resources[4].path).to.equal('/sign-details-lab');
        expect(resources[4].interceptors).to.eql({
            operationalDataCheck: false,
            synchronize: false
        });
        //expect(resources[4].permissions).not.to.be.undefined();
        expect(resources[4].post).not.to.be.undefined();
    });

    it('tests that getResourceConfig() is setup correctly for discontinue-details order', function() {
        var resources = resource.getResourceConfig();
        expect(resources.length).to.equal(10);

        expect(resources[5].name).to.equal('orders-lab-discontinue-details');
        expect(resources[5].path).to.equal('/discontinue-details-lab');
        expect(resources[5].interceptors).to.eql({
            operationalDataCheck: false,
            synchronize: false
        });
        //expect(resources[5].permissions).not.to.be.undefined();
        expect(resources[5].post).not.to.be.undefined();
    });

    it('tests that getResourceConfig() is setup correctly for discontinue order', function() {
        var resources = resource.getResourceConfig();
        expect(resources.length).to.equal(10);

        expect(resources[6].name).to.equal('orders-lab-discontinue');
        expect(resources[6].path).to.equal('/discontinue-lab');
        expect(resources[6].interceptors).to.eql({
            operationalDataCheck: false,
            synchronize: false
        });
        //expect(resources[6].permissions).not.to.be.undefined();
        expect(resources[6].delete).not.to.be.undefined();
    });

    it('tests that getResourceConfig() is setup correctly for sign orders', function() {
        var resources = resource.getResourceConfig();
        expect(resources.length).to.equal(10);

        expect(resources[7].name).to.equal('orders-lab-sign');
        expect(resources[7].path).to.equal('/sign-lab');
        expect(resources[7].interceptors).to.eql({
            operationalDataCheck: false,
            synchronize: false
        });
        //expect(resources[7].permissions).not.to.be.undefined();
        expect(resources[7].post).not.to.be.undefined();
    });

    it('tests that getResourceConfig() is setup correctly for draft orders', function() {
        var resources = resource.getResourceConfig();
        expect(resources.length).to.equal(10);

        expect(resources[8].name).to.equal('orders-lab-save-draft');
        expect(resources[8].path).to.equal('/save-draft-lab');
        expect(resources[8].interceptors).to.eql({
            operationalDataCheck: false,
            synchronize: false
        });
        //expect(resources[7].permissions).not.to.be.undefined();
        expect(resources[8].post).not.to.be.undefined();
    });

    it('tests that getResourceConfig() is setup correctly for finding draft orders', function() {
        var resources = resource.getResourceConfig();
        expect(resources.length).to.equal(10);

        expect(resources[9].name).to.equal('orders-lab-find-draft');
        expect(resources[9].path).to.equal('/find-draft-lab');
        expect(resources[9].interceptors).to.eql({
            operationalDataCheck: false,
            synchronize: false
        });
        //expect(resources[7].permissions).not.to.be.undefined();
        expect(resources[8].post).not.to.be.undefined();
    });


    it('tests that identifyOrderType returns correct order types', function() {
        var req = {
            body: {
                kind: 'Laboratory'
            },
            logger: {
                info: function(log) {
                    return log;
                }
            }
        };
        var orderType = resource._identifyOrderType(req);
        expect(orderType).to.equal('Laboratory');

        req.body.kind = 'Medication, Outpatient';
        orderType = resource._identifyOrderType(req);
        expect(orderType).to.equal('Medication, Outpatient');

        req.body.kind = 'Lab';
        orderType = resource._identifyOrderType(req);
        expect(orderType).to.equal('Unhandled Order Type');
    });
});
