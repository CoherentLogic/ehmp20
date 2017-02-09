VPRJTPS ;SLC/KCM -- Integration tests for saving patient objects
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
STARTUP  ; Run once before all tests
 N DATA
 S VPRJTPID=$G(^VPRPTJ("JPID","93EF:-7"))
 I VPRJTPID D CLEARPT^VPRJPS(VPRJTPID)
 Q
SHUTDOWN ; Run once after all tests
 D CLRPT^VPRJTX
 Q
ASSERT(EXPECT,ACTUAL,MSG) ; for convenience
 D EQ^VPRJT(EXPECT,ACTUAL,$G(MSG))
 Q
 ;
PATIDS ; Setup patient identifiers
 S ^VPRPTX("count","patient","patient")=1
 S ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2369")=""
 S ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2369","93EF;-7")=""
 S ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2369","-777V123777")=""
 S ^VPRPTJ("JPID","93EF;-7")="52833885-af7c-4899-90be-b3a6630b2369"
 S ^VPRPTJ("JPID","-777V123777")="52833885-af7c-4899-90be-b3a6630b2369"
 Q
 ;
ADDPTUNKJPID ;; @TEST Error condition when JPID is unknown adding a patient
 N DATA,VPRJTPID,HTTPERR
 D GETDATA^VPRJTX("DEMOG7","VPRJTP01",.DATA)
 K ^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2369")
 K ^VPRPTJ("JPID","93EF;-7")
 K ^VPRPTJ("JPID","-777V123777")
 S VPRJTPID=$P($$PUTPT^VPRJPR("",.DATA),"/",3)
 D ASSERT(0,$L(VPRJTPID)>0)
 D ASSERT("",$G(VPRJTPID))
 ; Set VPRJTPID to the correct value to ease the next few calls
 I VPRJTPID="" S VPRJTPID="93EF;-7"
 D ASSERT(0,$D(^VPRPT("52833885-af7c-4899-90be-b3a6630b2369",VPRJTPID,"urn:va:patient:93EF:-7:-7")))
 D ASSERT("",$G(^VPRPTJ("JPID",VPRJTPID)))
 D ASSERT(0,$D(^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2369")))
 D ASSERT(10,$D(^TMP("HTTPERR",$J)),"An HTTP Error did not occur while filing data")
 D ASSERT(404,$G(^TMP("HTTPERR",$J,1,"error","code")),"A 404 error code should have occurred")
 D ASSERT(224,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"A 224 error should have occurred")
 K ^TMP("HTTPERR")
 K ^TMP("VPRJERR")
 Q
ADDOBJUNKJPID ;; @TEST Error condition when JPID is unknown adding an object
 N DATA,LOC,METASTAMP,VPRJTPID,HTTPERR,VPRJPID
 ; Set VPRJTPID to the correct value to ease the next few calls
 I $G(VPRJTPID)="" S VPRJTPID="93EF;-7"
 D GETDATA^VPRJTX("MED1","VPRJTP02",.DATA)
 S LOC=$$SAVE^VPRJPS(VPRJTPID,.DATA)
 S VPRJPID=$$JPID4PID^VPRJPR(VPRJTPID)
 D ASSERT("",$G(VPRJPID),"A JPID exists for "_VPRJTPID_" and it should not.")
 D ASSERT(0,$L(LOC)>0)
 D ASSERT("",$G(LOC))
 D ASSERT(0,$D(^VPRPT))
 D ASSERT(0,$D(^VPRPTJ("JSON")))
 D ASSERT(0,$D(^VPRPTJ("TEMPLATE")))
 D ASSERT("",$G(^VPRPTI))
 D ASSERT(404,$G(^TMP("HTTPERR",$J,1,"error","code")),"A 404 error code should have occurred")
 D ASSERT(224,$G(^TMP("HTTPERR",$J,1,"error","errors",1,"reason")),"A 224 error should have occurred")
 K ^TMP("HTTPERR")
 K ^TMP("VPRJERR")
 Q
ADDPT ;; @TEST adding a patient
 N DATA,METASTAMP,VPRJTPID,HTTPERR,PTIME,TIME,VPRJPID
 ; The hang commands are necessary to ensure subsequent accesses on the lastAccessTime node don't happen within the same second
 S TIME=$$CURRTIME^VPRJRUT
 H 1
 D GETDATA^VPRJTX("DEMOG7","VPRJTP01",.DATA)
 D PATIDS
 S VPRJTPID=$P($$PUTPT^VPRJPR("",.DATA),"/",3)
 S VPRJPID=$$JPID4PID^VPRJPR(VPRJTPID)
 D ASSERT(1,$G(VPRJPID)'="","JPID doesn't exist for this patient")
 I $G(VPRJPID)="" QUIT
 S PTIME=TIME
 H 1
 S TIME=$G(^VPRMETA("JPID",VPRJPID,"lastAccessTime"))
 D ASSERT(1,TIME>PTIME)
 S METASTAMP=""
 S METASTAMP=$O(^VPRPT(VPRJPID,VPRJTPID,"urn:va:patient:93EF:-7:-7",METASTAMP),-1)
 D ASSERT(1,$L(VPRJTPID)>0)
 D ASSERT(10,$D(^VPRPT(VPRJPID,VPRJTPID,"urn:va:patient:93EF:-7:-7",METASTAMP)))
 D ASSERT(-77777777,^VPRPT(VPRJPID,VPRJTPID,"urn:va:patient:93EF:-7:-7",METASTAMP,"ssn"))
 D ASSERT("93EF;-7",VPRJTPID)
 D ASSERT("52833885-af7c-4899-90be-b3a6630b2369",^VPRPTJ("JPID",VPRJTPID))
 D ASSERT(11,$D(^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2369")))
 D ASSERT(1,$D(^VPRPTJ("JSON",VPRJPID,VPRJTPID,"urn:va:patient:93EF:-7:-7",METASTAMP,1)))
 Q
ADDOBJ ;; @TEST adding an object
 N DATA,LOC,METASTAMP,VPRJTPID,HTTPERR,PTIME,TIME,VPRJPID
 ; The hang commands are necessary to ensure subsequent accesses on the lastAccessTime node don't happen within the same second
 S TIME=$$CURRTIME^VPRJRUT
 H 1
 S VPRJTPID="93EF;-7"
 S VPRJPID=$$JPID4PID^VPRJPR(VPRJTPID)
 D GETDATA^VPRJTX("MED1","VPRJTP02",.DATA)
 S LOC=$$SAVE^VPRJPS(VPRJPID,.DATA)
 S PTIME=TIME
 H 1
 S TIME=$G(^VPRMETA("JPID",VPRJPID,"lastAccessTime"))
 D ASSERT(1,TIME>PTIME)
 S METASTAMP=""
 S METASTAMP=$O(^VPRPT(VPRJPID,VPRJTPID,"urn:va:med:93EF:-7:16982",METASTAMP),-1)
 D ASSERT(10,$D(^VPRPT(VPRJPID,VPRJTPID,"urn:va:med:93EF:-7:16982",METASTAMP)))
 D ASSERT("urn:vuid:4023979",^VPRPT(VPRJPID,VPRJTPID,"urn:va:med:93EF:-7:16982",METASTAMP,"products",1,"ingredientCode"))
 D ASSERT(1,$D(^VPRPTJ("JSON",VPRJPID,VPRJTPID,"urn:va:med:93EF:-7:16982",METASTAMP,1)))
 D ASSERT(19350407,+$P($G(^VPRPTJ("TEMPLATE",VPRJPID,VPRJTPID,"urn:va:patient:93EF:-7:-7","summary",1)),":",2))
 D ASSERT(1,^VPRPTI(VPRJPID,VPRJTPID,"tally","collection","med"))
 Q
CHKIDX ;; @TEST indexes that were built after adding object
 N VPRJTPID,HTTPERR,VPRJPID
 S VPRJTPID="93EF;-7"
 S VPRJPID=$$JPID4PID^VPRJPR(VPRJTPID)
 D ASSERT(1,$D(^VPRPTI(VPRJPID,VPRJTPID,"attr","med-class-code","urn:vadc:hs502 ","79939681=","urn:va:med:93EF:-7:16982","products#1")))
 D ASSERT(1,$D(^VPRPTI(VPRJPID,VPRJTPID,"attr","med-provider","labtech,special ","79939681=","urn:va:med:93EF:-7:16982","orders#1")))
 D ASSERT(1,$D(^VPRPTI(VPRJPID,VPRJTPID,"attr","med-qualified-name","metformin ","79939681=","urn:va:med:93EF:-7:16982",1)))
 D ASSERT(1,$D(^VPRPTI(VPRJPID,VPRJTPID,"attr","medication","79939681=","urn:va:med:93EF:-7:16982",1)))
 D ASSERT("79939681=",^VPRPTI(VPRJPID,VPRJTPID,"time","med-time","79949682=","urn:va:med:93EF:-7:16982",1))
 D ASSERT("79949682=",^VPRPTI(VPRJPID,VPRJTPID,"stop","med-time","79939681=","urn:va:med:93EF:-7:16982",1))
 D ASSERT(1,^VPRPTI(VPRJPID,VPRJTPID,"tally","kind","medication, outpatient"))
 D ASSERT(1,$D(^VPRPTI(VPRJPID,VPRJTPID,"attr","med-active-outpt","79939681=","urn:va:med:93EF:-7:16982",1)))
 Q
ADDLNK ;; @TEST adding object with links defined
 N I,TAGS,VPRJTPID,HTTPERR,VPRJPID
 S VPRJTPID="93EF;-7"
 S VPRJPID=$$JPID4PID^VPRJPR(VPRJTPID)
 F I=1:1:5 S TAGS(I)="DATA"_I_"^VPRJTP03"
 D ADDDATA^VPRJTX(.TAGS,VPRJTPID)
 D ASSERT(0,$D(^TMP("HTTPERR",$J)),"An HTTP Error occured filing data")
 D ASSERT(1,$D(^VPRPTI(VPRJPID,VPRJTPID,"rev","urn:va:utesta:93EF:-7:1","utest-multiple","urn:va:utestc:93EF:-7:23","items#1")))
 D ASSERT(1,$D(^VPRPTI(VPRJPID,VPRJTPID,"rev","urn:va:utestb:93EF:-7:3","utest-multiple","urn:va:utestc:93EF:-7:23","items#2")))
 D ASSERT(1,$D(^VPRPTI(VPRJPID,VPRJTPID,"rev","urn:va:utesta:93EF:-7:2","utest-single","urn:va:utestc:93EF:-7:23",1)))
 D ASSERT(1,$D(^VPRPTI(VPRJPID,VPRJTPID,"rev","urn:va:utesta:93EF:-7:1","utest-multiple","urn:va:utestc:93EF:-7:42","items#1")))
 D ASSERT(1,$D(^VPRPTI(VPRJPID,VPRJTPID,"rev","urn:va:utesta:93EF:-7:1","utest-single","urn:va:utestc:93EF:-7:42",1)))
 Q
DELCLTN ;; @TEST delete a collection for a patient
 N VPRJTPID,HTTPERR,PTIME,TIME,VPRJPID
 ; The hang commands are necessary to ensure subsequent accesses on the lastAccessTime node don't happen within the same second
 S TIME=$$CURRTIME^VPRJRUT
 H 1
 S VPRJTPID="93EF;-7"
 S VPRJPID=$$JPID4PID^VPRJPR(VPRJTPID)
 D ASSERT(10,$D(^VPRPT(VPRJPID,VPRJTPID,"urn:va:utestc:93EF:-7:23")))
 D ASSERT(10,$D(^VPRPT(VPRJPID,VPRJTPID,"urn:va:utestc:93EF:-7:42")))
 D ASSERT(1,$G(VPRJPID)'="","JPID doesn't exist for this patient")
 I $G(VPRJPID)="" QUIT
 D DELCLTN^VPRJPS(VPRJTPID,"utestc")
 S PTIME=TIME
 H 1
 S TIME=$G(^VPRMETA("JPID",VPRJPID,"lastAccessTime"))
 D ASSERT(1,TIME>PTIME)
 D ASSERT(0,$D(^VPRPT(VPRJPID,VPRJTPID,"urn:va:utestc:93EF:-7:23")))
 D ASSERT(0,$D(^VPRPT(VPRJPID,VPRJTPID,"urn:va:utestc:93EF:-7:42")))
 D ASSERT(0,$D(^VPRPTI(VPRJPID,VPRJTPID,"attr","utest-c","testrels ","urn:va:utestc:93EF:-7:23",1)))
 D ASSERT(0,$G(^VPRPTI(VPRJPID,"93EF;-7","tally","collection","utestc"),0))
 Q
DELCSRV ;; @TEST delete a collection for a specific server
 N I,TAGS,VPRJTPID,HTTPERR,PTIME,TIME,VPRJPID
 ; The hang commands are necessary to ensure subsequent accesses on the lastAccessTime node don't happen within the same second
 S TIME=$$CURRTIME^VPRJRUT
 H 1
 S VPRJTPID="93EF;-7"
 S VPRJPID=$$JPID4PID^VPRJPR(VPRJTPID)
 D ASSERT(1,$G(VPRJPID)'="","JPID doesn't exist for this patient")
 I $G(VPRJPID)="" QUIT
 F I=6:1:7 S TAGS(I)="SRV"_I_"^VPRJTP03"
 D ADDDATA^VPRJTX(.TAGS,VPRJTPID)
 D ASSERT(0,$D(^TMP("HTTPERR",$J)),"An HTTP Error occured filing data")
 D ASSERT(10,$D(^VPRPT(VPRJPID,VPRJTPID,"urn:va:utesta:9999:-7:6")))
 D ASSERT(10,$D(^VPRPT(VPRJPID,VPRJTPID,"urn:va:utesta:93EF:-7:7")))
 D DELCLTN^VPRJPS(VPRJTPID,"utesta","9999")
 S PTIME=TIME
 H 1
 S TIME=$G(^VPRMETA("JPID",VPRJPID,"lastAccessTime"))
 D ASSERT(1,TIME>PTIME)
 D ASSERT(0,$D(^VPRPT(VPRJPID,VPRJTPID,"urn:va:utesta:9999:-7:6")))
 D ASSERT(10,$D(^VPRPT(VPRJPID,VPRJTPID,"urn:va:utesta:93EF:-7:7")))
 Q
DELPT ;; @TEST deleting a patient and all places data exists
 N JPID,TYPE,TYPE2,STAMP,VPRJTPID,HTTPERR
 S VPRJTPID="93EF;-7"
 ; Add job status
 K ^VPRJOB
 K ^VPRPTJ("JPID")
 D PATIDS
 S JPID="52833885-af7c-4899-90be-b3a6630b2369"
 S TYPE="jmeadows-lab-sync-request"
 S TYPE2="jmeadows-vitals-sync-request"
 S STAMP=201412180711200
 D JOBSTATG^VPRJTJOB(2,1,JPID,TYPE,STAMP,"created")
 D JOBSTATG^VPRJTJOB(3,1,JPID,TYPE2,STAMP+1,"created")
 D ASSERT(10,$D(^VPRJOB(1)),"Job status Sequential Counter 1 does not exist and should")
 D ASSERT(10,$D(^VPRJOB(2)),"Job status Sequential Counter 2 does not exist and should")
 ; Add sync status
 N RETURN,BODY,ARG
 K ^VPRSTATUS(JPID,VPRJTPID)
 K ^TMP("HTTPERR",$J)
 D SYNCSTAT^VPRJTSYSS(.BODY,"93EF;-7","-777V123777")
 S ARG("id")="93EF;-7"
 S RETURN=$$SET^VPRJPSTATUS(.ARG,.BODY)
 D ASSERT(1,$G(^VPRSTATUS(JPID,"93EF;-7","93EF","stampTime"))=20141031094921,"Source metastamp doesn't exist")
 D ASSERT(1,$D(^VPRSTATUS(JPID,"93EF;-7","93EF","allergy",20141031094922)),"Domain: Allergy metastamp doesn't exist")
 D ASSERT(1,$D(^VPRSTATUS(JPID,"93EF;-7","93EF","allergy","urn:va:allergy:93EF:-7:1001",20141031094923)),"Event metastamp 'urn:va:allergy:93EF:3:1001' doesn't exist")
 D ASSERT(1,$D(^VPRSTATUS(JPID,"93EF;-7","93EF","allergy","urn:va:allergy:93EF:-7:1002",20141031094924)),"Event metastamp 'urn:va:allergy:93EF:3:1001' doesn't exist")
 D ASSERT(1,$D(^VPRSTATUS(JPID,"93EF;-7","93EF","vitals",20141031094925)),"Domain: Vitals metastamp doesn't exist")
 D ASSERT(1,$D(^VPRSTATUS(JPID,"93EF;-7","93EF","vitals","urn:va:vitals:93EF:-7:1001",20141031094926)),"Event metastamp 'urn:va:vitals:93EF:3:1001' doesn't exist")
 D ASSERT(1,$D(^VPRSTATUS(JPID,"93EF;-7","93EF","vitals","urn:va:vitals:93EF:-7:1002",20141031094927)),"Event metastamp 'urn:va:vitals:93EF:3:1001' doesn't exist")
 ; Add object
 N DATA,LOC,METASTAMP
 D GETDATA^VPRJTX("MED1","VPRJTP02",.DATA)
 S LOC=$$SAVE^VPRJPS(JPID,.DATA)
 S METASTAMP=""
 S METASTAMP=$O(^VPRPT(JPID,VPRJTPID,"urn:va:med:93EF:-7:16982",METASTAMP),-1)
 D ASSERT(10,$D(^VPRPT(JPID,VPRJTPID,"urn:va:med:93EF:-7:16982",METASTAMP)))
 D ASSERT("urn:vuid:4023979",^VPRPT(JPID,VPRJTPID,"urn:va:med:93EF:-7:16982",METASTAMP,"products",1,"ingredientCode"))
 D ASSERT(1,$D(^VPRPTJ("JSON",JPID,VPRJTPID,"urn:va:med:93EF:-7:16982",METASTAMP,1)))
 D ASSERT(19350407,+$P($G(^VPRPTJ("TEMPLATE",JPID,VPRJTPID,"urn:va:patient:93EF:-7:-7","summary",1)),":",2))
 ; Delete patient
 D CLEARPT^VPRJPS("93EF;-7")
 ; Ensure JPID index is deleted correctly
 D ASSERT(0,$D(^VPRPTJ("JPID","-777V123777")),"ICN exists")
 D ASSERT(0,$D(^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2369")),"JPID exists")
 D ASSERT(0,$D(^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2369","-777V123777")),"ICN/JPID exists")
 D ASSERT(0,$D(^VPRPTJ("JPID","52833885-af7c-4899-90be-b3a6630b2369","93EF;-7")),"PID/JPID exists")
 D ASSERT(0,$D(^VPRPTJ("JPID","93EF;-7")),"PID exists")
 ; Ensure indexes are deleted
 D ASSERT(0,$D(^VPRPTI(JPID,"93EF;-7","review")))
 N REVTM
 S REVTM="" F  S REVTM=$O(^VPRTX("review",REVTM)) Q:REVTM=""  D
 . D ASSERT(0,$D(^VPRPTX("review",REVTM,PID)))
 D ASSERT(0,$D(^VPRPTX("pidReview","93EF;-7")))
 D ASSERT(0,$D(^VPRPTI(JPID,"93EF;-7")))
 ; Ensure codes are deleted
 D ASSERT(0,$D(^VPRPTX("pidCodes","ZZUT;3")))
 N FLD,CODE,KEY
 S FLD="" F  S FLD=$O(^VPRPTX("pidCodes","93EF;-7",FLD)) Q:FLD=""  D
 . S CODE="" F  S CODE=$O(^VPRPTX("pidCodes","93EF;-7",FLD,CODE)) Q:CODE=""  D
 . . D ASSERT(0,$D(^VPRPTX("allCodes",CODE,FLD,"93EF;-7")))
 ; Ensure review dates are deleted
 D ASSERT(0,$D(^VPRPTI(JPID,"93EF;-7","review")))
 N REVTM
 S REVTM="" F  S REVTM=$O(^VPRTX("review",REVTM)) Q:REVTM=""  D
 . D ASSERT(0,$D(^VPRPTX("review",REVTM,PID)))
 D ASSERT(0,$D(^VPRPTX("pidReview","93EF;-7")))
 ; Ensure Patient data is deleted
 D ASSERT(0,$D(^VPRPT(JPID,"93EF;-7")),"Patient data exists in VPRPT")
 D ASSERT(0,$D(^VPRPTJ("JSON",JPID,"93EF;-7")),"Patient data exists in VPRPTJ(""JSON"")")
 D ASSERT(0,$D(^VPRPTJ("TEMPLATE",JPID,"93EF;-7")),"Patient data exists in VPRPTJ(""TEMPLATE"")")
 D ASSERT(0,$D(^VPRPTJ("KEY","urn:va:med:93EF:-7:16982","93EF;-7")),"Patient data exists in VPRPTJ(""KEY"")")
 D ASSERT(0,$D(^VPRPTJ("KEY","urn:va:patient:93EF:-7:-7","93EF;-7")),"Patient data exists in VPRPTJ(""KEY"")")
 D ASSERT(0,$D(^VPRPTJ("KEY","urn:va:utesta:93EF:-7:1","93EF;-7")),"Patient data exists in VPRPTJ(""KEY"")")
 D ASSERT(0,$D(^VPRPTJ("KEY","urn:va:utesta:93EF:-7:2","93EF;-7")),"Patient data exists in VPRPTJ(""KEY"")")
 D ASSERT(0,$D(^VPRPTJ("KEY","urn:va:utesta:93EF:-7:7","93EF;-7")),"Patient data exists in VPRPTJ(""KEY"")")
 D ASSERT(0,$D(^VPRPTJ("KEY","urn:va:utestb:93EF:-7:3","93EF;-7")),"Patient data exists in VPRPTJ(""KEY"")")
 ; Ensure sync status is deleted
 D ASSERT(0,$D(^VPRSTATUS(JPID,"93EF;-7")),"A patient Sync Status exists and should not")
 ; Ensure job status is deleted
 D ASSERT(0,$D(^VPRJOB(1)),"Job status Sequential Counter 1 does exist and should not")
 D ASSERT(0,$D(^VPRJOB(2)),"Job status Sequential Counter 2 does exist and should not")
 Q
DELSITE ;; @TEST Delete a site's patient data
 N VPRJTPID1,VPRJTPID2,TAGS,I
 S VPRJTPID1="93EF;-7"
 S VPRJTPID2="93EF;-8"
 S VPRJTPID1=$$ADDPT^VPRJTX("DEMOG7^VPRJTP01")
 F I=1:1:3 S TAGS(I)="UTST"_I_"^VPRJTP01"
 D ADDDATA^VPRJTX(.TAGS,VPRJTPID1)
 S VPRJTPID2=$$ADDPT^VPRJTX("DEMOG8^VPRJTP01")
 F I=4:1:5 S TAGS(I)="UTST"_I_"^VPRJTP01"
 D ADDDATA^VPRJTX(.TAGS,VPRJTPID2)
 D ASSERT(10,$D(^VPRPT($$JPID4PID^VPRJPR(VPRJTPID1),VPRJTPID1)))
 D ASSERT(10,$D(^VPRPTJ("JSON",$$JPID4PID^VPRJPR(VPRJTPID1),VPRJTPID1)))
 D ASSERT(10,$D(^VPRPTJ("TEMPLATE",$$JPID4PID^VPRJPR(VPRJTPID1),VPRJTPID1)))
 D ASSERT(1,^VPRPTI($$JPID4PID^VPRJPR(VPRJTPID1),VPRJTPID1,"tally","collection","patient"))
 D ASSERT(10,$D(^VPRPT($$JPID4PID^VPRJPR(VPRJTPID2),VPRJTPID2)))
 D ASSERT(10,$D(^VPRPTJ("JSON",$$JPID4PID^VPRJPR(VPRJTPID2),VPRJTPID2)))
 D ASSERT(10,$D(^VPRPTJ("TEMPLATE",$$JPID4PID^VPRJPR(VPRJTPID2),VPRJTPID2)))
 D ASSERT(1,^VPRPTI($$JPID4PID^VPRJPR(VPRJTPID2),VPRJTPID2,"tally","collection","patient"))
 D DELSITE^VPRJPS("93EF")
 D ASSERT(0,$D(^VPRPT("52833885-af7c-4899-90be-b3a6630b2369",VPRJTPID1)))
 D ASSERT(0,$D(^VPRPTJ("JSON","52833885-af7c-4899-90be-b3a6630b2369",VPRJTPID1)))
 D ASSERT(0,$D(^VPRPTJ("TEMPLATE","52833885-af7c-4899-90be-b3a6630b2369",VPRJTPID1)))
 D ASSERT(0,^VPRPTI("52833885-af7c-4899-90be-b3a6630b2369",VPRJTPID1,"tally","collection","patient"))
 D ASSERT(0,$D(^VPRPT("52833885-af7c-4899-90be-b3a6630b2370",VPRJTPID2)))
 D ASSERT(0,$D(^VPRPTJ("JSON","52833885-af7c-4899-90be-b3a6630b2370",VPRJTPID2)))
 D ASSERT(0,$D(^VPRPTJ("TEMPLATE","52833885-af7c-4899-90be-b3a6630b2370",VPRJTPID2)))
 D ASSERT(0,^VPRPTI("52833885-af7c-4899-90be-b3a6630b2370",VPRJTPID2,"tally","collection","patient"))
 Q
