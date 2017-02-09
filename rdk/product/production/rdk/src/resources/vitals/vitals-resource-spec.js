/*jslint node: true*/
'use strict';

var RpcClient = require('vista-js').RpcClient;
var vitalsResource = require('./vitals-resource');

describe('Vitals Resource Test', function() {
    var req = {};
    var res = {};

    beforeEach(function() {
        req = {
            logger: {
                info: function(log) {
                    return log;
                },
                debug: function(debug) {
                    return debug;
                }
            },
            app: {
                config: {
                    rpcConfig: {
                        context: 'HMP UI CONTEXT',
                        siteHash: '9E7A'
                    },
                    vistaSites: {
                        '9E7A': {
                            name: 'PANORAMA',
                            division: '500',
                            host: 'IP_ADDRESS',
                            port: 9210,
                            production: false,
                            accessCode: 'PW',
                            verifyCode: 'PW'
                        },
                        'C877': {
                            name: 'KODAK',
                            division: '500',
                            host: 'IP_ADDRESS',
                            port: 9210,
                            production: false,
                            accessCode: 'PW',
                            verifyCode: 'PW'
                        }
                    }
                }
            },
            query: {},
            session: {
                user: {
                    site: '9E7A'
                }
            }
        };

        res = {
            send: function(message, error) {
                return;
            }
        };

        sinon.stub(RpcClient, 'callRpc');
    });

    it('tests the closest reading', function() {
        req.interceptorResults = {
            patientIdentifiers: {
                dfn: 3
            }
        };
        req.param = function(param) {
            if (param === 'type') {
                return 'BP';
            }
            return '';
        };

        vitalsResource.getClosestVital(req, res);
        expect(RpcClient.callRpc.called).to.be.true();
    });

    it('tests the all vitals', function() {
        req.interceptorResults = {
            patientIdentifiers: {
                dfn: 3
            }
        };
        req.param = function(param) {
            if (param === 'date.start') {
                return '20010101';
            }
            if (param === 'date.end') {
                return '20141001';
            }
            return '';
        };

        vitalsResource.getAllVitals(req, res);
        expect(RpcClient.callRpc.called).to.be.true();
    });

    it('expect getQualifierInformation to be called with no parameters', function() {
        req.query.types = undefined;

        vitalsResource.getQualifierInformation(req, res);
        expect(RpcClient.callRpc.calledWith(req.logger, sinon.match.object, 'GMV VITALS/CAT/QUAL', '', sinon.match.func)).to.be.true();
    });

    it('expect getQualifierInformation to be called with parameters', function() {
        req.query.types = 'WT,HT';

        vitalsResource.getQualifierInformation(req, res);
        expect(RpcClient.callRpc.calledWith(req.logger, sinon.match.object, 'GMV VITALS/CAT/QUAL', 'WT^HT', sinon.match.func));
    });

    it('expect getQualifierInformation to be called with parameters ending with comma', function() {
        req.query.types = 'WT,HT,';

        vitalsResource.getQualifierInformation(req, res);
        expect(RpcClient.callRpc.calledWith(req.logger, sinon.match.object, 'GMV VITALS/CAT/QUAL', 'WT^HT', sinon.match.func));
    });

    it('expect formatQualifierInformationOutput to return vital quailifer object given an RPC formatted blood pressure vital quailifer array', function() {
        var sourceMessage = 'V^1^BLOOD PRESSURE^BP^BP^210^110^100^60';
        var expectedObject = {
            items: [{
                type: 'BLOOD PRESSURE',
                fileIEN: '1',
                abbreviation: 'BP',
                pceAbbreviation: 'BP',
                abnormalSystolicHighValue: '210',
                abnormalDiastolicHighValue: '110',
                abnormalSystolicLowValue: '100',
                abnormalDiastolicLowValue: '60'
            }]
        };

        var actualObject = vitalsResource.formatQualifierInformationOutput(sourceMessage);
        expect(expectedObject).to.eql(actualObject);
    });

    it('expect formatQualifierInformationOutput to return vital quailifer object given an RPC formatted temperature vital quailifer array', function() {
        var sourceMessage = 'V^2^TEMPERATURE^TMP^TMP^210^110';
        var expectedObject = {
            items: [{
                type: 'TEMPERATURE',
                fileIEN: '2',
                abbreviation: 'TMP',
                pceAbbreviation: 'TMP',
                abnormalHighValue: '210',
                abnormalLowValue: '110'
            }]
        };

        var actualObject = vitalsResource.formatQualifierInformationOutput(sourceMessage);
        expect(expectedObject).to.eql(actualObject);
    });

    it('expect formatQualifierInformationOutput to return vital quailifer object given an RPC formatted central venous pressure vital quailifer array', function() {
        var sourceMessage = 'V^3^CENTRAL VENOUS PRESSURE^CVP^CVP^210^110^200';
        var expectedObject = {
            items: [{
                type: 'CENTRAL VENOUS PRESSURE',
                fileIEN: '3',
                abbreviation: 'CVP',
                pceAbbreviation: 'CVP',
                abnormalHighValue: '210',
                abnormalLowValue: '110',
                abnormalO2Saturation: '200'
            }]
        };

        var actualObject = vitalsResource.formatQualifierInformationOutput(sourceMessage);
        expect(expectedObject).to.eql(actualObject);
    });

    it('expect formatQualifierInformationOutput to return vital quailifer object given an RPC formatted vital quailifer array and category', function() {
        var sourceMessage = 'V^1^BLOOD PRESSURE^BP^BP^210^110^100^60\r\nC^10^LOCATION';
        var expectedObject = {
            items: [{
                type: 'BLOOD PRESSURE',
                fileIEN: '1',
                abbreviation: 'BP',
                pceAbbreviation: 'BP',
                abnormalSystolicHighValue: '210',
                abnormalDiastolicHighValue: '110',
                abnormalSystolicLowValue: '100',
                abnormalDiastolicLowValue: '60',
                categories: [{
                    fileIEN: '10',
                    name: 'LOCATION'
                }]
            }]
        };

        var actualObject = vitalsResource.formatQualifierInformationOutput(sourceMessage);
        expect(expectedObject).to.eql(actualObject);
    });

    it('expect formatQualifierInformationOutput to return vital quailifer object given an RPC formatted vital quailifer array, category, and qualifier', function() {
        var sourceMessage = 'V^1^BLOOD PRESSURE^BP^BP^210^110^100^60\r\nC^10^LOCATION\r\nQ^14^R ARM^RA';
        var expectedObject = {
            items: [{
                type: 'BLOOD PRESSURE',
                fileIEN: '1',
                abbreviation: 'BP',
                pceAbbreviation: 'BP',
                abnormalSystolicHighValue: '210',
                abnormalDiastolicHighValue: '110',
                abnormalSystolicLowValue: '100',
                abnormalDiastolicLowValue: '60',
                categories: [{
                    fileIEN: '10',
                    name: 'LOCATION',
                    qualifiers: [{
                        fileIEN: '14',
                        name: 'R ARM',
                        synonym: 'RA'
                    }]
                }]
            }]
        };

        var actualObject = vitalsResource.formatQualifierInformationOutput(sourceMessage);
        expect(expectedObject).to.eql(actualObject);
    });

    it('expect formatQualifierInformationOutput to return vital quailifer object given multiple RPC formatted vital quailifer array, category, and qualifier', function() {
        var sourceMessage = 'V^1^BLOOD PRESSURE^BP^BP^210^110^100^60\r\nC^10^LOCATION\r\nQ^14^R ARM^RA' +
            '\r\nQ^20^L ARM^LA\r\nC^2^METHOD\r\nQ^59^PALPATED^Pal\r\nQ^60^DOPPLER^Dop' +
            '\r\nV^9^WEIGHT^WT^WT^';
        var expectedObject = {
            items: [{
                type: 'BLOOD PRESSURE',
                fileIEN: '1',
                abbreviation: 'BP',
                pceAbbreviation: 'BP',
                abnormalSystolicHighValue: '210',
                abnormalDiastolicHighValue: '110',
                abnormalSystolicLowValue: '100',
                abnormalDiastolicLowValue: '60',
                categories: [{
                    fileIEN: '10',
                    name: 'LOCATION',
                    qualifiers: [{
                        fileIEN: '14',
                        name: 'R ARM',
                        synonym: 'RA'
                    }, {
                        fileIEN: '20',
                        name: 'L ARM',
                        synonym: 'LA'
                    }]
                }, {
                    fileIEN: '2',
                    name: 'METHOD',
                    qualifiers: [{
                        fileIEN: '59',
                        name: 'PALPATED',
                        synonym: 'Pal'
                    }, {
                        fileIEN: '60',
                        name: 'DOPPLER',
                        synonym: 'Dop'
                    }]
                }]
            }, {
                type: 'WEIGHT',
                fileIEN: '9',
                abbreviation: 'WT',
                pceAbbreviation: 'WT'
            }]
        };

        var actualObject = vitalsResource.formatQualifierInformationOutput(sourceMessage);
        expect(expectedObject).to.eql(actualObject);
    });

    it('expect formatQualifierInformationOutput to return vital quailifer object given multiple RPC formatted vital quailifer array and qualifiers', function() {
        var sourceMessage = 'V^1^BLOOD PRESSURE^BP^BP^210^110^100^60\r\nQ^14^R ARM^RA' +
            '\r\nQ^20^L ARM^LA\r\nQ^59^PALPATED^Pal\r\nQ^60^DOPPLER^Dop' +
            '\r\nV^9^WEIGHT^WT^WT^';
        var expectedObject = {
            items: [{
                type: 'BLOOD PRESSURE',
                fileIEN: '1',
                abbreviation: 'BP',
                pceAbbreviation: 'BP',
                abnormalSystolicHighValue: '210',
                abnormalDiastolicHighValue: '110',
                abnormalSystolicLowValue: '100',
                abnormalDiastolicLowValue: '60',
                categories: [{
                    qualifiers: [{
                        fileIEN: '14',
                        name: 'R ARM',
                        synonym: 'RA'
                    }, {
                        fileIEN: '20',
                        name: 'L ARM',
                        synonym: 'LA'
                    }, {
                        fileIEN: '59',
                        name: 'PALPATED',
                        synonym: 'Pal'
                    }, {
                        fileIEN: '60',
                        name: 'DOPPLER',
                        synonym: 'Dop'
                    }]
                }]
            }, {
                type: 'WEIGHT',
                fileIEN: '9',
                abbreviation: 'WT',
                pceAbbreviation: 'WT'
            }]
        };

        var actualObject = vitalsResource.formatQualifierInformationOutput(sourceMessage);
        expect(expectedObject).to.eql(actualObject);
    });
});
