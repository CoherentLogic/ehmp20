VPRJGC ;KRM/CJE -- Handle Garbage Collection operations ; 04/13/2015
 ;;1.0;JSON DATA STORE;;APR 13, 2015
 ; No entry from top
 Q
 ;
SITE(RESULT,ARGS)
 Q
 ;
DATA(RESULT,ARGS)
 N SITE,SYNCSTATUS,OPDGCD
 ; Ensure only known arguments are passed
 I $$UNKARGS^VPRJCU(.ARGS,"site") Q
 ; Loop through sites if the site is blank
 S SITE=""
 ; If a site is passed quit the loop below when found
 S OPDGCD=0
 ; Order through the SyncStatus global for operational data as that
 ; is the only place where a list of sites is easily found
 F  S SITE=$O(^VPRSTATUSOD(SITE)) Q:SITE=""  Q:OPDGCD  D
 . ; If we were passed a site only GC for that site
 . I $G(ARGS("site")) I SITE'=ARGS("site") Q
 . ; If we have a site and the current site matches signal loop to quit next time
 . I $G(ARGS("site")) I SITE=ARGS("site") S OPDGCD=1
 . ; Get the sync status
 . S SYNCSTATUS=$NA(^TMP($J,"SYNCSTATUSO"))
 . D DATA^VPRJDSTATUS(SYNCSTATUS,SITE)
 . ; Collect the garbage
 . J GCDATA(SITE,SYNCSTATUS)
 Q
 ;
PAT(RESULT,ARGS)
 N ID,JPID,ID,PID,PIDS,PTGCD,GCPID
 ; Ensure only known arguments are passed
 I $$UNKARGS^VPRJCU(.ARGS,"id") Q
 ; Loop through the PIDs if ID is blank
 S (JPID,PID)=""
 ; If a patient identifier is passed quit the loop below when found
 S PTGCD=0
 F  S JPID=$O(^VPRPTJ("JSON",JPID)) Q:JPID=""  Q:PTGCD  D
 . F  S PID=$O(^VPRPTJ("JSON",JPID,PID)) Q:PID=""  Q:PTGCD  D
 . . ; If we have a patient identifier and the current pid doesn't match quit
 . . I $G(ARGS("id")) I PID'=ARGS("id") Q
 . . ; If we have a patient identifier and the current pid matches signal loop to quit next time
 . . I $G(ARGS("id")) I PID=ARGS("id") S PTGCD=1
 . . ; Get all PIDs for JPID
 . . D PID4JPID^VPRJPR(.PIDS,JPID)
 . . ; Loop through all patient identifiers
 . . S ID=""
 . . F  S ID=$O(PIDS(ID)) Q:ID=""  D
 . . . S GCPID=PIDS(ID)
 . . . ; Get the sync status
 . . . N SYNCSTATUS S SYNCSTATUS=$NA(^TMP($J,"SYNCSTATUSP"))
 . . . D PATIENT^VPRJPSTATUS(SYNCSTATUS,GCPID)
 . . . ; Collect the garbage
 . . . J GCPAT(GCPID,SYNCSTATUS)
 Q
 ;
GCDATA(SITE,STATUS)
 N UID,SOURCESTAMP
 ; Ensure SITE is defined
 I '$L(SITE) Q
 ; Loop through all collections
 S UID="urn:va:"
 F  S UID=$O(^VPRJD(UID)) Q:UID=""  D
 . ; Check to see if we only want to garbage collect for a given site
 . I $P(UID,":",4)'=SITE Q
 . ; Get current stamp
 . N STAMP,OLDSTAMP
 . S STAMP=$O(^VPRJD(UID,""),-1) Q:STAMP=""
 . ; If no metastamp exists don't garbage collect
 . I '$G(^VPRSTATUSOD(SITE,"stampTime")) Q
 . ; If the current metastamp isn't complete don't delete the previous versions of the object
 . I $G(@STATUS@("completedStamp","sourceMetaStamp",SITE,"syncCompleted"))'="true" Q
 . ; Set OLDSTAMP to current STAMP to see if there are older objects than the current
 . S OLDSTAMP=STAMP
 . F  S OLDSTAMP=$O(^VPRJD(UID,OLDSTAMP),-1) Q:OLDSTAMP=""  D
 . . ; Previous object versions found
 . . ; Delete previous version of object
 . . K ^VPRJD(UID,OLDSTAMP)
 . . ; Delete previous version of JSON string
 . . K ^VPRJDJ("JSON",UID,OLDSTAMP)
 Q
 ;
GCPAT(PID,STATUS,SITE)
 N UID,SOURCESTAMP,JPID
 ; Ensure PID is defined
 I '$L(PID) Q
 ;
 S JPID=$$JPID4PID^VPRJPR(PID)
 I JPID="" Q
 ;
 ; Loop through all collections
 S UID="urn:va:"
 F  S UID=$O(^VPRPT(JPID,PID,UID)) Q:UID=""  D
 . ; Check to see if we only want to garbage collect for a given site
 . I $G(SITE)'="",$P(UID,":",4)'=SITE Q
 . ; Get current stamp
 . N STAMP,OLDSTAMP
 . S STAMP=$O(^VPRPT(JPID,PID,UID,""),-1) Q:STAMP=""
 . ; Get the latest metastamp
 . S SOURCESTAMP=$O(^VPRSTATUS(JPID,PID,$P(PID,";",1),""),-1)
 . ; If no metastamp exists don't garbage collect
 . I '$G(^VPRSTATUS(JPID,PID,$P(PID,";",1),"stampTime")) Q
 . ; Is the current object part of a completed stamp
 . ; If it isn't complete don't delete the previous versions of the object
 . I $G(@STATUS@("completedStamp","sourceMetaStamp",$P(PID,";",1),"syncCompleted"))'="true" Q
 . ; Set OLDSTAMP to current STAMP to see if there are older objects than the current
 . S OLDSTAMP=STAMP
 . F  S OLDSTAMP=$O(^VPRPT(JPID,PID,UID,OLDSTAMP),-1) Q:OLDSTAMP=""  D
 . . ; Previous object versions found
 . . ; Delete previous version of object
 . . K ^VPRPT(JPID,PID,UID,OLDSTAMP)
 . . ; Delete previous version of JSON string
 . . K ^VPRPTJ("JSON",JPID,PID,UID,OLDSTAMP)
 . . ; Delete previous version of the KEY
 . . K ^VPRPTJ("KEY",UID,PID,OLDSTAMP)
 Q
 ;
