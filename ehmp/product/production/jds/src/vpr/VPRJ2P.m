VPRJ2P ;SLC/KCM -- Management utilities for JSON patient objects
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
RIDXALL ; Reindex all patients
 N OK,JPID,PID,KEY
 K ^XTMP("VPRJVUP","vpr")
 S ^XTMP("VPRJVUP","vpr","total")=$G(^VPRPTX("count","patient","patient"))
 D LOGMSG^VPRJ("vpr","Re-indexing VPR for ALL patients")
 L +^VPRPT:$G(^VPRCONFIG("timeout","ptindex"),5) E  D LOGMSG^VPRJ("vpr","Unable to lock ALL patient data") Q
 D SUSPEND^VPRJ
 D CLRINDEX(.OK) Q:'OK
 ;
 S JPID="" F  S JPID=$O(^VPRPT(JPID)) Q:JPID=""  D
 . S PID="" F  S PID=$O(^VPRPT(JPID,PID)) Q:PID=""  D
 . . S KEY="" F  S KEY=$O(^VPRPT(JPID,PID,KEY)) Q:KEY=""  D RIDXOBJ(PID,KEY)
 . . D LOGCNT^VPRJ("vpr")
 D RESUME^VPRJ
 L -^VPRPT
 S ^XTMP("VPRJVUP","vpr","complete")=1
 Q
RIDXPID(PID) ; Reindex a single patient
 N JPID,KEY
 ;
 K ^XTMP("VPRJVUP","vpr")
 D LOGMSG^VPRJ("vpr","Re-index VPR for a single patient")
 Q:'$L($G(PID))
 ;
 S JPID=$$JPID4PID^VPRJPR(PID)
 I JPID="" D LOGMSG^VPRJ("vpr","Unable to acquire JPID for PID: "_PID) Q
 ;
 L +^VPRPT(JPID,PID):$G(^VPRCONFIG("timeout","ptindex"),5) E  D LOGMSG^VPRJ("vpr","Unable to lock patient data") Q
 D CLRCODES(PID),CLREVIEW(PID),CLRCOUNT(PID)
 K ^VPRPTI(JPID,PID)
 S KEY="" F  S KEY=$O(^VPRPT(JPID,PID,KEY)) Q:KEY=""  D RIDXOBJ(PID,KEY)
 L -^VPRPT(JPID,PID)
 Q
 ;
RBLDALL ; Rebuild all patients (includes templates)
 N OK,JPID,OPID
 K ^XTMP("VPRJVUP","vpr")
 S ^XTMP("VPRJVUP","vpr","total")=$G(^VPRPTX("count","patient","patient"))
 D LOGMSG^VPRJ("vpr","Re-build VPR (including templates) for ALL patients")
 L +^VPRPT:$G(^VPRCONFIG("timeout","ptbuild"),5) E  D LOGMSG^VPRJ("vpr","Unable to lock ALL patient data") Q
 D SUSPEND^VPRJ
 D CLRINDEX(.OK) Q:'OK  ; clears VPRPTI,VPRPTX,VPRTMP
 D CLRDATA(.OK) Q:'OK   ; clears VPRPT,VPRPTJ except VPRPTJ("JSON")
 S JPID="" F  S JPID=$O(^VPRPTJ("JSON",JPID)) Q:JPID=""  D
 . ; OPID is the original PID
 . S OPID="" F  S OPID=$O(^VPRPTJ("JSON",JPID,OPID)) Q:OPID=""  D
 . . N PID,KEY
 . . ; Need to pass JPID and OPID to make sure we can get the key
 . . S PID=$$MKPID(JPID,OPID)
 . . I '$L(PID) D LOGMSG^VPRJ("vpr","Error creating PID: "_OPID) Q
 . . S KEY="" F  S KEY=$O(^VPRPTJ("JSON",JPID,OPID,KEY)) Q:KEY=""  D RBLDOBJ(PID,KEY)
 . . D LOGCNT^VPRJ("vpr")
 D RESUME^VPRJ
 L -^VPRPT
 D LOGMSG^VPRJ("vpr","VPR rebuild complete")
 S ^XTMP("VPRJVUP","vpr","complete")=1
 Q
MKPID(JPID,PID) ; create PID entries with demographics object
 N KEY,JSON,DEMOG,ERR,STAMP
 S KEY=$O(^VPRPTJ("JSON",JPID,PID,"urn:va:patient:"))
 I '$L(KEY) D SETERROR^VPRJRER(214) Q ""
 S STAMP=$O(^VPRPTJ("JSON",JPID,PID,KEY,""),-1)
 M JSON=^VPRPTJ("JSON",JPID,PID,KEY,STAMP)
 D DECODE^VPRJSON("JSON","DEMOG","ERR")
 I $D(ERR) D SETERROR^VPRJRER(202) Q ""
 Q $$UPDPT^VPRJPR(.DEMOG)
 ;
RBLDPID(PID) ; Rebuild single patient (includes templates)
 N JPID,KEY
 ;
 K ^XTMP("VPRJVUP","vpr")
 D LOGMSG^VPRJ("vpr","Re-build VPR (including templates) for a single patient")
 Q:'$L($G(PID))
 ;
 S JPID=$$JPID4PID^VPRJPR(PID)
 I JPID="" D LOGMSG^VPRJ("vpr","Unable to acquire JPID for PID: "_PID) Q
 ;
 L +^VPRPT(JPID,PID):$G(^VPRCONFIG("timeout","ptbuild"),5) E  D LOGMSG^VPRJ("vpr","Unable to lock patient data") Q
 D CLRCODES(PID),CLREVIEW(PID),CLRCOUNT(PID)
 K ^VPRPTI(JPID,PID)
 S KEY="" F  S KEY=$O(^VPRPT(JPID,PID,KEY)) Q:KEY=""  D RBLDOBJ(PID,KEY)
 L -^VPRPT(JPID,PID)
 Q
RIDXOBJ(PID,KEY) ; Re-index a single object
 N JPID,OBJECT,STAMP
 ;
 S JPID=$$JPID4PID^VPRJPR(PID)
 I JPID="" D LOGMSG^VPRJ("vpr","Unable to acquire JPID for PID: "_PID) Q
 ;
 L +^VPRPT(JPID,PID,KEY):$G(^VPRCONFIG("timeout","ptindex"),5) E  D LOGMSG^VPRJ("vpr","Unable to obtain lock for "_KEY) Q
 S STAMP=$O(^VPRPT(JPID,PID,KEY,""),-1)
 M OBJECT=^VPRPT(JPID,PID,KEY,STAMP)
 TSTART
 D INDEX^VPRJPX(PID,KEY,"",.OBJECT)
 TCOMMIT
 L -^VPRPT(JPID,PID,KEY)
 Q
RBLDOBJ(PID,KEY) ; Re-build a single object
 N LINE,JSON,STAMP
 ;
 S JPID=$$JPID4PID^VPRJPR(PID)
 I JPID="" D LOGMSG^VPRJ("vpr","Unable to acquire JPID for PID: "_PID) Q
 ;
 L +^VPRPT(JPID,PID,KEY):$G(^VPRCONFIG("timeout","ptbuild"),5) E  D LOGMSG^VPRJ("vpr","Unable to obtain lock for "_KEY) Q
 S STAMP=$O(^VPRPTJ("JSON",JPID,PID,KEY,""),-1)
 ; get the original JSON object without the templates
 S LINE=0 F  S LINE=$O(^VPRPTJ("JSON",JPID,PID,KEY,STAMP,LINE)) Q:'LINE  D
 . S JSON(LINE)=^VPRPTJ("JSON",JPID,PID,KEY,STAMP,LINE)
 ; indexes have been killed for whole patient, so remove the original object
 K ^VPRPT(JPID,PID,KEY)
 K ^VPRPTJ("JSON",JPID,PID,KEY)
 K ^VPRPTJ("TEMPLATE",JPID,PID,KEY)
 K ^VPRPTJ("KEY",KEY,PID)
 ; call save the replace the object & reset indexes
 D SAVE^VPRJPS(PID,.JSON)
 L -^VPRPT(JPID,PID,KEY)
 Q
CLRINDEX(OK) ; Clear all the indexes, preserving the "put patient" part
 ; since that is not redone with a reindex
 N PCNT
 L +^VPRPTJ("PID"):$G(^VPRCONFIG("timeout","ptclear"),5) E  D LOGMSG^VPRJ("vpr","Unable to get lock for indexes.") S OK=0 Q
 S PCNT=$G(^VPRPTX("count","patient","patient"),0)
 K ^VPRPTI,^VPRPTX,^VPRTMP
 S ^VPRPTX("count","patient","patient")=PCNT ; preserve the count
 L -^VPRPTJ("PID")
 D SETUP^VPRJPMD
 S OK=1
 Q
CLRDATA(OK) ; Clear all data except for original JSON
 L +^VPRPTJ("PID"):$G(^VPRCONFIG("timeout","ptclear"),5) E  D LOGMSG^VPRJ("vpr","Unable to get lock for data.") S OK=0 Q
 K ^VPRPT,^VPRPTJ("TEMPLATE"),^VPRPTJ("KEY"),^VPRPTJ("PID")
 K ^VPRPTX("count","patient","patient")  ; remove since total rebuild
 L -^VPRPTJ("PID")
 S OK=1
 Q
CLRCODES(PID) ; Clear the cross patient indexes for coded values
 ;remove ^VPRPTX("allCodes",code,field,PID)
 ;remove ^VPRPTX("pidCodes",PID)
 N FLD,CODE,KEY
 S FLD="" F  S FLD=$O(^VPRPTX("pidCodes",PID,FLD)) Q:FLD=""  D
 . S CODE="" F  S CODE=$O(^VPRPTX("pidCodes",PID,FLD,CODE)) Q:CODE=""  D
 . . S KEY="" F  S KEY=$O(^VPRPTX("pidCodes",PID,FLD,CODE,KEY)) Q:KEY=""  D
 . . . K ^VPRPTX("allCodes",CODE,FLD,PID,KEY)
 K ^VPRPTX("pidCodes",PID)
 Q
CLREVIEW(PID) ; Clear the cross patient indexes for re-evaluation times
 ;remove ^VPRPTX("review",reviewTime,PID)
 ;remove ^VPRPTX("pidReview",PID)
 N REVTM
 S REVTM="" F  S REVTM=$O(^VPRPTX("pidReview",PID,REVTM)) Q:REVTM=""  D
 . K ^VPRPTX("review",REVTM,PID)
 K ^VPRPTX("pidReview",PID)
 Q
CLRCOUNT(PID) ; Decrement the cross-patient totals for a patient
 ;reduce ^VPRPTX("count","collection",topic)
 ;    by ^VPRPTI(PID,"tally","collection",topic)
 ;reduce ^VPRPTX("count","domain",topic)
 ;    by ^VPRPTI(PID,"tally","domain",topic)
 N GROUP,TOPIC,CNT4PID,CNT4ALL,JPID ; decrement the relevant counts
 ;
 S JPID=$$JPID4PID^VPRJPR(PID)
 I JPID="" D SETERROR^VPRJRER(222,"Identifier "_PID) Q
 ;
 F GROUP="collection","domain" I $D(^VPRPTI(JPID,PID,"tally",GROUP)) D
 . S TOPIC="" F  S TOPIC=$O(^VPRPTI(JPID,PID,"tally",GROUP,TOPIC)) Q:TOPIC=""  D
 . . S CNT4PID=+$G(^VPRPTI(JPID,PID,"tally",GROUP,TOPIC))
 . . L +^VPRPTX("count",GROUP,TOPIC):$G(^VPRCONFIG("timeout","ptclear"),5) E  D SETERROR^VPRJRER(502,GROUP_" "_NAME) Q
 . . S CNT4ALL=+$G(^VPRPTX("count",GROUP,TOPIC))
 . . S ^VPRPTX("count",GROUP,TOPIC)=CNT4ALL-CNT4PID ; decr count across patients
 . . L -^VPRPTX("count",GROUP,TOPIC)
 Q
CLRXIDX(PID) ; remove cross-patient indexes for a patient
 N KEY,OLDOBJ,JPID
 ;
 S JPID=$$JPID4PID^VPRJPR(PID)
 I JPID="" D SETERROR^VPRJRER(222,"Identifier "_PID) Q
 ;
 S KEY="" F  S KEY=$O(^VPRPT(JPID,PID,KEY)) Q:'$L(KEY)  D
 . L +^VPRPT(JPID,PID,KEY):$G(^VPRCONFIG("timeout","ptclear"),5) E  D SETERROR^VPRJRER(502,PID_">  "_KEY) Q
 . M OLDOBJ=^VPRPT(JPID,PID,KEY)
 . D CLRXONE(PID,KEY,.OLDOBJ)
 . L -^VPRPT(JPID,PID,KEY)
 Q
CLRXONE(PID,KEY,OLDOBJ) ; Clear cross-patient indexes for this key
 N IDXCOLL,IDXNAME,NEWOBJ
 ; Currently assuming UID is urn:va:type:vistaAccount:localId...
 ; For example:  urn:va:med:93EF:34014
 S IDXCOLL=$P(KEY,":",3),NEWOBJ=""
 S IDXNAME="" F  S IDXNAME=$O(^VPRMETA("collection",IDXCOLL,"index",IDXNAME)) Q:IDXNAME=""  D
 . I ^VPRMETA("index",IDXNAME,"common","method")'="xattr" QUIT
 . N IDXMETA
 . M IDXMETA=^VPRMETA("index",IDXNAME,"collection",IDXCOLL)
 . S IDXMETA("setif")=$G(^VPRMETA("index",IDXNAME,"common","setif"))
 . S IDXMETA("review")=$G(^VPRMETA("index",IDXNAME,"common","review"))
 . S IDXMETA("levels")=$G(^VPRMETA("index",IDXNAME,"common","levels"))
 . S IDXMETA("method")=^VPRMETA("index",IDXNAME,"common","method")
 . D XATTR^VPRJPXA
 Q
STATUS(PID) ; Show VPR status for a patient
 N JPID
 S JPID=$$JPID4PID^VPRJPR($G(PID))
 ;
 I $L($G(PID)),JPID'="" D
 . W !,"For PID ",PID," --"
 . W !,?4,"Index Nodes: ",$$NODECNT("^VPRPTI("""_JPID_""","""_PID_""")")
 . W !,?4," Data Nodes: ",$$NODECNT("^VPRPT("""_JPID_""","""_PID_""")")
 . W !,?4,"Object Counts --"
 . W !,?8,"    Domain: ",$$ITEMCNT("domain",PID)
 . W !,?8,"Collection: ",$$ITEMCNT("collection",PID)
 . W !,?8,"     UID's: ",$$OBJCNT(PID)
 . W !,?4,"Code Refs: ",$$NODECNT("^VPRPTX(""pidCodes"","""_PID_""")")
 E  D
 . W !,"VPR Totals --"
 . W !,?4,"Patients: ",$$PTCNT()
 . W !,?4,"Index Nodes: ",$$NODECNT("^VPRPTI")
 . W !,?4," Data Nodes: ",$$NODECNT("^VPRPT")
 . W !,?4,"Object Counts --"
 . W !,?8,"    Domain: ",$$ITEMCNT("domain")
 . W !,?8,"Collection: ",$$ITEMCNT("collection")
 . W !,?8,"     UID's: ",$$OBJCNT()
 . W !,?4,"  Code Refs: ",$$NODECNT("^VPRPTX(""allCodes"")")
 . W !,?4,"Review Refs: ",$$NODECNT("^VPRPTX(""review"")")
 Q
PTCNT() ; Return the number of patients in the VPR
 N PID,COUNT,JPID
 S PID="",COUNT=0,JPID=""
 F  S JPID=$O(^VPRPT(JPID)) Q:'$L(JPID)  D
 . F  S PID=$O(^VPRPT(JPID,PID)) Q:'$L(PID)  S COUNT=COUNT+1
 Q COUNT
 ;
NODECNT(ROOT) ; Return the number of nodes for ROOT
 N X,COUNT
 S X=ROOT,COUNT=0
 I $E(ROOT,$L(ROOT))=")" S ROOT=$E(ROOT,1,$L(ROOT)-1)
 F  S X=$Q(@X) Q:$E(X,1,$L(ROOT))'=ROOT  S COUNT=COUNT+1
 Q COUNT
 ;
ITEMCNT(GROUP,PID) ; Return the item count for a group
 ; PID is optional, if absent, entire VPR is counted
 N COUNT,TOPIC,JPID
 S COUNT=0
 ;
 S JPID=$$JPID4PID^VPRJPR($G(PID))
 ;
 I $L($G(PID)),JPID'="" D
 . S TOPIC="" F  S TOPIC=$O(^VPRPTI(JPID,PID,"tally",GROUP,TOPIC)) Q:TOPIC=""  D
 . . S COUNT=COUNT+^VPRPTI(JPID,PID,"tally",GROUP,TOPIC)
 E  D
 . S TOPIC="" F  S TOPIC=$O(^VPRPTX("count",GROUP,TOPIC)) Q:TOPIC=""  D
 . . S COUNT=COUNT+^VPRPTX("count",GROUP,TOPIC)
 Q COUNT
 ;
OBJCNT(PID) ; Return a count of objects by UID
 ; PID is optional, if absent, entire VPR is counted
 N COUNT,UID,JPID
 ;
 S JPID=$$JPID4PID^VPRJPR($G(PID))
 ;
 S COUNT=0
 I $L($G(PID)),JPID'="" D
 . S UID="" F  S UID=$O(^VPRPT(JPID,PID,UID)) Q:UID=""  S COUNT=COUNT+1
 E  D
 . F  S JPID=$O(^VPRPT(JPID)) Q:'$L(JPID)  D
 . . S PID="" F  S PID=$O(^VPRPT(JPID,PID)) Q:'$L(PID)  D
 . . . S UID="" F  S UID=$O(^VPRPT(JPID,PID,UID)) Q:UID=""  S COUNT=COUNT+1
 Q COUNT
 ;
KILLDB ; -- Delete and reset the globals for the database
 K ^VPRHTTP("log")
 K ^VPRPT
 K ^VPRPTJ
 K ^VPRPTI
 K ^VPRPTX
 K ^VPRTMP
 K ^VPRMETA
 K ^VPRJOB
 K ^VPRSTATUS
 K ^VPRSTATUSOD
 K ^VPRJSES
 K ^VPRJODM
 D SETUP^VPRJPMD
 Q
ASKPID() ; Return PID after prompting for it
 N PID,KEY,JPID
 ;
 S PID=$$PROMPT^VPRJ1("PID","","","Enter the PID for a patient.")
 Q:PID="" PID
 S JPID=$$JPID4PID^VPRJPR(PID)
 I JPID="" W !,"Unable to acquire JPID for PID: "_PID Q PID
 I '$D(^VPRPT(JPID,PID)) W !,"PID "_PID_" not found." S PID=""
 Q PID
 ;
