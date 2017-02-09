'use strict';

var jdsUtils = require('./jds-sync-check-status');
var _ = require('lodash');

describe('JDS Utils Testing', function() {
    describe('Tesing getVistaSites', function(){
        it('Testing with undefined Status', function(){
            expect(jdsUtils.getVistaSites(undefinedStatus)).to.eql(expectedGetVistASitesRetObj.empty);
        });
        it('Testing with empty Status', function(){
            expect(jdsUtils.getVistaSites(emptySyncStatus)).to.eql(expectedGetVistASitesRetObj.empty);
        });
        it('Testing with sample Sync Status', function(){
            expect(jdsUtils.getVistaSites(sampleSyncStatus)).to.eql(expectedGetVistASitesRetObj.sample);
        });
        it('Testing with sample Sync Status + enterpriseSyncJob', function(){
            _.each(['9E7A','C877','DOD'], function(site){
                expect(jdsUtils._isSiteSynced(sampleSyncStatusWithEnterpriseSyncJob, site)).to.be.false();
            });
        });
    });
    describe('Tesing isSiteSynced', function(){
        it('Testing with undefined Status', function(){
            expect(jdsUtils._isSiteSynced(undefinedStatus)).to.equal(expectedIsSiteSyncedRetObj.empty);
        });
        it('Testing with empty Status', function(){
            expect(jdsUtils._isSiteSynced(emptySyncStatus)).to.equal(expectedIsSiteSyncedRetObj.empty);
        });
        it('Testing with sample Sync Status', function(){
            _.each(['9E7A','C877','DOD'], function(site){
                expect(jdsUtils._isSiteSynced(sampleSyncStatus, site)).to.equal(expectedIsSiteSyncedRetObj[site]);
            });
        });
    });
    describe('Tesing isSyncMarkedCompleted', function(){
        it('Testing with undefined Status', function(){
            expect(jdsUtils.isSyncMarkedCompleted(undefinedStatus)).to.be.false();
        });
        it('Testing with empty Status', function(){
            expect(jdsUtils.isSyncMarkedCompleted(emptySyncStatus)).to.be.false();
        });
        it('Testing with sample Sync Status', function(){
            _.each(syncMarkCompletedInputAndResult, function(element){
                expect(jdsUtils.isSyncMarkedCompleted(sampleSyncStatus, element.sites)).to.equal(element.result);
            });
        });
        it('Testing with sample Sync Status + enterpriseSyncJob', function(){
            _.each(['9E7A','C877','DOD','HDR'], function(site){
                expect(jdsUtils.isSyncMarkedCompleted(sampleSyncStatusWithEnterpriseSyncJob, site)).to.be.false();
            });
            expect(jdsUtils.isSyncMarkedCompleted(sampleSyncStatusWithEnterpriseSyncJob, ['9E7A','C877','DOD','HDR'])).to.be.false();
        });
    });
    describe('Tesing isSyncCompleted', function(){
        it('Testing with undefined Status', function(){
            expect(jdsUtils.isSyncCompleted(undefinedStatus)).to.be.false();
        });
        it('Testing with empty Status', function(){
            expect(jdsUtils.isSyncCompleted(emptySyncStatus)).to.be.false();
        });
        it('Testing with sample Sync Status', function(){
            _.each(syncCompletedInputAndResult, function(element){
                expect(jdsUtils.isSyncCompleted(element.input)).to.equal(element.result);
            });
        });
    });
    describe('Tesing hasSyncStatusErrorForSite', function(){
        it('Testing with undefined Status', function(){
            expect(jdsUtils._hasSyncStatusErrorForSite(undefinedStatus, 'DOD')).to.be.false();
        });
        it('Testing with empty Status', function(){
            expect(jdsUtils._hasSyncStatusErrorForSite(emptySyncStatus, 'DOD')).to.be.false();
        });
        it('Testing with sample Sync Status', function(){
            _.each(hasSyncErrorStatusAndResult, function(element){
                expect(jdsUtils._hasSyncStatusErrorForSite(element.input, element.site)).to.equal(element.result);
            });
        });
    });
    describe('Tesing getSiteSyncDataStatusSimple', function(){
        it('Testing with undefined Status', function(){
            expect(_.isEmpty(jdsUtils.getSiteSyncDataStatusSimple(undefinedStatus))).to.eql(true);
        });
        it('Testing with empty Status', function(){
            expect(_.isEmpty(jdsUtils.getSiteSyncDataStatusSimple(undefinedStatus))).to.eql(true);
        });
        it('Testing with sample Sync Status: syncCompleted', function(){
            var testSiteStatus = {
              latestJobTimestamp: 1464293174353,
              pid: '9E7A;3',
              sourceStampTime: 20160526160604,
              syncCompleted: true
            };
            var retStatus = jdsUtils.getSiteSyncDataStatusSimple(testSiteStatus);
            expect(retStatus.isSyncCompleted).to.eql(true);
            expect(retStatus.hasError).to.be.undefined();
            expect(retStatus.completedStamp).to.eql(testSiteStatus.sourceStampTime);
        });
        it('Testing with sample Sync Status: hasError', function(){
            var testSiteStatus = {
              hasError: true,
              latestJobTimestamp: 1464293174353,
              pid: '9E7A;3',
              sourceStampTime: 20160526160604,
              syncCompleted: false
            };
            var retStatus = jdsUtils.getSiteSyncDataStatusSimple(testSiteStatus);
            expect(retStatus.isSyncCompleted).to.eql(false);
            expect(retStatus.hasError).to.eql(true);
            expect(retStatus.completedStamp).to.be.undefined();
        });
        it('Testing with sample Sync Status: not completed', function(){
            var testSiteStatus = {
              latestJobTimestamp: 1464293174353,
              pid: '9E7A;3',
              sourceStampTime: 20160526160604,
              syncCompleted: false
            };
            var retStatus = jdsUtils.getSiteSyncDataStatusSimple(testSiteStatus);
            expect(retStatus.isSyncCompleted).to.eql(false);
            expect(retStatus.hasError).to.eql(false);
            expect(retStatus.completedStamp).to.be.undefined();
        });
    });
});

var expectedIsSiteSyncedRetObj = {
    'empty' : false,
    '9E7A' : false,
    'C877' : true,
    'DOD' : false
};

var syncMarkCompletedInputAndResult = [
    {
        'sites' : ['DOD'],
        'result' : false
    },
    {
        'sites' : ['C877'],
        'result' : true
    },
    {
        'sites' : ['9E7A','C877'],
        'result' : false
    },
    {
        'sites' : ['9E7A','C877','DOD'],
        'result' : false
    }
];

var syncCompletedInputAndResult = [
    {
        'input': {
            'data' : {
                'syncStatus': {}
            }
        },
        'result': false
    },
    {
        'input': {
            'data' : {
                'syncStatus': {
                    'inProgress': {

                    }
                }
            }
        },
        'result': false
    },
    {
        'input': {
            'data' : {
                'syncStatus': {
                    'completedStamp': {

                    },
                    'inProgress': {

                    }
                }
            }
        },
        'result': false
    },
    {
        'input': {
            'data' : {
                'syncStatus': {
                    'completedStamp': {

                    },
                    'inProgress': {

                    },
                },
                'jobStatus' : [
                ]
            }
        },
        'result': false
    },
    {
        'input': {
            'data' : {
                'syncStatus': {
                    'completedStamp': {

                    }
                },
                'jobStatus' : [
                    {
                        'jobId': 1,
                        'name': 'test'
                    }
                ]
            }
        },
        'result': false
    },
    {
        'input': {
            'data' : {
                'syncStatus': {
                    'completedStamp': {

                    }
                },
                'jobStatus' : [
                ]
            }
        },
        'result': true
    }
];

var hasSyncErrorStatusAndResult = [
    {
        site: 'DOD',
        input: {
            data: {
                jobStatus:[
                ]
            }
        },
        result: false
    },
    {
        site: 'DOD',
        input: {
            data: {
                jobStatus:[
                    {
                        'dataDomain': 'radiology',
                        'error': 'unable to sync',
                        'jobId': '30073',
                        'jpid': '1d745f7b-1ac3-4494-9519-aad07c09e0ed',
                        'patientIdentifier': {
                            'type': 'pid',
                            'value': 'DOD;0000000003'
                        },
                        'requestStampTime': '20150424014126',
                        'rootJobId': '30007',
                        'status': 'error',
                        'timestamp': '1429854086775',
                        'type': 'jmeadows-sync-radiology-request'
                    },
                    {
                        'dataDomain': 'vital',
                        'error': 'unable to sync',
                        'jobId': '30074',
                        'jpid': '1d745f7b-1ac3-4494-9519-aad07c09e0ed',
                        'patientIdentifier': {
                            'type': 'pid',
                            'value': 'DOD;0000000003'
                        },
                        'requestStampTime': '20150424014126',
                        'rootJobId': '30007',
                        'status': 'error',
                        'timestamp': '1429854086806',
                        'type': 'jmeadows-sync-vital-request'
                    },
                ]
            }
        },
        result: true
    },
    {
        site: 'HDR',
        input: {
            data: {
                jobStatus:[
                    {
                        'dataDomain': 'radiology',
                        'error': 'unable to sync',
                        'jobId': '30073',
                        'jpid': '1d745f7b-1ac3-4494-9519-aad07c09e0ed',
                        'patientIdentifier': {
                            'type': 'pid',
                            'value': 'HDR;0000000003'
                        },
                        'requestStampTime': '20150424014126',
                        'rootJobId': '30007',
                        'status': 'error',
                        'timestamp': '1429854086775',
                        'type': 'hdr-sync-radiology-request'
                    }
                ]
            }
        },
        result: true
    },

];

var undefinedStatus;
var emptySyncStatus = {
};

var sampleSyncStatus = {
    'data' : {
        'syncStatus': {
            'completedStamp': {
                'icn': '10108V420871',
                'sourceMetaStamp': {
                    '9E7A': {
                        'domainMetaStamp': {
                            'allergy': {
                                'domain': 'allergy',
                                'eventMetaStamp': {
                                    'urn:va:allergy:9E7A:3:751': {
                                        'stampTime': 20050317200936,
                                        'stored': true
                                    },
                                    'urn:va:allergy:9E7A:3:874': {
                                        'stampTime': 20071217151354,
                                        'stored': true
                                    }
                                },
                                'stampTime': 20150130170817,
                                'syncCompleted': true
                            }
                        },
                        'localId': 3,
                        'pid': '9E7A;3',
                        'stampTime': 20150130170817,
                        'syncCompleted': true
                    },
                    'C877': {
                        'domainMetaStamp': {
                            'allergy': {
                                'domain': 'allergy',
                                'eventMetaStamp': {
                                    'urn:va:allergy:C877:3:751': {
                                        'stampTime': 20050317200936,
                                        'stored': true
                                    },
                                    'urn:va:allergy:C877:3:874': {
                                        'stampTime': 20071217151354,
                                        'stored': true
                                    }
                                },
                                'stampTime': 20150130170817,
                                'syncCompleted': true
                            }
                        },
                        'localId': 3,
                        'pid': '9E7A;3',
                        'stampTime': 20150130170817,
                        'syncCompleted': true
                    }
                },
                'stampTime': 20150130170817
            },
            'inProgress': {
                'icn': '10108V420871',
                'sourceMetaStamp': {
                    'DOD': {
                        'domainMetaStamp': {
                            'allergy': {
                                'domain': 'allergy',
                                'eventMetaStamp': {
                                    'urn:va:allergy:DOD:0000000003:1000010340': {
                                        'stampTime': 20150130170811,
                                        'stored': true
                                    },
                                    'urn:va:allergy:DOD:0000000003:1000010341': {
                                        'stampTime': 20150130170811,
                                        'stored': true
                                    },
                                    'urn:va:allergy:DOD:0000000003:1000010342': {
                                        'stampTime': 20150130170811,
                                        'stored': true
                                    }
                                },
                                'stampTime': 20150130170811,
                                'syncCompleted': true
                            },
                            'consult': {
                                'domain': 'consult',
                                'eventMetaStamp': {
                                    'urn:va:consult:DOD:0000000003:1000000649': {
                                        'stampTime': 20150130170811
                                    },
                                    'urn:va:consult:DOD:0000000003:1000000650': {
                                        'stampTime': 20150130170811
                                    },
                                    'urn:va:consult:DOD:0000000003:1000010652': {
                                        'stampTime': 20150130170811
                                    }
                                },
                                'stampTime': 20150130170811
                            },
                        },
                        'localId': '0000000003',
                        'pid': 'DOD;0000000003',
                        'stampTime': 20150130170811
                    }
                },
                'stampTime': 20150130170811
            },
            'stampTime': 20150130220850
        },
        'jobStatus': [
            {
                'jobId': '2',
                'jpid': 'bd9ce7f7-81c8-49b8-b8f3-1ec4ac09e7d2',
                'patientIdentifier': {
                    'type': 'pid',
                    'value': '9E7A;3'
                },
                'rootJobId': '1',
                'status': 'completed',
                'timestamp': '1423257478447',
                'type': 'vista-9E7A-subscribe-request'
            },
            {
                'jobId': '3',
                'jpid': 'bd9ce7f7-81c8-49b8-b8f3-1ec4ac09e7d2',
                'patientIdentifier': {
                    'type': 'pid',
                    'value': 'DOD;0000000003'
                },
                'rootJobId': '1',
                'status': 'completed',
                'timestamp': '1423257478660',
                'type': 'jmeadows-sync-request'
            },
            {
                'dataDomain': 'allergy',
                'jobId': '4',
                'jpid': 'bd9ce7f7-81c8-49b8-b8f3-1ec4ac09e7d2',
                'patientIdentifier': {
                    'type': 'pid',
                    'value': 'DOD;0000000003'
                },
                'requestStampTime': '20150206161758',
                'rootJobId': '1',
                'status': 'completed',
                'timestamp': '1423257480377',
                'type': 'jmeadows-sync-allergy-request'
            },
            {
                'dataDomain': 'allergy',
                'jobId': '5',
                'jpid': 'bd9ce7f7-81c8-49b8-b8f3-1ec4ac09e7d2',
                'patientIdentifier': {
                    'type': 'pid',
                    'value': 'HDR;0000000003'
                },
                'requestStampTime': '20150206161758',
                'rootJobId': '1',
                'status': 'created',
                'timestamp': '1423257480377',
                'type': 'hdr-sync-allergy-request'
            }
        ]
    }
};

var sampleSyncStatusWithEnterpriseSyncJob  = {
    'data' : {
        'syncStatus': {
            'completedStamp': {
                'icn': '10108V420871',
                'sourceMetaStamp': {
                    '9E7A': {
                        'domainMetaStamp': {
                            'allergy': {
                                'domain': 'allergy',
                                'eventMetaStamp': {
                                    'urn:va:allergy:9E7A:3:751': {
                                        'stampTime': 20050317200936,
                                        'stored': true
                                    },
                                    'urn:va:allergy:9E7A:3:874': {
                                        'stampTime': 20071217151354,
                                        'stored': true
                                    }
                                },
                                'stampTime': 20150130170817,
                                'syncCompleted': true
                            }
                        },
                        'localId': 3,
                        'pid': '9E7A;3',
                        'stampTime': 20150130170817,
                        'syncCompleted': true
                    },
                    'C877': {
                        'domainMetaStamp': {
                            'allergy': {
                                'domain': 'allergy',
                                'eventMetaStamp': {
                                    'urn:va:allergy:C877:3:751': {
                                        'stampTime': 20050317200936,
                                        'stored': true
                                    },
                                    'urn:va:allergy:C877:3:874': {
                                        'stampTime': 20071217151354,
                                        'stored': true
                                    }
                                },
                                'stampTime': 20150130170817,
                                'syncCompleted': true
                            }
                        },
                        'localId': 3,
                        'pid': '9E7A;3',
                        'stampTime': 20150130170817,
                        'syncCompleted': true
                    }
                },
                'stampTime': 20150130170817
            },
            'inProgress': {
                'icn': '10108V420871',
                'sourceMetaStamp': {
                    'DOD': {
                        'domainMetaStamp': {
                            'allergy': {
                                'domain': 'allergy',
                                'eventMetaStamp': {
                                    'urn:va:allergy:DOD:0000000003:1000010340': {
                                        'stampTime': 20150130170811,
                                        'stored': true
                                    },
                                    'urn:va:allergy:DOD:0000000003:1000010341': {
                                        'stampTime': 20150130170811,
                                        'stored': true
                                    },
                                    'urn:va:allergy:DOD:0000000003:1000010342': {
                                        'stampTime': 20150130170811,
                                        'stored': true
                                    }
                                },
                                'stampTime': 20150130170811,
                                'syncCompleted': true
                            },
                            'consult': {
                                'domain': 'consult',
                                'eventMetaStamp': {
                                    'urn:va:consult:DOD:0000000003:1000000649': {
                                        'stampTime': 20150130170811
                                    },
                                    'urn:va:consult:DOD:0000000003:1000000650': {
                                        'stampTime': 20150130170811
                                    },
                                    'urn:va:consult:DOD:0000000003:1000010652': {
                                        'stampTime': 20150130170811
                                    }
                                },
                                'stampTime': 20150130170811
                            },
                        },
                        'localId': '0000000003',
                        'pid': 'DOD;0000000003',
                        'stampTime': 20150130170811
                    }
                },
                'stampTime': 20150130170811
            },
            'stampTime': 20150130220850
        },
        'jobStatus': [
            {
                'jobId': '1',
                'jpid': 'bd9ce7f7-81c8-49b8-b8f3-1ec4ac09e7d2',
                'patientIdentifier': {
                    'type': 'icn',
                    'value': '10108V420871'
                },
                'rootJobId': '1',
                'status': 'started',
                'timestamp': '1423257475375',
                'type': 'enterprise-sync-request'
            },
            {
                'jobId': '2',
                'jpid': 'bd9ce7f7-81c8-49b8-b8f3-1ec4ac09e7d2',
                'patientIdentifier': {
                    'type': 'pid',
                    'value': '9E7A;3'
                },
                'rootJobId': '1',
                'status': 'started',
                'timestamp': '1423257478447',
                'type': 'vista-9E7A-subscribe-request'
            },
            {
                'jobId': '3',
                'jpid': 'bd9ce7f7-81c8-49b8-b8f3-1ec4ac09e7d2',
                'patientIdentifier': {
                    'type': 'pid',
                    'value': 'DOD;0000000003'
                },
                'rootJobId': '1',
                'status': 'created',
                'timestamp': '1423257478660',
                'type': 'jmeadows-sync-request'
            },
            {
                'dataDomain': 'allergy',
                'jobId': '4',
                'jpid': 'bd9ce7f7-81c8-49b8-b8f3-1ec4ac09e7d2',
                'patientIdentifier': {
                    'type': 'pid',
                    'value': 'DOD;0000000003'
                },
                'requestStampTime': '20150206161758',
                'rootJobId': '1',
                'status': 'completed',
                'timestamp': '1423257480377',
                'type': 'jmeadows-sync-allergy-request'
            },
            {
                'dataDomain': 'allergy',
                'jobId': '5',
                'jpid': 'bd9ce7f7-81c8-49b8-b8f3-1ec4ac09e7d2',
                'patientIdentifier': {
                    'type': 'pid',
                    'value': 'HDR;0000000003'
                },
                'requestStampTime': '20150206161758',
                'rootJobId': '1',
                'status': 'created',
                'timestamp': '1423257480377',
                'type': 'hdr-sync-allergy-request'
            }
        ]
    }
};


var expectedGetVistASitesRetObj = {
    'empty' : [],
    'sample': ['9E7A','C877','DOD','HDR']
};
