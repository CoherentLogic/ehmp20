VPRJTPSTATUS ;KRM/CJE -- Unit Tests for business logic based sync status endpoints
 ;
STARTUP  ; Run once before all tests
 K ^VPRSTATUS
 K ^VPRJOB
 K ^VPRPTJ("JPID")
 K ^VPRMETA("JPID")
 D PATIDS
 Q
SHUTDOWN ; Run once after all tests
 K ^VPRSTATUS
 K ^VPRJOB
 K ^VPRPTJ("JPID")
 K ^VPRMETA("JPID")
 Q
SETUP    ; Run before each test
 K HTTPREQ,HTTPERR,HTTPRSP
 K ^VPRJOB,^VPRSTATUS
 Q
TEARDOWN ; Run after each test
 K HTTPREQ,HTTPERR,HTTPRSP
 K ^VPRJOB
 Q
ASSERT(EXPECT,ACTUAL,MSG) ; for convenience
 D EQ^VPRJT(EXPECT,ACTUAL,$G(MSG))
 Q
 ;
BASIC(SITE,ID,STAMPTIME) ; basic sync status
 I $G(STAMPTIME)="" S STAMPTIME=20141031094920
 S ^VPRSTATUS("52833885-af7c-4899-90be-b3a6630b2369",SITE_";"_ID,SITE,"stampTime")=STAMPTIME
 S ^VPRSTATUS("52833885-af7c-4899-90be-b3a6630b2369",SITE_";"_ID,SITE,"allergy",STAMPTIME)=""
 S ^VPRSTATUS("52833885-af7c-4899-90be-b3a6630b2369",SITE_";"_ID,SITE,"allergy","urn:va:allergy:"_SITE_":"_ID_":1001",STAMPTIME)=""
 S ^VPRSTATUS("52833885-af7c-4899-90be-b3a6630b2369",SITE_";"_ID,SITE,"allergy","urn:va:allergy:"_SITE_":"_ID_":1002",STAMPTIME)=""
 S ^VPRSTATUS("52833885-af7c-4899-90be-b3a6630b2369",SITE_";"_ID,SITE,"vitals",STAMPTIME)=""
 S ^VPRSTATUS("52833885-af7c-4899-90be-b3a6630b2369",SITE_";"_ID,SITE,"vitals","urn:va:vitals:"_SITE_":"_ID_":1001",STAMPTIME)=""
 S ^VPRSTATUS("52833885-af7c-4899-90be-b3a6630b2369",SITE_";"_ID,SITE,"vitals","urn:va:vitals:"_SITE_":"_ID_":1002",STAMPTIME)=""
 Q
 ;
COMPLETEBASIC(SITE,ID,STAMPTIME)
 I $G(STAMPTIME)="" S STAMPTIME=20141031094920
 S ^VPRSTATUS("52833885-af7c-4899-90be-b3a6630b2369",SITE_";"_ID,SITE,"vitals","urn:va:vitals:"_SITE_":"_ID_":1001",STAMPTIME,"stored")=1
 S ^VPRSTATUS("52833885-af7c-4899-90be-b3a6630b2369",SITE_";"_ID,SITE,"vitals","urn:va:vitals:"_SITE_":"_ID_":1002",STAMPTIME,"stored")=1
 S ^VPRSTATUS("52833885-af7c-4899-90be-b3a6630b2369",SITE_";"_ID,SITE,"allergy","urn:va:allergy:"_SITE_":"_ID_":1001",STAMPTIME,"stored")=1
 S ^VPRSTATUS("52833885-af7c-4899-90be-b3a6630b2369",SITE_";"_ID,SITE,"allergy","urn:va:allergy:"_SITE_":"_ID_":1002",STAMPTIME,"stored")=1
 Q
 ;
PATIDS ; Setup patient identifiers
 S ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2369")=""
 S ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2369","9E7A;3")=""
 S ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2369","C877;3")=""
 S ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2369","1234V4321")=""
 S ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2369","DOD;12345678")=""
 S ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2369","HDR;1234V4321")=""
 S ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2369","VLER;1234V4321")=""
 S ^VPRPTJ("JPID","9E7A;3")="52833885-af7c-4899-90be-b3a6630b2369"
 S ^VPRPTJ("JPID","C877;3")="52833885-af7c-4899-90be-b3a6630b2369"
 S ^VPRPTJ("JPID","1234V4321")="52833885-af7c-4899-90be-b3a6630b2369"
 S ^VPRPTJ("JPID","DOD;12345678")="52833885-af7c-4899-90be-b3a6630b2369"
 S ^VPRPTJ("JPID","HDR;1234V4321")="52833885-af7c-4899-90be-b3a6630b2369"
 S ^VPRPTJ("JPID","VLER;1234V4321")="52833885-af7c-4899-90be-b3a6630b2369"
 Q
 ;
JOB(PIDVALUE,ROOTJOBID,STATUS,TIMESTAMP,TYPE) ; Build Job history for business logic
 N JOB,JSON,ERR,ARGS
 S JOB("jobId")=$S($G(TYPE)="enterprise-sync-request":ROOTJOBID,1:$$UUID^VPRJRUT)
 S JOB("jpid")="52833885-af7c-4899-90be-b3a6630b2369"
 S JOB("patientIdentifier","type")="pid"
 S JOB("patientIdentifier","value")=PIDVALUE
 S JOB("rootJobId")=ROOTJOBID
 S JOB("status")=STATUS
 S JOB("timestamp")=TIMESTAMP
 S JOB("type")=TYPE
 D ENCODE^VPRJSON("JOB","JSON","ERR")
 D SET^VPRJOB(.ARGS,.JSON)
 Q
 ;
 ; Tests
 ;
GETBEFORE ;; @TEST Get Patient Sync Status before metastamp stored
 N DATA,ARG,ERR,OBJECT,HTTPERR
 S ARG("icnpidjpid")="9E7A;3"
 D COMBINED^VPRJPSTATUS(.DATA,.ARG)
 I $D(DATA) D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ;
 ; Ensure that the JSON matches what we expect
 D ASSERT("1234V4321",$G(OBJECT("icn")),"icn attribute should exist")
 D ASSERT("false",$G(OBJECT("syncCompleted")),"Sync shouldn't be complete")
 ;
 ; Try again with an event stored, but no meta-stamp is stored
 S ^VPRSTATUS("9E7A;3","9E7A","vitals","urn:va:vitals:9E7A:3:1002",20141031094920,"stored")=1
 D COMBINED^VPRJPSTATUS(.DATA,.ARG)
 I $D(DATA) D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ; Ensure that the JSON matches what we expect
 ; this Sync Status should always be in progress
 D ASSERT("1234V4321",$G(OBJECT("icn")),"icn attribute should exist")
 D ASSERT("false",$G(OBJECT("syncCompleted")),"Sync shouldn't be complete")
 I $D(DATA) K @DATA
 Q
GETSINGLEINPROGRESS ;; @TEST Get Single Site in-progress Patient Sync Status - no jobs
 N DATA,ARG,ERR,OBJECT,HTTPERR
 D BASIC("9E7A",3)
 S ARG("icnpidjpid")="9E7A;3"
 D COMBINED^VPRJPSTATUS(.DATA,.ARG)
 I $D(DATA) D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ;
 ; Ensure that the JSON matches what we expect
 D ASSERT("1234V4321",$G(OBJECT("icn")),"icn attribute should exist")
 D ASSERT("false",$G(OBJECT("syncCompleted")),"Sync shouldn't be complete")
 D ASSERT("9E7A;3",$G(OBJECT("sites","9E7A","pid")),"Site-pid 9E7A should exist")
 D ASSERT("false",$G(OBJECT("sites","9E7A","syncCompleted")),"Site-Sync 9E7A shouldn't be complete")
 I $D(DATA) K @DATA
 Q
GETSINGLECOMPLETE ;; @TEST Get Single Site complete Patient Sync Status - no jobs
 N DATA,ARG,ERR,OBJECT,HTTPERR
 D BASIC("9E7A",3)
 D COMPLETEBASIC("9E7A",3)
 ;
 S ARG("icnpidjpid")="9E7A;3"
 D COMBINED^VPRJPSTATUS(.DATA,.ARG)
 I $D(DATA) D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ;
 ; Ensure that the JSON matches what we expect
 D ASSERT("1234V4321",$G(OBJECT("icn")),"icn attribute should exist")
 D ASSERT("false",$G(OBJECT("syncCompleted")),"Sync shouldn't be complete")
 D ASSERT("9E7A;3",$G(OBJECT("sites","9E7A","pid")),"Site-pid 9E7A should exist")
 D ASSERT("false",$G(OBJECT("sites","9E7A","syncCompleted")),"Site-Sync 9E7A should be complete")
 I $D(DATA) K @DATA
 Q
GETSINGLEESRERR ;; @TEST Get Single Site complete Patient Sync Status - enterprise-sync-request in error
 N DATA,ARG,ERR,OBJECT,HTTPERR,ROOTJOBID
 D BASIC("9E7A",3)
 D COMPLETEBASIC("9E7A",3)
 ;
 ; Create enterprise-sync-request error job
 S ROOTJOBID=$$UUID^VPRJRUT
 D JOB("9E7A;3",ROOTJOBID,"error",20160420110400,"enterprise-sync-request")
 ;
 S ARG("icnpidjpid")="9E7A;3"
 D COMBINED^VPRJPSTATUS(.DATA,.ARG)
 I $D(DATA) D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ;
 ; Ensure that the JSON matches what we expect
 D ASSERT("1234V4321",$G(OBJECT("icn")),"icn attribute should exist")
 D ASSERT("true",$G(OBJECT("hasError")),"hasError attribute should exist")
 D ASSERT("false",$G(OBJECT("syncCompleted")),"Sync shouldn't be complete")
 D ASSERT("9E7A;3",$G(OBJECT("sites","9E7A","pid")),"Site-pid 9E7A should exist")
 D ASSERT("true",$G(OBJECT("sites","9E7A","hasError")),"Site-hasError 9E7A should exist")
 D ASSERT("false",$G(OBJECT("sites","9E7A","syncCompleted")),"Site-Sync 9E7A shouldn't be complete")
 I $D(DATA) K @DATA
 Q
GETSINGLEVSR ;; @TEST Get Single Site complete Patient Sync Status - vista-9E7A-subscribe-request created
 N DATA,ARG,ERR,OBJECT,HTTPERR,ROOTJOBID
 D BASIC("9E7A",3)
 D COMPLETEBASIC("9E7A",3)
 ;
 ; Create enterprise-sync-request error job
 S ROOTJOBID=$$UUID^VPRJRUT
 D JOB("9E7A;3",ROOTJOBID,"created",20160420110400,"vista-9E7A-subscribe-request")
 ;
 S ARG("icnpidjpid")="9E7A;3"
 D COMBINED^VPRJPSTATUS(.DATA,.ARG)
 I $D(DATA) D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ;
 ; Ensure that the JSON matches what we expect
 D ASSERT("1234V4321",$G(OBJECT("icn")),"icn attribute should exist")
 D ASSERT("false",$G(OBJECT("syncCompleted")),"Sync shouldn't be complete")
 D ASSERT("9E7A;3",$G(OBJECT("sites","9E7A","pid")),"Site-pid 9E7A should exist")
 D ASSERT("false",$G(OBJECT("sites","9E7A","syncCompleted")),"Site-Sync 9E7A shouldn't be complete")
 I $D(DATA) K @DATA
 Q
GETSINGLEVDP ;; @TEST Get Single Site complete Patient Sync Status - vista-9E7A-data-allergy-poller created
 N DATA,ARG,ERR,OBJECT,HTTPERR,ROOTJOBID
 D BASIC("9E7A",3)
 D COMPLETEBASIC("9E7A",3)
 ;
 ; Create enterprise-sync-request error job
 S ROOTJOBID=$$UUID^VPRJRUT
 D JOB("9E7A;3",ROOTJOBID,"created",20160420110400,"vista-9E7A-data-allergy-poller")
 ;
 S ARG("icnpidjpid")="9E7A;3"
 D COMBINED^VPRJPSTATUS(.DATA,.ARG)
 I $D(DATA) D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ;
 ; Ensure that the JSON matches what we expect
 D ASSERT("1234V4321",$G(OBJECT("icn")),"icn attribute should exist")
 D ASSERT("false",$G(OBJECT("syncCompleted")),"Sync shouldn't be complete")
 D ASSERT("9E7A;3",$G(OBJECT("sites","9E7A","pid")),"Site-pid 9E7A should exist")
 D ASSERT("false",$G(OBJECT("sites","9E7A","syncCompleted")),"Site-Sync 9E7A shouldn't be complete")
 I $D(DATA) K @DATA
 Q
GETSINGLEVHSR ;; @TEST Get Single Site complete Patient Sync Status - vistahdr-C877-subscribe-request created
 N DATA,ARG,ERR,OBJECT,HTTPERR,ROOTJOBID
 D BASIC("9E7A",3)
 D COMPLETEBASIC("9E7A",3)
 ;
 ; Create enterprise-sync-request error job
 S ROOTJOBID=$$UUID^VPRJRUT
 D JOB("C877;3",ROOTJOBID,"created",20160420110400,"vistahdr-C877-subscribe-request")
 ;
 S ARG("icnpidjpid")="9E7A;3"
 D COMBINED^VPRJPSTATUS(.DATA,.ARG)
 I $D(DATA) D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ;
 ; Ensure that the JSON matches what we expect
 D ASSERT("1234V4321",$G(OBJECT("icn")),"icn attribute should exist")
 D ASSERT("false",$G(OBJECT("syncCompleted")),"Sync shouldn't be complete")
 D ASSERT("9E7A;3",$G(OBJECT("sites","9E7A","pid")),"Site-pid 9E7A should exist")
 D ASSERT("false",$G(OBJECT("sites","9E7A","syncCompleted")),"Site-Sync 9E7A shouldn't be complete")
 D ASSERT("C877;3",$G(OBJECT("sites","C877","pid")),"Site-pid should exist")
 D ASSERT("false",$G(OBJECT("sites","C877","syncCompleted")),"Site-Sync C877 shouldn't be complete")
 I $D(DATA) K @DATA
 Q
GETSINGLEVHDP ;; @TEST Get Single Site complete Patient Sync Status - vistahdr-C877-data-allergy-poller created
 N DATA,ARG,ERR,OBJECT,HTTPERR,ROOTJOBID
 D BASIC("9E7A",3)
 D COMPLETEBASIC("9E7A",3)
 ;
 ; Create enterprise-sync-request error job
 S ROOTJOBID=$$UUID^VPRJRUT
 D JOB("C877;3",ROOTJOBID,"created",20160420110400,"vistahdr-C877-data-allergy-poller")
 ;
 S ARG("icnpidjpid")="9E7A;3"
 D COMBINED^VPRJPSTATUS(.DATA,.ARG)
 I $D(DATA) D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ;
 ; Ensure that the JSON matches what we expect
 D ASSERT("1234V4321",$G(OBJECT("icn")),"icn attribute should exist")
 D ASSERT("false",$G(OBJECT("syncCompleted")),"Sync shouldn't be complete")
 D ASSERT("9E7A;3",$G(OBJECT("sites","9E7A","pid")),"Site-pid 9E7A should exist")
 D ASSERT("false",$G(OBJECT("sites","9E7A","syncCompleted")),"Site-Sync 9E7A should be complete")
 D ASSERT("C877;3",$G(OBJECT("sites","C877","pid")),"Site-pid C877 should exist")
 D ASSERT("false",$G(OBJECT("sites","C877","syncCompleted")),"Site-Sync C877 shouldn't be complete")
 I $D(DATA) K @DATA
 Q
GETSINGLEHSR ;; @TEST Get Single Site complete Patient Sync Status - hdr-subscribe-request created
 N DATA,ARG,ERR,OBJECT,HTTPERR,ROOTJOBID
 D BASIC("9E7A",3)
 D COMPLETEBASIC("9E7A",3)
 ;
 ; Create enterprise-sync-request error job
 S ROOTJOBID=$$UUID^VPRJRUT
 D JOB("HDR;1234V4321",ROOTJOBID,"created",20160420110400,"hdr-subscribe-request")
 ;
 S ARG("icnpidjpid")="9E7A;3"
 D COMBINED^VPRJPSTATUS(.DATA,.ARG)
 I $D(DATA) D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ;
 ; Ensure that the JSON matches what we expect
 D ASSERT("1234V4321",$G(OBJECT("icn")),"icn attribute should exist")
 D ASSERT("false",$G(OBJECT("syncCompleted")),"Sync shouldn't be complete")
 D ASSERT("9E7A;3",$G(OBJECT("sites","9E7A","pid")),"Site-pid 9E7A should exist")
 D ASSERT("false",$G(OBJECT("sites","9E7A","syncCompleted")),"Site-Sync 9E7A should be complete")
 D ASSERT("HDR;1234V4321",$G(OBJECT("sites","HDR","pid")),"Site-pid HDR should exist")
 D ASSERT("false",$G(OBJECT("sites","HDR","syncCompleted")),"Site-Sync HDR shouldn't be complete")
 I $D(DATA) K @DATA
 Q
GETSINGLEHS ;; @TEST Get Single Site complete Patient Sync Status - hdr-sync-allergy-request created
 N DATA,ARG,ERR,OBJECT,HTTPERR,ROOTJOBID
 D BASIC("9E7A",3)
 D COMPLETEBASIC("9E7A",3)
 ;
 ; Create enterprise-sync-request error job
 S ROOTJOBID=$$UUID^VPRJRUT
 D JOB("HDR;1234V4321",ROOTJOBID,"created",20160420110400,"hdr-sync-allergy-request")
 ;
 S ARG("icnpidjpid")="9E7A;3"
 D COMBINED^VPRJPSTATUS(.DATA,.ARG)
 I $D(DATA) D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ;
 ; Ensure that the JSON matches what we expect
 D ASSERT("1234V4321",$G(OBJECT("icn")),"icn attribute should exist")
 D ASSERT("false",$G(OBJECT("syncCompleted")),"Sync shouldn't be complete")
 D ASSERT("9E7A;3",$G(OBJECT("sites","9E7A","pid")),"Site-pid 9E7A should exist")
 D ASSERT("false",$G(OBJECT("sites","9E7A","syncCompleted")),"Site-Sync 9E7A should be complete")
 D ASSERT("HDR;1234V4321",$G(OBJECT("sites","HDR","pid")),"Site-pid HDR should exist")
 D ASSERT("false",$G(OBJECT("sites","HDR","syncCompleted")),"Site-Sync HDR shouldn't be complete")
 I $D(DATA) K @DATA
 Q
GETSINGLEHX ;; @TEST Get Single Site complete Patient Sync Status - hdr-xform-allergy-request created
 N DATA,ARG,ERR,OBJECT,HTTPERR,ROOTJOBID
 D BASIC("9E7A",3)
 D COMPLETEBASIC("9E7A",3)
 ;
 ; Create enterprise-sync-request error job
 S ROOTJOBID=$$UUID^VPRJRUT
 D JOB("HDR;1234V4321",ROOTJOBID,"created",20160420110400,"hdr-xform-allergy-request")
 ;
 S ARG("icnpidjpid")="9E7A;3"
 D COMBINED^VPRJPSTATUS(.DATA,.ARG)
 I $D(DATA) D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ;
 ; Ensure that the JSON matches what we expect
 D ASSERT("1234V4321",$G(OBJECT("icn")),"icn attribute should exist")
 D ASSERT("false",$G(OBJECT("syncCompleted")),"Sync shouldn't be complete")
 D ASSERT("9E7A;3",$G(OBJECT("sites","9E7A","pid")),"Site-pid 9E7A should exist")
 D ASSERT("false",$G(OBJECT("sites","9E7A","syncCompleted")),"Site-Sync 9E7A should be complete")
 D ASSERT("HDR;1234V4321",$G(OBJECT("sites","HDR","pid")),"Site-pid HDR should exist")
 D ASSERT("false",$G(OBJECT("sites","HDR","syncCompleted")),"Site-Sync HDR shouldn't be complete")
 I $D(DATA) K @DATA
 Q
GETSINGLEJS ;; @TEST Get Single Site complete Patient Sync Status - jmeadows-sync-request created
 N DATA,ARG,ERR,OBJECT,HTTPERR,ROOTJOBID
 D BASIC("9E7A",3)
 D COMPLETEBASIC("9E7A",3)
 ;
 ; Create enterprise-sync-request error job
 S ROOTJOBID=$$UUID^VPRJRUT
 D JOB("DOD;12345678",ROOTJOBID,"created",20160420110400,"jmeadows-sync-request")
 ;
 S ARG("icnpidjpid")="9E7A;3"
 D COMBINED^VPRJPSTATUS(.DATA,.ARG)
 I $D(DATA) D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ;
 ; Ensure that the JSON matches what we expect
 D ASSERT("1234V4321",$G(OBJECT("icn")),"icn attribute should exist")
 D ASSERT("false",$G(OBJECT("syncCompleted")),"Sync shouldn't be complete")
 D ASSERT("9E7A;3",$G(OBJECT("sites","9E7A","pid")),"Site-pid 9E7A should exist")
 D ASSERT("false",$G(OBJECT("sites","9E7A","syncCompleted")),"Site-Sync 9E7A should be complete")
 D ASSERT("DOD;12345678",$G(OBJECT("sites","DOD","pid")),"Site-pid DOD should exist")
 D ASSERT("false",$G(OBJECT("sites","DOD","syncCompleted")),"Site-Sync DOD shouldn't be complete")
 I $D(DATA) K @DATA
 Q
GETSINGLEJDR ;; @TEST Get Single Site complete Patient Sync Status - jmeadows-document-retrieval created
 N DATA,ARG,ERR,OBJECT,HTTPERR,ROOTJOBID
 D BASIC("9E7A",3)
 D COMPLETEBASIC("9E7A",3)
 ;
 ; Create enterprise-sync-request error job
 S ROOTJOBID=$$UUID^VPRJRUT
 D JOB("DOD;12345678",ROOTJOBID,"created",20160420110400,"jmeadows-document-retrieval")
 ;
 S ARG("icnpidjpid")="9E7A;3"
 D COMBINED^VPRJPSTATUS(.DATA,.ARG)
 I $D(DATA) D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ;
 ; Ensure that the JSON matches what we expect
 D ASSERT("1234V4321",$G(OBJECT("icn")),"icn attribute should exist")
 D ASSERT("false",$G(OBJECT("syncCompleted")),"Sync shouldn't be complete")
 D ASSERT("9E7A;3",$G(OBJECT("sites","9E7A","pid")),"Site-pid 9E7A should exist")
 D ASSERT("false",$G(OBJECT("sites","9E7A","syncCompleted")),"Site-Sync 9E7A should be complete")
 D ASSERT("DOD;12345678",$G(OBJECT("sites","DOD","pid")),"Site-pid DOD should exist")
 D ASSERT("false",$G(OBJECT("sites","DOD","syncCompleted")),"Site-Sync DOD shouldn't be complete")
 I $D(DATA) K @DATA
 Q
GETSINGLEJPDT ;; @TEST Get Single Site complete Patient Sync Status - jmeadows-pdf-document-transform created
 N DATA,ARG,ERR,OBJECT,HTTPERR,ROOTJOBID
 D BASIC("9E7A",3)
 D COMPLETEBASIC("9E7A",3)
 ;
 ; Create enterprise-sync-request error job
 S ROOTJOBID=$$UUID^VPRJRUT
 D JOB("DOD;12345678",ROOTJOBID,"created",20160420110400,"jmeadows-pdf-document-transform")
 ;
 S ARG("icnpidjpid")="9E7A;3"
 D COMBINED^VPRJPSTATUS(.DATA,.ARG)
 I $D(DATA) D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ;
 ; Ensure that the JSON matches what we expect
 D ASSERT("1234V4321",$G(OBJECT("icn")),"icn attribute should exist")
 D ASSERT("false",$G(OBJECT("syncCompleted")),"Sync shouldn't be complete")
 D ASSERT("9E7A;3",$G(OBJECT("sites","9E7A","pid")),"Site-pid 9E7A should exist")
 D ASSERT("false",$G(OBJECT("sites","9E7A","syncCompleted")),"Site-Sync 9E7A should be complete")
 D ASSERT("DOD;12345678",$G(OBJECT("sites","DOD","pid")),"Site-pid DOD should exist")
 D ASSERT("false",$G(OBJECT("sites","DOD","syncCompleted")),"Site-Sync DOD shouldn't be complete")
 I $D(DATA) K @DATA
 Q
GETSINGLEJX ;; @TEST Get Single Site complete Patient Sync Status - jmeadows-xform-allergy-vpr created
 N DATA,ARG,ERR,OBJECT,HTTPERR,ROOTJOBID
 D BASIC("9E7A",3)
 D COMPLETEBASIC("9E7A",3)
 ;
 ; Create enterprise-sync-request error job
 S ROOTJOBID=$$UUID^VPRJRUT
 D JOB("DOD;12345678",ROOTJOBID,"created",20160420110400,"jmeadows-xform-allergy-vpr")
 ;
 S ARG("icnpidjpid")="9E7A;3"
 D COMBINED^VPRJPSTATUS(.DATA,.ARG)
 I $D(DATA) D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ;
 ; Ensure that the JSON matches what we expect
 D ASSERT("1234V4321",$G(OBJECT("icn")),"icn attribute should exist")
 D ASSERT("false",$G(OBJECT("syncCompleted")),"Sync shouldn't be complete")
 D ASSERT("9E7A;3",$G(OBJECT("sites","9E7A","pid")),"Site-pid 9E7A should exist")
 D ASSERT("false",$G(OBJECT("sites","9E7A","syncCompleted")),"Site-Sync 9E7A should be complete")
 D ASSERT("DOD;12345678",$G(OBJECT("sites","DOD","pid")),"Site-pid DOD should exist")
 D ASSERT("false",$G(OBJECT("sites","DOD","syncCompleted")),"Site-Sync DOD shouldn't be complete")
 I $D(DATA) K @DATA
 Q
GETSINGLEJCDC ;; @TEST Get Single Site complete Patient Sync Status - jmeadows-cda-document-conversion created
 N DATA,ARG,ERR,OBJECT,HTTPERR,ROOTJOBID
 D BASIC("9E7A",3)
 D COMPLETEBASIC("9E7A",3)
 ;
 ; Create jobs
 S ROOTJOBID=$$UUID^VPRJRUT
 D JOB("DOD;12345678",ROOTJOBID,"created",20160420110400,"jmeadows-cda-document-conversion")
 ;
 S ARG("icnpidjpid")="9E7A;3"
 D COMBINED^VPRJPSTATUS(.DATA,.ARG)
 I $D(DATA) D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ;
 ; Ensure that the JSON matches what we expect
 D ASSERT("1234V4321",$G(OBJECT("icn")),"icn attribute should exist")
 D ASSERT("false",$G(OBJECT("syncCompleted")),"Sync shouldn't be complete")
 D ASSERT("9E7A;3",$G(OBJECT("sites","9E7A","pid")),"Site-pid 9E7A should exist")
 D ASSERT("false",$G(OBJECT("sites","9E7A","syncCompleted")),"Site-Sync 9E7A should be complete")
 D ASSERT("DOD;12345678",$G(OBJECT("sites","DOD","pid")),"Site-pid DOD should exist")
 D ASSERT("false",$G(OBJECT("sites","DOD","syncCompleted")),"Site-Sync DOD shouldn't be complete")
 I $D(DATA) K @DATA
 Q
GETALLESR ;; @TEST Get ALL site complete Patient Sync Status - enterprise-sync-request created
 N DATA,ARG,ERR,OBJECT,HTTPERR,ROOTJOBID
 D BASIC("9E7A",3)
 D COMPLETEBASIC("9E7A",3)
 D BASIC("C877",3)
 D COMPLETEBASIC("C877",3)
 D BASIC("HDR","1234V4321")
 D COMPLETEBASIC("HDR","1234V4321")
 D BASIC("DOD",12345678)
 D COMPLETEBASIC("DOD",12345678)
 ;
 ; Create enterprise-sync-request error job
 S ROOTJOBID=$$UUID^VPRJRUT
 D JOB("9E7A;3",ROOTJOBID,"created",20160420110400,"enterprise-sync-request")
 ;
 S ARG("icnpidjpid")="9E7A;3"
 D COMBINED^VPRJPSTATUS(.DATA,.ARG)
 I $D(DATA) D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ;
 ; Ensure that the JSON matches what we expect
 D ASSERT("1234V4321",$G(OBJECT("icn")),"icn attribute should exist")
 D ASSERT("false",$G(OBJECT("syncCompleted")),"Sync shouldn't be complete")
 D ASSERT("9E7A;3",$G(OBJECT("sites","9E7A","pid")),"Site-pid 9E7A should exist")
 D ASSERT("false",$G(OBJECT("sites","9E7A","syncCompleted")),"Site-Sync 9E7A shouldn't be complete")
 D ASSERT("C877;3",$G(OBJECT("sites","C877","pid")),"Site-pid C877 should exist")
 D ASSERT("false",$G(OBJECT("sites","C877","syncCompleted")),"Site-Sync C877 shouldn't be complete")
 D ASSERT("HDR;1234V4321",$G(OBJECT("sites","HDR","pid")),"Site-pid HDR should exist")
 D ASSERT("false",$G(OBJECT("sites","HDR","syncCompleted")),"Site-Sync HDR shouldn't be complete")
 D ASSERT("DOD;12345678",$G(OBJECT("sites","DOD","pid")),"Site-pid DOD should exist")
 D ASSERT("false",$G(OBJECT("sites","DOD","syncCompleted")),"Site-Sync DOD shouldn't be complete")
 I $D(DATA) K @DATA
 Q
GETALLESRVHSR ;; @TEST Get ALL site complete Patient Sync Status - enterprise-sync-request,vistahdr-sync-request created
 N DATA,ARG,ERR,OBJECT,HTTPERR,ROOTJOBID
 D BASIC("9E7A",3)
 D COMPLETEBASIC("9E7A",3)
 D BASIC("C877",3)
 D COMPLETEBASIC("C877",3)
 D BASIC("HDR","1234V4321")
 D COMPLETEBASIC("HDR","1234V4321")
 D BASIC("DOD",12345678)
 D COMPLETEBASIC("DOD",12345678)
 ;
 ; Create enterprise-sync-request error job
 S ROOTJOBID=$$UUID^VPRJRUT
 ;D JOB("9E7A;3",ROOTJOBID,"created",20160420110400,"enterprise-sync-request")
 ;D JOB("C877;3",ROOTJOBID,"complete",20160420110400,"vistahdr-C877-subscribe-request")
 ;
 S ARG("icnpidjpid")="9E7A;3"
 D COMBINED^VPRJPSTATUS(.DATA,.ARG)
 I $D(DATA) D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ;
 ; Ensure that the JSON matches what we expect
 D ASSERT("1234V4321",$G(OBJECT("icn")),"icn attribute should exist")
 D ASSERT("false",$G(OBJECT("syncCompleted")),"Sync shouldn't be complete")
 D ASSERT("9E7A;3",$G(OBJECT("sites","9E7A","pid")),"Site-pid 9E7A should exist")
 D ASSERT("false",$G(OBJECT("sites","9E7A","syncCompleted")),"Site-Sync 9E7A shouldn't be complete")
 D ASSERT("C877;3",$G(OBJECT("sites","C877","pid")),"Site-pid C877 should exist")
 D ASSERT("false",$G(OBJECT("sites","C877","syncCompleted")),"Site-Sync C877 shouldn't be complete")
 D ASSERT("HDR;1234V4321",$G(OBJECT("sites","HDR","pid")),"Site-pid HDR should exist")
 D ASSERT("false",$G(OBJECT("sites","HDR","syncCompleted")),"Site-Sync HDR shouldn't be complete")
 D ASSERT("DOD;12345678",$G(OBJECT("sites","DOD","pid")),"Site-pid DOD should exist")
 D ASSERT("false",$G(OBJECT("sites","DOD","syncCompleted")),"Site-Sync DOD shouldn't be complete")
 I $D(DATA) K @DATA
 Q
GETSITESINPROGRESS ;; @TEST Get single site inProgress Patient Sync Status - site filter
 N DATA,ARG,ERR,OBJECT,HTTPERR,ROOTJOBID
 D BASIC("9E7A",3)
 D BASIC("C877",3)
 D BASIC("HDR","1234V4321")
 D BASIC("DOD",12345678)
 ;
 S ARG("icnpidjpid")="9E7A;3"
 S ARG("sites")="9E7A"
 D COMBINED^VPRJPSTATUS(.DATA,.ARG)
 I $D(DATA) D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ;
 ; Ensure that the JSON matches what we expect
 D ASSERT("1234V4321",$G(OBJECT("icn")),"icn attribute should exist")
 D ASSERT("",$G(OBJECT("syncCompleted")),"SyncCompleted shouldn't exist")
 D ASSERT("9E7A;3",$G(OBJECT("sites","9E7A","pid")),"Site-pid 9E7A should exist")
 D ASSERT("false",$G(OBJECT("sites","9E7A","syncCompleted")),"Site-Sync 9E7A should be complete")
 ; No other sites should show up
 D ASSERT("",$G(OBJECT("sites","C877","pid")),"Site-pid C877 shouldn't exist")
 D ASSERT("",$G(OBJECT("sites","C877","syncCompleted")),"Site-Sync C877 shouldn't be complete")
 D ASSERT("",$G(OBJECT("sites","HDR","pid")),"Site-pid HDR shouldn't exist")
 D ASSERT("",$G(OBJECT("sites","HDR","syncCompleted")),"Site-Sync HDR shouldn't be complete")
 D ASSERT("",$G(OBJECT("sites","DOD","pid")),"Site-pid DOD shouldn't exist")
 D ASSERT("",$G(OBJECT("sites","DOD","syncCompleted")),"Site-Sync DOD shouldn't be complete")
 I $D(DATA) K @DATA
 Q
GETSITESCOMPLETE ;; @TEST Get single site complete Patient Sync Status - site filter
 N DATA,ARG,ERR,OBJECT,HTTPERR,ROOTJOBID
 D BASIC("9E7A",3)
 D COMPLETEBASIC("9E7A",3)
 D BASIC("C877",3)
 D COMPLETEBASIC("C877",3)
 D BASIC("HDR","1234V4321")
 D COMPLETEBASIC("HDR","1234V4321")
 D BASIC("DOD",12345678)
 D COMPLETEBASIC("DOD",12345678)
 ;
 S ARG("icnpidjpid")="9E7A;3"
 S ARG("sites")="9E7A"
 D COMBINED^VPRJPSTATUS(.DATA,.ARG)
 I $D(DATA) D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ;
 ; Ensure that the JSON matches what we expect
 D ASSERT("1234V4321",$G(OBJECT("icn")),"icn attribute should exist")
 D ASSERT("",$G(OBJECT("syncCompleted")),"SyncCompleted shouldn't exist")
 D ASSERT("9E7A;3",$G(OBJECT("sites","9E7A","pid")),"Site-pid 9E7A should exist")
 D ASSERT("false",$G(OBJECT("sites","9E7A","syncCompleted")),"Site-Sync 9E7A shouldn't be complete")
 ; No other sites should show up
 D ASSERT("",$G(OBJECT("sites","C877","pid")),"Site-pid C877 shouldn't exist")
 D ASSERT("",$G(OBJECT("sites","C877","syncCompleted")),"Site-Sync C877 shouldn't be complete")
 D ASSERT("",$G(OBJECT("sites","HDR","pid")),"Site-pid HDR shouldn't exist")
 D ASSERT("",$G(OBJECT("sites","HDR","syncCompleted")),"Site-Sync HDR shouldn't be complete")
 D ASSERT("",$G(OBJECT("sites","DOD","pid")),"Site-pid DOD shouldn't exist")
 D ASSERT("",$G(OBJECT("sites","DOD","syncCompleted")),"Site-Sync DOD shouldn't be complete")
 I $D(DATA) K @DATA
 Q
GETSITESOPENJOB ;; @TEST Get single site complete Patient Sync Status - enterprise-sync-request
 N DATA,ARG,ERR,OBJECT,HTTPERR,ROOTJOBID
 D BASIC("9E7A",3)
 D COMPLETEBASIC("9E7A",3)
 D BASIC("C877",3)
 D COMPLETEBASIC("C877",3)
 D BASIC("HDR","1234V4321")
 D COMPLETEBASIC("HDR","1234V4321")
 D BASIC("DOD",12345678)
 D COMPLETEBASIC("DOD",12345678)
 ;
 ; Create enterprise-sync-request error job
 S ROOTJOBID=$$UUID^VPRJRUT
 D JOB("9E7A;3",ROOTJOBID,"created",20160420110400,"enterprise-sync-request")
 ;
 S ARG("icnpidjpid")="9E7A;3"
 S ARG("sites")="9E7A"
 D COMBINED^VPRJPSTATUS(.DATA,.ARG)
 I $D(DATA) D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ;
 ; Ensure that the JSON matches what we expect
 D ASSERT("1234V4321",$G(OBJECT("icn")),"icn attribute should exist")
 D ASSERT("",$G(OBJECT("syncCompleted")),"SyncCompleted shouldn't exist")
 D ASSERT("9E7A;3",$G(OBJECT("sites","9E7A","pid")),"Site-pid 9E7A should exist")
 D ASSERT("false",$G(OBJECT("sites","9E7A","syncCompleted")),"Site-Sync 9E7A shouldn't be complete")
 ; No other sites should show up
 D ASSERT("",$G(OBJECT("sites","C877","pid")),"Site-pid C877 shouldn't exist")
 D ASSERT("",$G(OBJECT("sites","C877","syncCompleted")),"Site-Sync C877 shouldn't be complete")
 D ASSERT("",$G(OBJECT("sites","HDR","pid")),"Site-pid HDR shouldn't exist")
 D ASSERT("",$G(OBJECT("sites","HDR","syncCompleted")),"Site-Sync HDR shouldn't be complete")
 D ASSERT("",$G(OBJECT("sites","DOD","pid")),"Site-pid DOD shouldn't exist")
 D ASSERT("",$G(OBJECT("sites","DOD","syncCompleted")),"Site-Sync DOD shouldn't be complete")
 I $D(DATA) K @DATA
 Q
GETMSITESINPROGRESS ;; @TEST Get multiple site inProgress Patient Sync Status - site filter
 N DATA,ARG,ERR,OBJECT,HTTPERR,ROOTJOBID
 D BASIC("9E7A",3)
 D BASIC("C877",3)
 D BASIC("HDR","1234V4321")
 D BASIC("DOD",12345678)
 ;
 S ARG("icnpidjpid")="9E7A;3"
 S ARG("sites")="9E7A,DOD"
 D COMBINED^VPRJPSTATUS(.DATA,.ARG)
 I $D(DATA) D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ;
 ; Ensure that the JSON matches what we expect
 D ASSERT("1234V4321",$G(OBJECT("icn")),"icn attribute should exist")
 D ASSERT("",$G(OBJECT("syncCompleted")),"SyncCompleted shouldn't exist")
 D ASSERT("9E7A;3",$G(OBJECT("sites","9E7A","pid")),"Site-pid 9E7A should exist")
 D ASSERT("false",$G(OBJECT("sites","9E7A","syncCompleted")),"Site-Sync 9E7A shouldn't be complete")
 D ASSERT("DOD;12345678",$G(OBJECT("sites","DOD","pid")),"Site-pid DOD should exist")
 D ASSERT("false",$G(OBJECT("sites","DOD","syncCompleted")),"Site-Sync DOD shouldn't be complete")
 ; No other sites should show up
 D ASSERT("",$G(OBJECT("sites","C877","pid")),"Site-pid C877 shouldn't exist")
 D ASSERT("",$G(OBJECT("sites","C877","syncCompleted")),"Site-Sync C877 shouldn't be complete")
 D ASSERT("",$G(OBJECT("sites","HDR","pid")),"Site-pid HDR shouldn't exist")
 D ASSERT("",$G(OBJECT("sites","HDR","syncCompleted")),"Site-Sync HDR shouldn't be complete")
 I $D(DATA) K @DATA
 Q
GETMSITESCOMPLETE ;; @TEST Get multiple site complete Patient Sync Status - site filter
 N DATA,ARG,ERR,OBJECT,HTTPERR,ROOTJOBID
 D BASIC("9E7A",3)
 D COMPLETEBASIC("9E7A",3)
 D BASIC("C877",3)
 D COMPLETEBASIC("C877",3)
 D BASIC("HDR","1234V4321")
 D COMPLETEBASIC("HDR","1234V4321")
 D BASIC("DOD",12345678)
 D COMPLETEBASIC("DOD",12345678)
 ;
 ; Create jobs
 S ROOTJOBID=$$UUID^VPRJRUT
 D JOB("9E7A;3",ROOTJOBID,"completed",20160420110400,"enterprise-sync-request")
 D JOB("9E7A;3",ROOTJOBID,"completed",20160420110400,"vista-9E7A-subscribe-request")
 D JOB("9E7A;3",ROOTJOBID,"completed",20160420110400,"vista-9E7A-data-allergy-poller")
 D JOB("C877;3",ROOTJOBID,"completed",20160420110400,"vistahdr-C877-subscribe-request")
 D JOB("C877;3",ROOTJOBID,"completed",20160420110400,"vistahdr-C877-data-allergy-poller")
 D JOB("HDR;1234V4321",ROOTJOBID,"completed",20160420110400,"hdr-sync-request")
 D JOB("HDR;1234V4321",ROOTJOBID,"completed",20160420110400,"hdr-sync-allergy-request")
 D JOB("HDR;1234V4321",ROOTJOBID,"completed",20160420110400,"hdr-xform-allergy-vpr")
 D JOB("DOD;12345678",ROOTJOBID,"completed",20160420110400,"jmeadows-sync-request")
 D JOB("DOD;12345678",ROOTJOBID,"completed",20160420110400,"jmeadows-sync-allergy-request")
 D JOB("DOD;12345678",ROOTJOBID,"completed",20160420110400,"jmeadows-document-retrieval")
 D JOB("DOD;12345678",ROOTJOBID,"completed",20160420110400,"jmeadows-pdf-document-transform")
 D JOB("DOD;12345678",ROOTJOBID,"completed",20160420110400,"jmeadows-xform-allergy-vpr")
 ;
 S ARG("icnpidjpid")="9E7A;3"
 S ARG("sites")="9E7A,HDR"
 D COMBINED^VPRJPSTATUS(.DATA,.ARG)
 I $D(DATA) D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ;
 ; Ensure that the JSON matches what we expect
 D ASSERT("1234V4321",$G(OBJECT("icn")),"icn attribute should exist")
 D ASSERT("",$G(OBJECT("syncCompleted")),"SyncCompleted shouldn't exist")
 D ASSERT("9E7A;3",$G(OBJECT("sites","9E7A","pid")),"Site-pid 9E7A should exist")
 D ASSERT("true",$G(OBJECT("sites","9E7A","syncCompleted")),"Site-Sync 9E7A should be complete")
 D ASSERT("HDR;1234V4321",$G(OBJECT("sites","HDR","pid")),"Site-pid HDR shouldn't exist")
 D ASSERT("true",$G(OBJECT("sites","HDR","syncCompleted")),"Site-Sync HDR should be complete")
 ; No other sites should show up
 D ASSERT("",$G(OBJECT("sites","C877","pid")),"Site-pid C877 shouldn't exist")
 D ASSERT("",$G(OBJECT("sites","C877","syncCompleted")),"Site-Sync C877 shouldn't be complete")
 D ASSERT("",$G(OBJECT("sites","DOD","pid")),"Site-pid DOD shouldn't exist")
 D ASSERT("",$G(OBJECT("sites","DOD","syncCompleted")),"Site-Sync DOD shouldn't be complete")
 I $D(DATA) K @DATA
 Q
GETMSITESOPENJOB ;; @TEST Get multiple site complete Patient Sync Status - enterprise-sync-request
 N DATA,ARG,ERR,OBJECT,HTTPERR,ROOTJOBID
 D BASIC("9E7A",3)
 D COMPLETEBASIC("9E7A",3)
 D BASIC("C877",3)
 D COMPLETEBASIC("C877",3)
 D BASIC("HDR","1234V4321")
 D COMPLETEBASIC("HDR","1234V4321")
 D BASIC("DOD",12345678)
 D COMPLETEBASIC("DOD",12345678)
 ;
 ; Create enterprise-sync-request error job
 S ROOTJOBID=$$UUID^VPRJRUT
 D JOB("9E7A;3",ROOTJOBID,"created",20160420110400,"enterprise-sync-request")
 ;
 S ARG("icnpidjpid")="9E7A;3"
 S ARG("sites")="9E7A,C877"
 D COMBINED^VPRJPSTATUS(.DATA,.ARG)
 I $D(DATA) D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ;
 ; Ensure that the JSON matches what we expect
 D ASSERT("1234V4321",$G(OBJECT("icn")),"icn attribute should exist")
 D ASSERT("",$G(OBJECT("syncCompleted")),"SyncCompleted shouldn't exist")
 D ASSERT("9E7A;3",$G(OBJECT("sites","9E7A","pid")),"Site-pid 9E7A should exist")
 D ASSERT("false",$G(OBJECT("sites","9E7A","syncCompleted")),"Site-Sync 9E7A shouldn't be complete")
 D ASSERT("C877;3",$G(OBJECT("sites","C877","pid")),"Site-pid C877 shouldn't exist")
 D ASSERT("false",$G(OBJECT("sites","C877","syncCompleted")),"Site-Sync C877 shouldn't be complete")
 ; No other sites should show up
 D ASSERT("",$G(OBJECT("sites","HDR","pid")),"Site-pid HDR shouldn't exist")
 D ASSERT("",$G(OBJECT("sites","HDR","syncCompleted")),"Site-Sync HDR shouldn't be complete")
 D ASSERT("",$G(OBJECT("sites","DOD","pid")),"Site-pid DOD shouldn't exist")
 D ASSERT("",$G(OBJECT("sites","DOD","syncCompleted")),"Site-Sync DOD shouldn't be complete")
 I $D(DATA) K @DATA
 Q
GETMSITESCOMPLETENHX ;; @TEST Get multiple site complete Patient Sync Status - REAL - NO hdr-xform, NO vler-xform, NO jmeadows-pdf, NO jmeadows-ccda, NO jmeadows-xform, NO jmeadows-document
 N DATA,ARG,ERR,OBJECT,HTTPERR,ROOTJOBID
 D BASIC("9E7A",3,20141031094920)
 D COMPLETEBASIC("9E7A",3,20141031094920)
 D BASIC("C877",3,20141031095020)
 D COMPLETEBASIC("C877",3,20141031095020)
 D BASIC("HDR","1234V4321",20151031094920)
 D COMPLETEBASIC("HDR","1234V4321",20151031094920)
 D BASIC("VLER","1234V4321",20131031094920)
 D COMPLETEBASIC("VLER","1234V4321",20131031094920)
 D BASIC("DOD",12345678,20161031094920)
 D COMPLETEBASIC("DOD",12345678,20161031094920)
 ;
 ; Create jobs
 S ROOTJOBID=$$UUID^VPRJRUT
 D JOB("9E7A;3",ROOTJOBID,"completed",20160420110400,"enterprise-sync-request")
 D JOB("9E7A;3",ROOTJOBID,"completed",20160420110500,"vista-9E7A-subscribe-request")
 D JOB("9E7A;3",ROOTJOBID,"completed",20160420110405,"vista-9E7A-data-allergy-poller")
 D JOB("C877;3",ROOTJOBID,"completed",20160420110700,"vistahdr-C877-subscribe-request")
 D JOB("C877;3",ROOTJOBID,"completed",20160420110800,"vistahdr-C877-data-allergy-poller")
 D JOB("HDR;1234V4321",ROOTJOBID,"completed",20160420110900,"hdr-sync-request")
 D JOB("HDR;1234V4321",ROOTJOBID,"completed",20160420111000,"hdr-sync-allergy-request")
 D JOB("VLER;1234V4321",ROOTJOBID,"completed",20160420110400,"vler-sync-request")
 D JOB("DOD;12345678",ROOTJOBID,"completed",20160420110430,"jmeadows-sync-request")
 D JOB("DOD;12345678",ROOTJOBID,"completed",20160420110500,"jmeadows-sync-allergy-request")
 ;
 S ARG("icnpidjpid")="9E7A;3"
 D COMBINED^VPRJPSTATUS(.DATA,.ARG)
 I $D(DATA) D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ;
 ; Ensure that the JSON matches what we expect
 D ASSERT("1234V4321",$G(OBJECT("icn")),"icn attribute should exist")
 D ASSERT("true",$G(OBJECT("syncCompleted")),"SyncCompleted should exist")
 D ASSERT("",$G(OBJECT("hasError")),"hasError should not exist")
 D ASSERT(20160420111000,$G(OBJECT("latestJobTimestamp")),"latestJobTimestamp should exist")
 D ASSERT(20161031094920,$G(OBJECT("latestSourceStampTime")),"latestSourceStampTime should exist")
 D ASSERT(20160420110400,$G(OBJECT("latestEnterpriseSyncRequestTimestamp")),"latestEnterpriseSyncRequestTimestamp should exist")
 ;
 D ASSERT("9E7A;3",$G(OBJECT("sites","9E7A","pid")),"Site-pid 9E7A should exist")
 D ASSERT("true",$G(OBJECT("sites","9E7A","syncCompleted")),"Site-Sync 9E7A should be complete")
 D ASSERT("",$G(OBJECT("sites","9E7A","hasError")),"Site-hasError 9E7A should not exist")
 D ASSERT(20141031094920,$G(OBJECT("sites","9E7A","sourceStampTime")),"Site-sourceStampTime 9E7A should exist")
 D ASSERT(20160420110500,$G(OBJECT("sites","9E7A","latestJobTimestamp")),"Site-latestJobTimestamp 9E7A should exist")
 ;
 D ASSERT("HDR;1234V4321",$G(OBJECT("sites","HDR","pid")),"Site-pid HDR should exist")
 D ASSERT("true",$G(OBJECT("sites","HDR","syncCompleted")),"Site-Sync HDR should be complete")
 D ASSERT("",$G(OBJECT("sites","HDR","hasError")),"Site-hasError HDR should not exist")
 D ASSERT(20151031094920,$G(OBJECT("sites","HDR","sourceStampTime")),"Site-sourceStampTime HDR should exist")
 D ASSERT(20160420111000,$G(OBJECT("sites","HDR","latestJobTimestamp")),"Site-latestJobTimestamp HDR should exist")
 ;
 D ASSERT("C877;3",$G(OBJECT("sites","C877","pid")),"Site-pid C877 should exist")
 D ASSERT("true",$G(OBJECT("sites","C877","syncCompleted")),"Site-Sync C877 should be complete")
 D ASSERT("",$G(OBJECT("sites","C877","hasError")),"Site-hasError C877 should not exist")
 D ASSERT(20141031095020,$G(OBJECT("sites","C877","sourceStampTime")),"Site-sourceStampTime C877 should exist")
 D ASSERT(20160420110800,$G(OBJECT("sites","C877","latestJobTimestamp")),"Site-latestJobTimestamp C877 should exist")
 ;
 D ASSERT("VLER;1234V4321",$G(OBJECT("sites","VLER","pid")),"Site-pid VLER should exist")
 D ASSERT("true",$G(OBJECT("sites","VLER","syncCompleted")),"Site-Sync VLER should be complete")
 D ASSERT("",$G(OBJECT("sites","VLER","hasError")),"Site-hasError VLER should not exist")
 D ASSERT(20131031094920,$G(OBJECT("sites","VLER","sourceStampTime")),"Site-sourceStampTime VLER should exist")
 D ASSERT(20160420110400,$G(OBJECT("sites","VLER","latestJobTimestamp")),"Site-latestJobTimestamp VLER should exist")
 ;
 D ASSERT("DOD;12345678",$G(OBJECT("sites","DOD","pid")),"Site-pid DOD should exist")
 D ASSERT("true",$G(OBJECT("sites","DOD","syncCompleted")),"Site-Sync DOD should be complete")
 D ASSERT("",$G(OBJECT("sites","DOD","hasError")),"Site-hasError DOD should not exist")
 D ASSERT(20161031094920,$G(OBJECT("sites","DOD","sourceStampTime")),"Site-sourceStampTime DOD should exist")
 D ASSERT(20160420110500,$G(OBJECT("sites","DOD","latestJobTimestamp")),"Site-latestJobTimestamp DOD should exist")
 I $D(DATA) K @DATA
 Q
GETMSITESCOMPLETE1E ;; @TEST Get multiple site complete Patient Sync Status - REAL 1st job in error
 N DATA,ARG,ERR,OBJECT,HTTPERR,ROOTJOBID
 D BASIC("9E7A",3,20141031094920)
 D COMPLETEBASIC("9E7A",3,20141031094920)
 D BASIC("C877",3,20141031095020)
 D COMPLETEBASIC("C877",3,20141031095020)
 D BASIC("HDR","1234V4321",20151031094920)
 D COMPLETEBASIC("HDR","1234V4321",20151031094920)
 D BASIC("VLER","1234V4321",20131031094920)
 D COMPLETEBASIC("VLER","1234V4321",20131031094920)
 D BASIC("DOD",12345678,20161031094920)
 D COMPLETEBASIC("DOD",12345678,20161031094920)
 ;
 ; Create jobs
 S ROOTJOBID=$$UUID^VPRJRUT
 D JOB("9E7A;3",ROOTJOBID,"completed",20160420110400,"enterprise-sync-request")
 D JOB("9E7A;3",ROOTJOBID,"error",20160420110500,"vista-9E7A-subscribe-request")
 D JOB("9E7A;3",ROOTJOBID,"completed",20160420110405,"vista-9E7A-data-allergy-poller")
 D JOB("C877;3",ROOTJOBID,"completed",20160420110700,"vistahdr-C877-subscribe-request")
 D JOB("C877;3",ROOTJOBID,"completed",20160420110800,"vistahdr-C877-data-allergy-poller")
 D JOB("HDR;1234V4321",ROOTJOBID,"completed",20160420110900,"hdr-sync-request")
 D JOB("HDR;1234V4321",ROOTJOBID,"completed",20160420111000,"hdr-sync-allergy-request")
 D JOB("VLER;1234V4321",ROOTJOBID,"completed",20160420110400,"vler-sync-request")
 D JOB("DOD;12345678",ROOTJOBID,"completed",20160420110430,"jmeadows-sync-request")
 D JOB("DOD;12345678",ROOTJOBID,"completed",20160420110500,"jmeadows-sync-allergy-request")
 ;
 S ARG("icnpidjpid")="9E7A;3"
 D COMBINED^VPRJPSTATUS(.DATA,.ARG)
 I $D(DATA) D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ;
 ; Ensure that the JSON matches what we expect
 D ASSERT("1234V4321",$G(OBJECT("icn")),"icn attribute should exist")
 D ASSERT("false",$G(OBJECT("syncCompleted")),"SyncCompleted should exist")
 D ASSERT("true",$G(OBJECT("hasError")),"hasError should exist")
 D ASSERT(20160420111000,$G(OBJECT("latestJobTimestamp")),"latestJobTimestamp should exist")
 D ASSERT(20161031094920,$G(OBJECT("latestSourceStampTime")),"latestSourceStampTime should exist")
 D ASSERT(20160420110400,$G(OBJECT("latestEnterpriseSyncRequestTimestamp")),"latestEnterpriseSyncRequestTimestamp should exist")
 ;
 D ASSERT("9E7A;3",$G(OBJECT("sites","9E7A","pid")),"Site-pid 9E7A should exist")
 D ASSERT("false",$G(OBJECT("sites","9E7A","syncCompleted")),"Site-Sync 9E7A should not be complete")
 D ASSERT("true",$G(OBJECT("sites","9E7A","hasError")),"Site-hasError 9E7A should exist")
 D ASSERT(20141031094920,$G(OBJECT("sites","9E7A","sourceStampTime")),"Site-sourceStampTime 9E7A should exist")
 D ASSERT(20160420110500,$G(OBJECT("sites","9E7A","latestJobTimestamp")),"Site-latestJobTimestamp 9E7A should exist")
 ;
 D ASSERT("HDR;1234V4321",$G(OBJECT("sites","HDR","pid")),"Site-pid HDR should exist")
 D ASSERT("true",$G(OBJECT("sites","HDR","syncCompleted")),"Site-Sync HDR should be complete")
 D ASSERT("",$G(OBJECT("sites","HDR","hasError")),"Site-hasError HDR should not exist")
 D ASSERT(20151031094920,$G(OBJECT("sites","HDR","sourceStampTime")),"Site-sourceStampTime HDR should exist")
 D ASSERT(20160420111000,$G(OBJECT("sites","HDR","latestJobTimestamp")),"Site-latestJobTimestamp HDR should exist")
 ;
 D ASSERT("C877;3",$G(OBJECT("sites","C877","pid")),"Site-pid C877 should exist")
 D ASSERT("true",$G(OBJECT("sites","C877","syncCompleted")),"Site-Sync C877 should be complete")
 D ASSERT("",$G(OBJECT("sites","C877","hasError")),"Site-hasError C877 should not exist")
 D ASSERT(20141031095020,$G(OBJECT("sites","C877","sourceStampTime")),"Site-sourceStampTime C877 should exist")
 D ASSERT(20160420110800,$G(OBJECT("sites","C877","latestJobTimestamp")),"Site-latestJobTimestamp C877 should exist")
 ;
 D ASSERT("VLER;1234V4321",$G(OBJECT("sites","VLER","pid")),"Site-pid VLER should exist")
 D ASSERT("true",$G(OBJECT("sites","VLER","syncCompleted")),"Site-Sync VLER should be complete")
 D ASSERT("",$G(OBJECT("sites","VLER","hasError")),"Site-hasError VLER should not exist")
 D ASSERT(20131031094920,$G(OBJECT("sites","VLER","sourceStampTime")),"Site-sourceStampTime VLER should exist")
 D ASSERT(20160420110400,$G(OBJECT("sites","VLER","latestJobTimestamp")),"Site-latestJobTimestamp VLER should exist")
 ;
 D ASSERT("DOD;12345678",$G(OBJECT("sites","DOD","pid")),"Site-pid DOD should exist")
 D ASSERT("true",$G(OBJECT("sites","DOD","syncCompleted")),"Site-Sync DOD should be complete")
 D ASSERT("",$G(OBJECT("sites","DOD","hasError")),"Site-hasError DOD should not exist")
 D ASSERT(20161031094920,$G(OBJECT("sites","DOD","sourceStampTime")),"Site-sourceStampTime DOD should exist")
 D ASSERT(20160420110500,$G(OBJECT("sites","DOD","latestJobTimestamp")),"Site-latestJobTimestamp DOD should exist")
 I $D(DATA) K @DATA
 Q
GETMSITESCOMPLETE2E ;; @TEST Get multiple site complete Patient Sync Status - REAL 2nd job in error
 N DATA,ARG,ERR,OBJECT,HTTPERR,ROOTJOBID
 D BASIC("9E7A",3,20141031094920)
 D COMPLETEBASIC("9E7A",3,20141031094920)
 D BASIC("C877",3,20141031095020)
 D COMPLETEBASIC("C877",3,20141031095020)
 D BASIC("HDR","1234V4321",20151031094920)
 D COMPLETEBASIC("HDR","1234V4321",20151031094920)
 D BASIC("VLER","1234V4321",20131031094920)
 D COMPLETEBASIC("VLER","1234V4321",20131031094920)
 D BASIC("DOD",12345678,20161031094920)
 D COMPLETEBASIC("DOD",12345678,20161031094920)
 ;
 ; Create jobs
 S ROOTJOBID=$$UUID^VPRJRUT
 D JOB("9E7A;3",ROOTJOBID,"completed",20160420110400,"enterprise-sync-request")
 D JOB("9E7A;3",ROOTJOBID,"completed",20160420110500,"vista-9E7A-subscribe-request")
 D JOB("9E7A;3",ROOTJOBID,"error",20160420110405,"vista-9E7A-data-allergy-poller")
 D JOB("C877;3",ROOTJOBID,"completed",20160420110700,"vistahdr-C877-subscribe-request")
 D JOB("C877;3",ROOTJOBID,"completed",20160420110800,"vistahdr-C877-data-allergy-poller")
 D JOB("HDR;1234V4321",ROOTJOBID,"completed",20160420110900,"hdr-sync-request")
 D JOB("HDR;1234V4321",ROOTJOBID,"completed",20160420111000,"hdr-sync-allergy-request")
 D JOB("VLER;1234V4321",ROOTJOBID,"completed",20160420110400,"vler-sync-request")
 D JOB("DOD;12345678",ROOTJOBID,"completed",20160420110430,"jmeadows-sync-request")
 D JOB("DOD;12345678",ROOTJOBID,"completed",20160420110500,"jmeadows-sync-allergy-request")
 ;
 S ARG("icnpidjpid")="9E7A;3"
 D COMBINED^VPRJPSTATUS(.DATA,.ARG)
 I $D(DATA) D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ;
 ; Ensure that the JSON matches what we expect
 D ASSERT("1234V4321",$G(OBJECT("icn")),"icn attribute should exist")
 D ASSERT("false",$G(OBJECT("syncCompleted")),"SyncCompleted should exist")
 D ASSERT("true",$G(OBJECT("hasError")),"hasError should exist")
 D ASSERT(20160420111000,$G(OBJECT("latestJobTimestamp")),"latestJobTimestamp should exist")
 D ASSERT(20161031094920,$G(OBJECT("latestSourceStampTime")),"latestSourceStampTime should exist")
 D ASSERT(20160420110400,$G(OBJECT("latestEnterpriseSyncRequestTimestamp")),"latestEnterpriseSyncRequestTimestamp should exist")
 ;
 D ASSERT("9E7A;3",$G(OBJECT("sites","9E7A","pid")),"Site-pid 9E7A should exist")
 D ASSERT("false",$G(OBJECT("sites","9E7A","syncCompleted")),"Site-Sync 9E7A should not be complete")
 D ASSERT("true",$G(OBJECT("sites","9E7A","hasError")),"Site-hasError 9E7A should exist")
 D ASSERT(20141031094920,$G(OBJECT("sites","9E7A","sourceStampTime")),"Site-sourceStampTime 9E7A should exist")
 D ASSERT(20160420110500,$G(OBJECT("sites","9E7A","latestJobTimestamp")),"Site-latestJobTimestamp 9E7A should exist")
 ;
 D ASSERT("HDR;1234V4321",$G(OBJECT("sites","HDR","pid")),"Site-pid HDR should exist")
 D ASSERT("true",$G(OBJECT("sites","HDR","syncCompleted")),"Site-Sync HDR should be complete")
 D ASSERT("",$G(OBJECT("sites","HDR","hasError")),"Site-hasError HDR should not exist")
 D ASSERT(20151031094920,$G(OBJECT("sites","HDR","sourceStampTime")),"Site-sourceStampTime HDR should exist")
 D ASSERT(20160420111000,$G(OBJECT("sites","HDR","latestJobTimestamp")),"Site-latestJobTimestamp HDR should exist")
 ;
 D ASSERT("C877;3",$G(OBJECT("sites","C877","pid")),"Site-pid C877 should exist")
 D ASSERT("true",$G(OBJECT("sites","C877","syncCompleted")),"Site-Sync C877 should be complete")
 D ASSERT("",$G(OBJECT("sites","C877","hasError")),"Site-hasError C877 should not exist")
 D ASSERT(20141031095020,$G(OBJECT("sites","C877","sourceStampTime")),"Site-sourceStampTime C877 should exist")
 D ASSERT(20160420110800,$G(OBJECT("sites","C877","latestJobTimestamp")),"Site-latestJobTimestamp C877 should exist")
 ;
 D ASSERT("VLER;1234V4321",$G(OBJECT("sites","VLER","pid")),"Site-pid VLER should exist")
 D ASSERT("true",$G(OBJECT("sites","VLER","syncCompleted")),"Site-Sync VLER should be complete")
 D ASSERT("",$G(OBJECT("sites","VLER","hasError")),"Site-hasError VLER should not exist")
 D ASSERT(20131031094920,$G(OBJECT("sites","VLER","sourceStampTime")),"Site-sourceStampTime VLER should exist")
 D ASSERT(20160420110400,$G(OBJECT("sites","VLER","latestJobTimestamp")),"Site-latestJobTimestamp VLER should exist")
 ;
 D ASSERT("DOD;12345678",$G(OBJECT("sites","DOD","pid")),"Site-pid DOD should exist")
 D ASSERT("true",$G(OBJECT("sites","DOD","syncCompleted")),"Site-Sync DOD should be complete")
 D ASSERT("",$G(OBJECT("sites","DOD","hasError")),"Site-hasError DOD should not exist")
 D ASSERT(20161031094920,$G(OBJECT("sites","DOD","sourceStampTime")),"Site-sourceStampTime DOD should exist")
 D ASSERT(20160420110500,$G(OBJECT("sites","DOD","latestJobTimestamp")),"Site-latestJobTimestamp DOD should exist")
 I $D(DATA) K @DATA
 Q
GETMSITESCOMPLETE3E ;; @TEST Get multiple site complete Patient Sync Status - REAL 3rd job in error
 N DATA,ARG,ERR,OBJECT,HTTPERR,ROOTJOBID
 D BASIC("9E7A",3,20141031094920)
 D COMPLETEBASIC("9E7A",3,20141031094920)
 D BASIC("C877",3,20141031095020)
 D COMPLETEBASIC("C877",3,20141031095020)
 D BASIC("HDR","1234V4321",20151031094920)
 D COMPLETEBASIC("HDR","1234V4321",20151031094920)
 D BASIC("VLER","1234V4321",20131031094920)
 D COMPLETEBASIC("VLER","1234V4321",20131031094920)
 D BASIC("DOD",12345678,20161031094920)
 D COMPLETEBASIC("DOD",12345678,20161031094920)
 ;
 ; Create jobs
 S ROOTJOBID=$$UUID^VPRJRUT
 D JOB("9E7A;3",ROOTJOBID,"completed",20160420110400,"enterprise-sync-request")
 D JOB("9E7A;3",ROOTJOBID,"completed",20160420110500,"vista-9E7A-subscribe-request")
 D JOB("9E7A;3",ROOTJOBID,"completed",20160420110405,"vista-9E7A-data-allergy-poller")
 D JOB("C877;3",ROOTJOBID,"error",20160420110700,"vistahdr-C877-subscribe-request")
 D JOB("C877;3",ROOTJOBID,"completed",20160420110800,"vistahdr-C877-data-allergy-poller")
 D JOB("HDR;1234V4321",ROOTJOBID,"completed",20160420110900,"hdr-sync-request")
 D JOB("HDR;1234V4321",ROOTJOBID,"completed",20160420111000,"hdr-sync-allergy-request")
 D JOB("VLER;1234V4321",ROOTJOBID,"completed",20160420110400,"vler-sync-request")
 D JOB("DOD;12345678",ROOTJOBID,"completed",20160420110430,"jmeadows-sync-request")
 D JOB("DOD;12345678",ROOTJOBID,"completed",20160420110500,"jmeadows-sync-allergy-request")
 ;
 S ARG("icnpidjpid")="9E7A;3"
 D COMBINED^VPRJPSTATUS(.DATA,.ARG)
 I $D(DATA) D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ;
 ; Ensure that the JSON matches what we expect
 D ASSERT("1234V4321",$G(OBJECT("icn")),"icn attribute should exist")
 D ASSERT("false",$G(OBJECT("syncCompleted")),"SyncCompleted should exist")
 D ASSERT("true",$G(OBJECT("hasError")),"hasError should exist")
 D ASSERT(20160420111000,$G(OBJECT("latestJobTimestamp")),"latestJobTimestamp should exist")
 D ASSERT(20161031094920,$G(OBJECT("latestSourceStampTime")),"latestSourceStampTime should exist")
 D ASSERT(20160420110400,$G(OBJECT("latestEnterpriseSyncRequestTimestamp")),"latestEnterpriseSyncRequestTimestamp should exist")
 ;
 D ASSERT("9E7A;3",$G(OBJECT("sites","9E7A","pid")),"Site-pid 9E7A should exist")
 D ASSERT("true",$G(OBJECT("sites","9E7A","syncCompleted")),"Site-Sync 9E7A should be complete")
 D ASSERT("",$G(OBJECT("sites","9E7A","hasError")),"Site-hasError 9E7A should not exist")
 D ASSERT(20141031094920,$G(OBJECT("sites","9E7A","sourceStampTime")),"Site-sourceStampTime 9E7A should exist")
 D ASSERT(20160420110500,$G(OBJECT("sites","9E7A","latestJobTimestamp")),"Site-latestJobTimestamp 9E7A should exist")
 ;
 D ASSERT("HDR;1234V4321",$G(OBJECT("sites","HDR","pid")),"Site-pid HDR should exist")
 D ASSERT("true",$G(OBJECT("sites","HDR","syncCompleted")),"Site-Sync HDR should be complete")
 D ASSERT("",$G(OBJECT("sites","HDR","hasError")),"Site-hasError HDR should not exist")
 D ASSERT(20151031094920,$G(OBJECT("sites","HDR","sourceStampTime")),"Site-sourceStampTime HDR should exist")
 D ASSERT(20160420111000,$G(OBJECT("sites","HDR","latestJobTimestamp")),"Site-latestJobTimestamp HDR should exist")
 ;
 D ASSERT("C877;3",$G(OBJECT("sites","C877","pid")),"Site-pid C877 should exist")
 D ASSERT("false",$G(OBJECT("sites","C877","syncCompleted")),"Site-Sync C877 should not be complete")
 D ASSERT("true",$G(OBJECT("sites","C877","hasError")),"Site-hasError C877 should exist")
 D ASSERT(20141031095020,$G(OBJECT("sites","C877","sourceStampTime")),"Site-sourceStampTime C877 should exist")
 D ASSERT(20160420110800,$G(OBJECT("sites","C877","latestJobTimestamp")),"Site-latestJobTimestamp C877 should exist")
 ;
 D ASSERT("VLER;1234V4321",$G(OBJECT("sites","VLER","pid")),"Site-pid VLER should exist")
 D ASSERT("true",$G(OBJECT("sites","VLER","syncCompleted")),"Site-Sync VLER should be complete")
 D ASSERT("",$G(OBJECT("sites","VLER","hasError")),"Site-hasError VLER should not exist")
 D ASSERT(20131031094920,$G(OBJECT("sites","VLER","sourceStampTime")),"Site-sourceStampTime VLER should exist")
 D ASSERT(20160420110400,$G(OBJECT("sites","VLER","latestJobTimestamp")),"Site-latestJobTimestamp VLER should exist")
 ;
 D ASSERT("DOD;12345678",$G(OBJECT("sites","DOD","pid")),"Site-pid DOD should exist")
 D ASSERT("true",$G(OBJECT("sites","DOD","syncCompleted")),"Site-Sync DOD should be complete")
 D ASSERT("",$G(OBJECT("sites","DOD","hasError")),"Site-hasError DOD should not exist")
 D ASSERT(20161031094920,$G(OBJECT("sites","DOD","sourceStampTime")),"Site-sourceStampTime DOD should exist")
 D ASSERT(20160420110500,$G(OBJECT("sites","DOD","latestJobTimestamp")),"Site-latestJobTimestamp DOD should exist")
 I $D(DATA) K @DATA
 Q
GETMSITESCOMPLETE4E ;; @TEST Get multiple site complete Patient Sync Status - REAL 4th job in error
 N DATA,ARG,ERR,OBJECT,HTTPERR,ROOTJOBID
 D BASIC("9E7A",3,20141031094920)
 D COMPLETEBASIC("9E7A",3,20141031094920)
 D BASIC("C877",3,20141031095020)
 D COMPLETEBASIC("C877",3,20141031095020)
 D BASIC("HDR","1234V4321",20151031094920)
 D COMPLETEBASIC("HDR","1234V4321",20151031094920)
 D BASIC("VLER","1234V4321",20131031094920)
 D COMPLETEBASIC("VLER","1234V4321",20131031094920)
 D BASIC("DOD",12345678,20161031094920)
 D COMPLETEBASIC("DOD",12345678,20161031094920)
 ;
 ; Create jobs
 S ROOTJOBID=$$UUID^VPRJRUT
 D JOB("9E7A;3",ROOTJOBID,"completed",20160420110400,"enterprise-sync-request")
 D JOB("9E7A;3",ROOTJOBID,"completed",20160420110500,"vista-9E7A-subscribe-request")
 D JOB("9E7A;3",ROOTJOBID,"completed",20160420110405,"vista-9E7A-data-allergy-poller")
 D JOB("C877;3",ROOTJOBID,"completed",20160420110700,"vistahdr-C877-subscribe-request")
 D JOB("C877;3",ROOTJOBID,"error",20160420110800,"vistahdr-C877-data-allergy-poller")
 D JOB("HDR;1234V4321",ROOTJOBID,"completed",20160420110900,"hdr-sync-request")
 D JOB("HDR;1234V4321",ROOTJOBID,"completed",20160420111000,"hdr-sync-allergy-request")
 D JOB("VLER;1234V4321",ROOTJOBID,"completed",20160420110400,"vler-sync-request")
 D JOB("DOD;12345678",ROOTJOBID,"completed",20160420110430,"jmeadows-sync-request")
 D JOB("DOD;12345678",ROOTJOBID,"completed",20160420110500,"jmeadows-sync-allergy-request")
 ;
 S ARG("icnpidjpid")="9E7A;3"
 D COMBINED^VPRJPSTATUS(.DATA,.ARG)
 I $D(DATA) D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ;
 ; Ensure that the JSON matches what we expect
 D ASSERT("1234V4321",$G(OBJECT("icn")),"icn attribute should exist")
 D ASSERT("false",$G(OBJECT("syncCompleted")),"SyncCompleted should exist")
 D ASSERT("true",$G(OBJECT("hasError")),"hasError should exist")
 D ASSERT(20160420111000,$G(OBJECT("latestJobTimestamp")),"latestJobTimestamp should exist")
 D ASSERT(20161031094920,$G(OBJECT("latestSourceStampTime")),"latestSourceStampTime should exist")
 D ASSERT(20160420110400,$G(OBJECT("latestEnterpriseSyncRequestTimestamp")),"latestEnterpriseSyncRequestTimestamp should exist")
 ;
 D ASSERT("9E7A;3",$G(OBJECT("sites","9E7A","pid")),"Site-pid 9E7A should exist")
 D ASSERT("true",$G(OBJECT("sites","9E7A","syncCompleted")),"Site-Sync 9E7A should be complete")
 D ASSERT("",$G(OBJECT("sites","9E7A","hasError")),"Site-hasError 9E7A should not exist")
 D ASSERT(20141031094920,$G(OBJECT("sites","9E7A","sourceStampTime")),"Site-sourceStampTime 9E7A should exist")
 D ASSERT(20160420110500,$G(OBJECT("sites","9E7A","latestJobTimestamp")),"Site-latestJobTimestamp 9E7A should exist")
 ;
 D ASSERT("HDR;1234V4321",$G(OBJECT("sites","HDR","pid")),"Site-pid HDR should exist")
 D ASSERT("true",$G(OBJECT("sites","HDR","syncCompleted")),"Site-Sync HDR should be complete")
 D ASSERT("",$G(OBJECT("sites","HDR","hasError")),"Site-hasError HDR should not exist")
 D ASSERT(20151031094920,$G(OBJECT("sites","HDR","sourceStampTime")),"Site-sourceStampTime HDR should exist")
 D ASSERT(20160420111000,$G(OBJECT("sites","HDR","latestJobTimestamp")),"Site-latestJobTimestamp HDR should exist")
 ;
 D ASSERT("C877;3",$G(OBJECT("sites","C877","pid")),"Site-pid C877 should exist")
 D ASSERT("false",$G(OBJECT("sites","C877","syncCompleted")),"Site-Sync C877 should not be complete")
 D ASSERT("true",$G(OBJECT("sites","C877","hasError")),"Site-hasError C877 should exist")
 D ASSERT(20141031095020,$G(OBJECT("sites","C877","sourceStampTime")),"Site-sourceStampTime C877 should exist")
 D ASSERT(20160420110800,$G(OBJECT("sites","C877","latestJobTimestamp")),"Site-latestJobTimestamp C877 should exist")
 ;
 D ASSERT("VLER;1234V4321",$G(OBJECT("sites","VLER","pid")),"Site-pid VLER should exist")
 D ASSERT("true",$G(OBJECT("sites","VLER","syncCompleted")),"Site-Sync VLER should be complete")
 D ASSERT("",$G(OBJECT("sites","VLER","hasError")),"Site-hasError VLER should not exist")
 D ASSERT(20131031094920,$G(OBJECT("sites","VLER","sourceStampTime")),"Site-sourceStampTime VLER should exist")
 D ASSERT(20160420110400,$G(OBJECT("sites","VLER","latestJobTimestamp")),"Site-latestJobTimestamp VLER should exist")
 ;
 D ASSERT("DOD;12345678",$G(OBJECT("sites","DOD","pid")),"Site-pid DOD should exist")
 D ASSERT("true",$G(OBJECT("sites","DOD","syncCompleted")),"Site-Sync DOD should be complete")
 D ASSERT("",$G(OBJECT("sites","DOD","hasError")),"Site-hasError DOD should not exist")
 D ASSERT(20161031094920,$G(OBJECT("sites","DOD","sourceStampTime")),"Site-sourceStampTime DOD should exist")
 D ASSERT(20160420110500,$G(OBJECT("sites","DOD","latestJobTimestamp")),"Site-latestJobTimestamp DOD should exist")
 I $D(DATA) K @DATA
 Q
GETMSITESCOMPLETE5E ;; @TEST Get multiple site complete Patient Sync Status - REAL 5th job in error
 N DATA,ARG,ERR,OBJECT,HTTPERR,ROOTJOBID
 D BASIC("9E7A",3,20141031094920)
 D COMPLETEBASIC("9E7A",3,20141031094920)
 D BASIC("C877",3,20141031095020)
 D COMPLETEBASIC("C877",3,20141031095020)
 D BASIC("HDR","1234V4321",20151031094920)
 D COMPLETEBASIC("HDR","1234V4321",20151031094920)
 D BASIC("VLER","1234V4321",20131031094920)
 D COMPLETEBASIC("VLER","1234V4321",20131031094920)
 D BASIC("DOD",12345678,20161031094920)
 D COMPLETEBASIC("DOD",12345678,20161031094920)
 ;
 ; Create jobs
 S ROOTJOBID=$$UUID^VPRJRUT
 D JOB("9E7A;3",ROOTJOBID,"completed",20160420110400,"enterprise-sync-request")
 D JOB("9E7A;3",ROOTJOBID,"completed",20160420110500,"vista-9E7A-subscribe-request")
 D JOB("9E7A;3",ROOTJOBID,"completed",20160420110405,"vista-9E7A-data-allergy-poller")
 D JOB("C877;3",ROOTJOBID,"completed",20160420110700,"vistahdr-C877-subscribe-request")
 D JOB("C877;3",ROOTJOBID,"completed",20160420110800,"vistahdr-C877-data-allergy-poller")
 D JOB("HDR;1234V4321",ROOTJOBID,"error",20160420110900,"hdr-sync-request")
 D JOB("HDR;1234V4321",ROOTJOBID,"completed",20160420111000,"hdr-sync-allergy-request")
 D JOB("VLER;1234V4321",ROOTJOBID,"completed",20160420110400,"vler-sync-request")
 D JOB("DOD;12345678",ROOTJOBID,"completed",20160420110430,"jmeadows-sync-request")
 D JOB("DOD;12345678",ROOTJOBID,"completed",20160420110500,"jmeadows-sync-allergy-request")
 ;
 S ARG("icnpidjpid")="9E7A;3"
 D COMBINED^VPRJPSTATUS(.DATA,.ARG)
 I $D(DATA) D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ;
 ; Ensure that the JSON matches what we expect
 D ASSERT("1234V4321",$G(OBJECT("icn")),"icn attribute should exist")
 D ASSERT("false",$G(OBJECT("syncCompleted")),"SyncCompleted should exist")
 D ASSERT("true",$G(OBJECT("hasError")),"hasError should exist")
 D ASSERT(20160420111000,$G(OBJECT("latestJobTimestamp")),"latestJobTimestamp should exist")
 D ASSERT(20161031094920,$G(OBJECT("latestSourceStampTime")),"latestSourceStampTime should exist")
 D ASSERT(20160420110400,$G(OBJECT("latestEnterpriseSyncRequestTimestamp")),"latestEnterpriseSyncRequestTimestamp should exist")
 ;
 D ASSERT("9E7A;3",$G(OBJECT("sites","9E7A","pid")),"Site-pid 9E7A should exist")
 D ASSERT("true",$G(OBJECT("sites","9E7A","syncCompleted")),"Site-Sync 9E7A should be complete")
 D ASSERT("",$G(OBJECT("sites","9E7A","hasError")),"Site-hasError 9E7A should not exist")
 D ASSERT(20141031094920,$G(OBJECT("sites","9E7A","sourceStampTime")),"Site-sourceStampTime 9E7A should exist")
 D ASSERT(20160420110500,$G(OBJECT("sites","9E7A","latestJobTimestamp")),"Site-latestJobTimestamp 9E7A should exist")
 ;
 D ASSERT("HDR;1234V4321",$G(OBJECT("sites","HDR","pid")),"Site-pid HDR should exist")
 D ASSERT("false",$G(OBJECT("sites","HDR","syncCompleted")),"Site-Sync HDR should not be complete")
 D ASSERT("true",$G(OBJECT("sites","HDR","hasError")),"Site-hasError HDR should exist")
 D ASSERT(20151031094920,$G(OBJECT("sites","HDR","sourceStampTime")),"Site-sourceStampTime HDR should exist")
 D ASSERT(20160420111000,$G(OBJECT("sites","HDR","latestJobTimestamp")),"Site-latestJobTimestamp HDR should exist")
 ;
 D ASSERT("C877;3",$G(OBJECT("sites","C877","pid")),"Site-pid C877 should exist")
 D ASSERT("true",$G(OBJECT("sites","C877","syncCompleted")),"Site-Sync C877 should be complete")
 D ASSERT("",$G(OBJECT("sites","C877","hasError")),"Site-hasError C877 should not exist")
 D ASSERT(20141031095020,$G(OBJECT("sites","C877","sourceStampTime")),"Site-sourceStampTime C877 should exist")
 D ASSERT(20160420110800,$G(OBJECT("sites","C877","latestJobTimestamp")),"Site-latestJobTimestamp C877 should exist")
 ;
 D ASSERT("VLER;1234V4321",$G(OBJECT("sites","VLER","pid")),"Site-pid VLER should exist")
 D ASSERT("true",$G(OBJECT("sites","VLER","syncCompleted")),"Site-Sync VLER should be complete")
 D ASSERT("",$G(OBJECT("sites","VLER","hasError")),"Site-hasError VLER should not exist")
 D ASSERT(20131031094920,$G(OBJECT("sites","VLER","sourceStampTime")),"Site-sourceStampTime VLER should exist")
 D ASSERT(20160420110400,$G(OBJECT("sites","VLER","latestJobTimestamp")),"Site-latestJobTimestamp VLER should exist")
 ;
 D ASSERT("DOD;12345678",$G(OBJECT("sites","DOD","pid")),"Site-pid DOD should exist")
 D ASSERT("true",$G(OBJECT("sites","DOD","syncCompleted")),"Site-Sync DOD should be complete")
 D ASSERT("",$G(OBJECT("sites","DOD","hasError")),"Site-hasError DOD should not exist")
 D ASSERT(20161031094920,$G(OBJECT("sites","DOD","sourceStampTime")),"Site-sourceStampTime DOD should exist")
 D ASSERT(20160420110500,$G(OBJECT("sites","DOD","latestJobTimestamp")),"Site-latestJobTimestamp DOD should exist")
 I $D(DATA) K @DATA
 Q
GETMSITESCOMPLETE6E ;; @TEST Get multiple site complete Patient Sync Status - REAL 6th job in error
 N DATA,ARG,ERR,OBJECT,HTTPERR,ROOTJOBID
 D BASIC("9E7A",3,20141031094920)
 D COMPLETEBASIC("9E7A",3,20141031094920)
 D BASIC("C877",3,20141031095020)
 D COMPLETEBASIC("C877",3,20141031095020)
 D BASIC("HDR","1234V4321",20151031094920)
 D COMPLETEBASIC("HDR","1234V4321",20151031094920)
 D BASIC("VLER","1234V4321",20131031094920)
 D COMPLETEBASIC("VLER","1234V4321",20131031094920)
 D BASIC("DOD",12345678,20161031094920)
 D COMPLETEBASIC("DOD",12345678,20161031094920)
 ;
 ; Create jobs
 S ROOTJOBID=$$UUID^VPRJRUT
 D JOB("9E7A;3",ROOTJOBID,"completed",20160420110400,"enterprise-sync-request")
 D JOB("9E7A;3",ROOTJOBID,"completed",20160420110500,"vista-9E7A-subscribe-request")
 D JOB("9E7A;3",ROOTJOBID,"completed",20160420110405,"vista-9E7A-data-allergy-poller")
 D JOB("C877;3",ROOTJOBID,"completed",20160420110700,"vistahdr-C877-subscribe-request")
 D JOB("C877;3",ROOTJOBID,"completed",20160420110800,"vistahdr-C877-data-allergy-poller")
 D JOB("HDR;1234V4321",ROOTJOBID,"completed",20160420110900,"hdr-sync-request")
 D JOB("HDR;1234V4321",ROOTJOBID,"error",20160420111000,"hdr-sync-allergy-request")
 D JOB("VLER;1234V4321",ROOTJOBID,"completed",20160420110400,"vler-sync-request")
 D JOB("DOD;12345678",ROOTJOBID,"completed",20160420110430,"jmeadows-sync-request")
 D JOB("DOD;12345678",ROOTJOBID,"completed",20160420110500,"jmeadows-sync-allergy-request")
 ;
 S ARG("icnpidjpid")="9E7A;3"
 D COMBINED^VPRJPSTATUS(.DATA,.ARG)
 I $D(DATA) D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ;
 ; Ensure that the JSON matches what we expect
 D ASSERT("1234V4321",$G(OBJECT("icn")),"icn attribute should exist")
 D ASSERT("false",$G(OBJECT("syncCompleted")),"SyncCompleted should exist")
 D ASSERT("true",$G(OBJECT("hasError")),"hasError should exist")
 D ASSERT(20160420111000,$G(OBJECT("latestJobTimestamp")),"latestJobTimestamp should exist")
 D ASSERT(20161031094920,$G(OBJECT("latestSourceStampTime")),"latestSourceStampTime should exist")
 D ASSERT(20160420110400,$G(OBJECT("latestEnterpriseSyncRequestTimestamp")),"latestEnterpriseSyncRequestTimestamp should exist")
 ;
 D ASSERT("9E7A;3",$G(OBJECT("sites","9E7A","pid")),"Site-pid 9E7A should exist")
 D ASSERT("true",$G(OBJECT("sites","9E7A","syncCompleted")),"Site-Sync 9E7A should be complete")
 D ASSERT("",$G(OBJECT("sites","9E7A","hasError")),"Site-hasError 9E7A should not exist")
 D ASSERT(20141031094920,$G(OBJECT("sites","9E7A","sourceStampTime")),"Site-sourceStampTime 9E7A should exist")
 D ASSERT(20160420110500,$G(OBJECT("sites","9E7A","latestJobTimestamp")),"Site-latestJobTimestamp 9E7A should exist")
 ;
 D ASSERT("HDR;1234V4321",$G(OBJECT("sites","HDR","pid")),"Site-pid HDR should exist")
 D ASSERT("false",$G(OBJECT("sites","HDR","syncCompleted")),"Site-Sync HDR should not be complete")
 D ASSERT("true",$G(OBJECT("sites","HDR","hasError")),"Site-hasError HDR should exist")
 D ASSERT(20151031094920,$G(OBJECT("sites","HDR","sourceStampTime")),"Site-sourceStampTime HDR should exist")
 D ASSERT(20160420111000,$G(OBJECT("sites","HDR","latestJobTimestamp")),"Site-latestJobTimestamp HDR should exist")
 ;
 D ASSERT("C877;3",$G(OBJECT("sites","C877","pid")),"Site-pid C877 should exist")
 D ASSERT("true",$G(OBJECT("sites","C877","syncCompleted")),"Site-Sync C877 should be complete")
 D ASSERT("",$G(OBJECT("sites","C877","hasError")),"Site-hasError C877 should not exist")
 D ASSERT(20141031095020,$G(OBJECT("sites","C877","sourceStampTime")),"Site-sourceStampTime C877 should exist")
 D ASSERT(20160420110800,$G(OBJECT("sites","C877","latestJobTimestamp")),"Site-latestJobTimestamp C877 should exist")
 ;
 D ASSERT("VLER;1234V4321",$G(OBJECT("sites","VLER","pid")),"Site-pid VLER should exist")
 D ASSERT("true",$G(OBJECT("sites","VLER","syncCompleted")),"Site-Sync VLER should be complete")
 D ASSERT("",$G(OBJECT("sites","VLER","hasError")),"Site-hasError VLER should not exist")
 D ASSERT(20131031094920,$G(OBJECT("sites","VLER","sourceStampTime")),"Site-sourceStampTime VLER should exist")
 D ASSERT(20160420110400,$G(OBJECT("sites","VLER","latestJobTimestamp")),"Site-latestJobTimestamp VLER should exist")
 ;
 D ASSERT("DOD;12345678",$G(OBJECT("sites","DOD","pid")),"Site-pid DOD should exist")
 D ASSERT("true",$G(OBJECT("sites","DOD","syncCompleted")),"Site-Sync DOD should be complete")
 D ASSERT("",$G(OBJECT("sites","DOD","hasError")),"Site-hasError DOD should not exist")
 D ASSERT(20161031094920,$G(OBJECT("sites","DOD","sourceStampTime")),"Site-sourceStampTime DOD should exist")
 D ASSERT(20160420110500,$G(OBJECT("sites","DOD","latestJobTimestamp")),"Site-latestJobTimestamp DOD should exist")
 I $D(DATA) K @DATA
 Q
GETMSITESCOMPLETE7E ;; @TEST Get multiple site complete Patient Sync Status - REAL 7th job in error
 N DATA,ARG,ERR,OBJECT,HTTPERR,ROOTJOBID
 D BASIC("9E7A",3,20141031094920)
 D COMPLETEBASIC("9E7A",3,20141031094920)
 D BASIC("C877",3,20141031095020)
 D COMPLETEBASIC("C877",3,20141031095020)
 D BASIC("HDR","1234V4321",20151031094920)
 D COMPLETEBASIC("HDR","1234V4321",20151031094920)
 D BASIC("VLER","1234V4321",20131031094920)
 D COMPLETEBASIC("VLER","1234V4321",20131031094920)
 D BASIC("DOD",12345678,20161031094920)
 D COMPLETEBASIC("DOD",12345678,20161031094920)
 ;
 ; Create jobs
 S ROOTJOBID=$$UUID^VPRJRUT
 D JOB("9E7A;3",ROOTJOBID,"completed",20160420110400,"enterprise-sync-request")
 D JOB("9E7A;3",ROOTJOBID,"completed",20160420110500,"vista-9E7A-subscribe-request")
 D JOB("9E7A;3",ROOTJOBID,"completed",20160420110405,"vista-9E7A-data-allergy-poller")
 D JOB("C877;3",ROOTJOBID,"completed",20160420110700,"vistahdr-C877-subscribe-request")
 D JOB("C877;3",ROOTJOBID,"completed",20160420110800,"vistahdr-C877-data-allergy-poller")
 D JOB("HDR;1234V4321",ROOTJOBID,"completed",20160420110900,"hdr-sync-request")
 D JOB("HDR;1234V4321",ROOTJOBID,"completed",20160420111000,"hdr-sync-allergy-request")
 D JOB("VLER;1234V4321",ROOTJOBID,"error",20160420110400,"vler-sync-request")
 D JOB("DOD;12345678",ROOTJOBID,"completed",20160420110430,"jmeadows-sync-request")
 D JOB("DOD;12345678",ROOTJOBID,"completed",20160420110500,"jmeadows-sync-allergy-request")
 ;
 S ARG("icnpidjpid")="9E7A;3"
 D COMBINED^VPRJPSTATUS(.DATA,.ARG)
 I $D(DATA) D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ;
 ; Ensure that the JSON matches what we expect
 D ASSERT("1234V4321",$G(OBJECT("icn")),"icn attribute should exist")
 D ASSERT("false",$G(OBJECT("syncCompleted")),"SyncCompleted should exist")
 D ASSERT("true",$G(OBJECT("hasError")),"hasError should exist")
 D ASSERT(20160420111000,$G(OBJECT("latestJobTimestamp")),"latestJobTimestamp should exist")
 D ASSERT(20161031094920,$G(OBJECT("latestSourceStampTime")),"latestSourceStampTime should exist")
 D ASSERT(20160420110400,$G(OBJECT("latestEnterpriseSyncRequestTimestamp")),"latestEnterpriseSyncRequestTimestamp should exist")
 ;
 D ASSERT("9E7A;3",$G(OBJECT("sites","9E7A","pid")),"Site-pid 9E7A should exist")
 D ASSERT("true",$G(OBJECT("sites","9E7A","syncCompleted")),"Site-Sync 9E7A should be complete")
 D ASSERT("",$G(OBJECT("sites","9E7A","hasError")),"Site-hasError 9E7A should not exist")
 D ASSERT(20141031094920,$G(OBJECT("sites","9E7A","sourceStampTime")),"Site-sourceStampTime 9E7A should exist")
 D ASSERT(20160420110500,$G(OBJECT("sites","9E7A","latestJobTimestamp")),"Site-latestJobTimestamp 9E7A should exist")
 ;
 D ASSERT("HDR;1234V4321",$G(OBJECT("sites","HDR","pid")),"Site-pid HDR should exist")
 D ASSERT("true",$G(OBJECT("sites","HDR","syncCompleted")),"Site-Sync HDR should be complete")
 D ASSERT("",$G(OBJECT("sites","HDR","hasError")),"Site-hasError HDR should not exist")
 D ASSERT(20151031094920,$G(OBJECT("sites","HDR","sourceStampTime")),"Site-sourceStampTime HDR should exist")
 D ASSERT(20160420111000,$G(OBJECT("sites","HDR","latestJobTimestamp")),"Site-latestJobTimestamp HDR should exist")
 ;
 D ASSERT("C877;3",$G(OBJECT("sites","C877","pid")),"Site-pid C877 should exist")
 D ASSERT("true",$G(OBJECT("sites","C877","syncCompleted")),"Site-Sync C877 should be complete")
 D ASSERT("",$G(OBJECT("sites","C877","hasError")),"Site-hasError C877 should not exist")
 D ASSERT(20141031095020,$G(OBJECT("sites","C877","sourceStampTime")),"Site-sourceStampTime C877 should exist")
 D ASSERT(20160420110800,$G(OBJECT("sites","C877","latestJobTimestamp")),"Site-latestJobTimestamp C877 should exist")
 ;
 D ASSERT("VLER;1234V4321",$G(OBJECT("sites","VLER","pid")),"Site-pid VLER should exist")
 D ASSERT("false",$G(OBJECT("sites","VLER","syncCompleted")),"Site-Sync VLER should not be complete")
 D ASSERT("true",$G(OBJECT("sites","VLER","hasError")),"Site-hasError VLER should exist")
 D ASSERT(20131031094920,$G(OBJECT("sites","VLER","sourceStampTime")),"Site-sourceStampTime VLER should exist")
 D ASSERT(20160420110400,$G(OBJECT("sites","VLER","latestJobTimestamp")),"Site-latestJobTimestamp VLER should exist")
 ;
 D ASSERT("DOD;12345678",$G(OBJECT("sites","DOD","pid")),"Site-pid DOD should exist")
 D ASSERT("true",$G(OBJECT("sites","DOD","syncCompleted")),"Site-Sync DOD should be complete")
 D ASSERT("",$G(OBJECT("sites","DOD","hasError")),"Site-hasError DOD should not exist")
 D ASSERT(20161031094920,$G(OBJECT("sites","DOD","sourceStampTime")),"Site-sourceStampTime DOD should exist")
 D ASSERT(20160420110500,$G(OBJECT("sites","DOD","latestJobTimestamp")),"Site-latestJobTimestamp DOD should exist")
 I $D(DATA) K @DATA
 Q
GETMSITESCOMPLETE8E ;; @TEST Get multiple site complete Patient Sync Status - REAL 8th job in error
 N DATA,ARG,ERR,OBJECT,HTTPERR,ROOTJOBID
 D BASIC("9E7A",3,20141031094920)
 D COMPLETEBASIC("9E7A",3,20141031094920)
 D BASIC("C877",3,20141031095020)
 D COMPLETEBASIC("C877",3,20141031095020)
 D BASIC("HDR","1234V4321",20151031094920)
 D COMPLETEBASIC("HDR","1234V4321",20151031094920)
 D BASIC("VLER","1234V4321",20131031094920)
 D COMPLETEBASIC("VLER","1234V4321",20131031094920)
 D BASIC("DOD",12345678,20161031094920)
 D COMPLETEBASIC("DOD",12345678,20161031094920)
 ;
 ; Create jobs
 S ROOTJOBID=$$UUID^VPRJRUT
 D JOB("9E7A;3",ROOTJOBID,"completed",20160420110400,"enterprise-sync-request")
 D JOB("9E7A;3",ROOTJOBID,"completed",20160420110500,"vista-9E7A-subscribe-request")
 D JOB("9E7A;3",ROOTJOBID,"completed",20160420110405,"vista-9E7A-data-allergy-poller")
 D JOB("C877;3",ROOTJOBID,"completed",20160420110700,"vistahdr-C877-subscribe-request")
 D JOB("C877;3",ROOTJOBID,"completed",20160420110800,"vistahdr-C877-data-allergy-poller")
 D JOB("HDR;1234V4321",ROOTJOBID,"completed",20160420110900,"hdr-sync-request")
 D JOB("HDR;1234V4321",ROOTJOBID,"completed",20160420111000,"hdr-sync-allergy-request")
 D JOB("VLER;1234V4321",ROOTJOBID,"completed",20160420110400,"vler-sync-request")
 D JOB("DOD;12345678",ROOTJOBID,"error",20160420110430,"jmeadows-sync-request")
 D JOB("DOD;12345678",ROOTJOBID,"completed",20160420110500,"jmeadows-sync-allergy-request")
 ;
 S ARG("icnpidjpid")="9E7A;3"
 D COMBINED^VPRJPSTATUS(.DATA,.ARG)
 I $D(DATA) D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ;
 ; Ensure that the JSON matches what we expect
 D ASSERT("1234V4321",$G(OBJECT("icn")),"icn attribute should exist")
 D ASSERT("false",$G(OBJECT("syncCompleted")),"SyncCompleted should exist")
 D ASSERT("true",$G(OBJECT("hasError")),"hasError should exist")
 D ASSERT(20160420111000,$G(OBJECT("latestJobTimestamp")),"latestJobTimestamp should exist")
 D ASSERT(20161031094920,$G(OBJECT("latestSourceStampTime")),"latestSourceStampTime should exist")
 D ASSERT(20160420110400,$G(OBJECT("latestEnterpriseSyncRequestTimestamp")),"latestEnterpriseSyncRequestTimestamp should exist")
 ;
 D ASSERT("9E7A;3",$G(OBJECT("sites","9E7A","pid")),"Site-pid 9E7A should exist")
 D ASSERT("true",$G(OBJECT("sites","9E7A","syncCompleted")),"Site-Sync 9E7A should be complete")
 D ASSERT("",$G(OBJECT("sites","9E7A","hasError")),"Site-hasError 9E7A should not exist")
 D ASSERT(20141031094920,$G(OBJECT("sites","9E7A","sourceStampTime")),"Site-sourceStampTime 9E7A should exist")
 D ASSERT(20160420110500,$G(OBJECT("sites","9E7A","latestJobTimestamp")),"Site-latestJobTimestamp 9E7A should exist")
 ;
 D ASSERT("HDR;1234V4321",$G(OBJECT("sites","HDR","pid")),"Site-pid HDR should exist")
 D ASSERT("true",$G(OBJECT("sites","HDR","syncCompleted")),"Site-Sync HDR should  be complete")
 D ASSERT("",$G(OBJECT("sites","HDR","hasError")),"Site-hasError HDR should not exist")
 D ASSERT(20151031094920,$G(OBJECT("sites","HDR","sourceStampTime")),"Site-sourceStampTime HDR should exist")
 D ASSERT(20160420111000,$G(OBJECT("sites","HDR","latestJobTimestamp")),"Site-latestJobTimestamp HDR should exist")
 ;
 D ASSERT("C877;3",$G(OBJECT("sites","C877","pid")),"Site-pid C877 should exist")
 D ASSERT("true",$G(OBJECT("sites","C877","syncCompleted")),"Site-Sync C877 should be complete")
 D ASSERT("",$G(OBJECT("sites","C877","hasError")),"Site-hasError C877 should not exist")
 D ASSERT(20141031095020,$G(OBJECT("sites","C877","sourceStampTime")),"Site-sourceStampTime C877 should exist")
 D ASSERT(20160420110800,$G(OBJECT("sites","C877","latestJobTimestamp")),"Site-latestJobTimestamp C877 should exist")
 ;
 D ASSERT("VLER;1234V4321",$G(OBJECT("sites","VLER","pid")),"Site-pid VLER should exist")
 D ASSERT("true",$G(OBJECT("sites","VLER","syncCompleted")),"Site-Sync VLER should be complete")
 D ASSERT("",$G(OBJECT("sites","VLER","hasError")),"Site-hasError VLER should not exist")
 D ASSERT(20131031094920,$G(OBJECT("sites","VLER","sourceStampTime")),"Site-sourceStampTime VLER should exist")
 D ASSERT(20160420110400,$G(OBJECT("sites","VLER","latestJobTimestamp")),"Site-latestJobTimestamp VLER should exist")
 ;
 D ASSERT("DOD;12345678",$G(OBJECT("sites","DOD","pid")),"Site-pid DOD should exist")
 D ASSERT("false",$G(OBJECT("sites","DOD","syncCompleted")),"Site-Sync DOD should not be complete")
 D ASSERT("true",$G(OBJECT("sites","DOD","hasError")),"Site-hasError DOD should exist")
 D ASSERT(20161031094920,$G(OBJECT("sites","DOD","sourceStampTime")),"Site-sourceStampTime DOD should exist")
 D ASSERT(20160420110500,$G(OBJECT("sites","DOD","latestJobTimestamp")),"Site-latestJobTimestamp DOD should exist")
 I $D(DATA) K @DATA
 Q
GETMSITESCOMPLETE9E ;; @TEST Get multiple site complete Patient Sync Status - REAL 9th job in error
 N DATA,ARG,ERR,OBJECT,HTTPERR,ROOTJOBID
 D BASIC("9E7A",3,20141031094920)
 D COMPLETEBASIC("9E7A",3,20141031094920)
 D BASIC("C877",3,20141031095020)
 D COMPLETEBASIC("C877",3,20141031095020)
 D BASIC("HDR","1234V4321",20151031094920)
 D COMPLETEBASIC("HDR","1234V4321",20151031094920)
 D BASIC("VLER","1234V4321",20131031094920)
 D COMPLETEBASIC("VLER","1234V4321",20131031094920)
 D BASIC("DOD",12345678,20161031094920)
 D COMPLETEBASIC("DOD",12345678,20161031094920)
 ;
 ; Create jobs
 S ROOTJOBID=$$UUID^VPRJRUT
 D JOB("9E7A;3",ROOTJOBID,"completed",20160420110400,"enterprise-sync-request")
 D JOB("9E7A;3",ROOTJOBID,"completed",20160420110500,"vista-9E7A-subscribe-request")
 D JOB("9E7A;3",ROOTJOBID,"completed",20160420110405,"vista-9E7A-data-allergy-poller")
 D JOB("C877;3",ROOTJOBID,"completed",20160420110700,"vistahdr-C877-subscribe-request")
 D JOB("C877;3",ROOTJOBID,"completed",20160420110800,"vistahdr-C877-data-allergy-poller")
 D JOB("HDR;1234V4321",ROOTJOBID,"completed",20160420110900,"hdr-sync-request")
 D JOB("HDR;1234V4321",ROOTJOBID,"completed",20160420111000,"hdr-sync-allergy-request")
 D JOB("VLER;1234V4321",ROOTJOBID,"completed",20160420110400,"vler-sync-request")
 D JOB("DOD;12345678",ROOTJOBID,"completed",20160420110430,"jmeadows-sync-request")
 D JOB("DOD;12345678",ROOTJOBID,"error",20160420110500,"jmeadows-sync-allergy-request")
 ;
 S ARG("icnpidjpid")="9E7A;3"
 D COMBINED^VPRJPSTATUS(.DATA,.ARG)
 I $D(DATA) D DECODE^VPRJSON(DATA,"OBJECT","ERR")
 ; If we can't decode the JSON Fail the test
 D ASSERT(0,$D(ERR),"ERROR DECODING JSON")
 ;
 ; Ensure that the JSON matches what we expect
 D ASSERT("1234V4321",$G(OBJECT("icn")),"icn attribute should exist")
 D ASSERT("false",$G(OBJECT("syncCompleted")),"SyncCompleted should exist")
 D ASSERT("true",$G(OBJECT("hasError")),"hasError should exist")
 D ASSERT(20160420111000,$G(OBJECT("latestJobTimestamp")),"latestJobTimestamp should exist")
 D ASSERT(20161031094920,$G(OBJECT("latestSourceStampTime")),"latestSourceStampTime should exist")
 D ASSERT(20160420110400,$G(OBJECT("latestEnterpriseSyncRequestTimestamp")),"latestEnterpriseSyncRequestTimestamp should exist")
 ;
 D ASSERT("9E7A;3",$G(OBJECT("sites","9E7A","pid")),"Site-pid 9E7A should exist")
 D ASSERT("true",$G(OBJECT("sites","9E7A","syncCompleted")),"Site-Sync 9E7A should be complete")
 D ASSERT("",$G(OBJECT("sites","9E7A","hasError")),"Site-hasError 9E7A should not exist")
 D ASSERT(20141031094920,$G(OBJECT("sites","9E7A","sourceStampTime")),"Site-sourceStampTime 9E7A should exist")
 D ASSERT(20160420110500,$G(OBJECT("sites","9E7A","latestJobTimestamp")),"Site-latestJobTimestamp 9E7A should exist")
 ;
 D ASSERT("HDR;1234V4321",$G(OBJECT("sites","HDR","pid")),"Site-pid HDR should exist")
 D ASSERT("true",$G(OBJECT("sites","HDR","syncCompleted")),"Site-Sync HDR should not be complete")
 D ASSERT("",$G(OBJECT("sites","HDR","hasError")),"Site-hasError HDR should exist")
 D ASSERT(20151031094920,$G(OBJECT("sites","HDR","sourceStampTime")),"Site-sourceStampTime HDR should exist")
 D ASSERT(20160420111000,$G(OBJECT("sites","HDR","latestJobTimestamp")),"Site-latestJobTimestamp HDR should exist")
 ;
 D ASSERT("C877;3",$G(OBJECT("sites","C877","pid")),"Site-pid C877 should exist")
 D ASSERT("true",$G(OBJECT("sites","C877","syncCompleted")),"Site-Sync C877 should not be complete")
 D ASSERT("",$G(OBJECT("sites","C877","hasError")),"Site-hasError C877 should exist")
 D ASSERT(20141031095020,$G(OBJECT("sites","C877","sourceStampTime")),"Site-sourceStampTime C877 should exist")
 D ASSERT(20160420110800,$G(OBJECT("sites","C877","latestJobTimestamp")),"Site-latestJobTimestamp C877 should exist")
 ;
 D ASSERT("VLER;1234V4321",$G(OBJECT("sites","VLER","pid")),"Site-pid VLER should exist")
 D ASSERT("true",$G(OBJECT("sites","VLER","syncCompleted")),"Site-Sync VLER should be complete")
 D ASSERT("",$G(OBJECT("sites","VLER","hasError")),"Site-hasError VLER should not exist")
 D ASSERT(20131031094920,$G(OBJECT("sites","VLER","sourceStampTime")),"Site-sourceStampTime VLER should exist")
 D ASSERT(20160420110400,$G(OBJECT("sites","VLER","latestJobTimestamp")),"Site-latestJobTimestamp VLER should exist")
 ;
 D ASSERT("DOD;12345678",$G(OBJECT("sites","DOD","pid")),"Site-pid DOD should exist")
 D ASSERT("false",$G(OBJECT("sites","DOD","syncCompleted")),"Site-Sync DOD should not be complete")
 D ASSERT("true",$G(OBJECT("sites","DOD","hasError")),"Site-hasError DOD should exist")
 D ASSERT(20161031094920,$G(OBJECT("sites","DOD","sourceStampTime")),"Site-sourceStampTime DOD should exist")
 D ASSERT(20160420110500,$G(OBJECT("sites","DOD","latestJobTimestamp")),"Site-latestJobTimestamp DOD should exist")
 I $D(DATA) K @DATA
 Q
