'use strict';

var log = sinon.stub(require('bunyan').createLogger({
    name: 'lab-all-samples-parser'
}));

var parse = require('./lab-all-samples-parser').parse;

describe('verify lab all samples parser', function() {
    it('parse empty string data', function () {
        var result = parse(log, '');
        expect(result).to.eql([]);
    });

    it('parse invalid string data', function () {
        expect(function() {parse(log, 'Home is where the heart is.');}).to.throw(Error);
    });

    it('parse empty ~ only data', function () {
        var result = parse(log, '~');
        expect(result).to.eql([{categoryName: ''}]);
    });

    it('parse field data with blank group name', function () {
        var result = parse(log, '~\r\ni^65^CAPILLARY TUBE^70^BLUE STRIPE^^^^^BLOOD');
        expect(result).to.eql([{categoryName: '', values: [{ien: '65', name: 'CAPILLARY TUBE', specPtr: '70', tubeTop: 'BLUE STRIPE', specName: 'BLOOD'}]}]);
    });

    it('parse field data with blank sepcPtr name', function () {
        var result = parse(log, '~\r\nii^67^BLOOD BANK^^RED & LAV^^^1');
        expect(result).to.eql([{categoryName: '', values: [{ien: '67', name: 'BLOOD BANK', tubeTop: 'RED & LAV', labCollect: '1'}]}]);
    });

    it('parse data with group name only', function () {
        var result = parse(log, '~CollSamp');
        expect(result).to.eql([{categoryName: 'CollSamp'}]);
    });

    it('parse data with 2 fields', function () {
        var result = parse(log, '~Specimens\r\n70^BLOOD');
        expect(result).to.eql([{categoryName: 'Specimens', values: [{ien: '70', name: 'BLOOD'}]}]);
    });

    it('parse data with 8 fields', function () {
        var result = parse(log, '~CollSamp\r\ni^40^TISSUE^^^^^');
        expect(result).to.eql([{categoryName: 'CollSamp', values: [{ien: '40', name: 'TISSUE'}]}]);
    });

    it('parse data with 10 fields', function () {
        var result = parse(log, '~CollSamp\r\ni^13^SYNOVIAL^78^^^^^^SYNOVIAL FLUID');
        expect(result).to.eql([{categoryName: 'CollSamp', values: [{ien: '13', name: 'SYNOVIAL', specPtr: '78', specName: 'SYNOVIAL FLUID'}]}]);
    });

    it('parse data with with multiple collection times', function () {
        var result = parse(log, '~CollSamp\r\ni^68^24 HR URINE^8755^NONE^^^^^24 HR URINE\r\ni^24^ABSCESS^^^^^');
        expect(result).to.eql([{categoryName: 'CollSamp', values: [{ien: '68', name: '24 HR URINE', specPtr: '8755', tubeTop: 'NONE', specName: '24 HR URINE'},{ien: '24', name: 'ABSCESS'}]}]);
    });
});
