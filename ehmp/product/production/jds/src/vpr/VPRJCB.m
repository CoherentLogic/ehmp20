VPRJCB ;SLC/KCM -- Common Utilities for building query results
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
BLDHEAD(CNT) ; Build the object header
 N X,UPDATED
 S UPDATED=$$CURRTIME^VPRJRUT
 S X="{""apiVersion"":""1.0"",""data"":{""updated"":"_UPDATED_","
 S X=X_"""totalItems"":"_CNT_",""items"":["
 Q X
 ;
STAGE(X) ; appends to BUFFER until OUT writes it
 S BUFFER=BUFFER_X
 I $L(BUFFER)'<4000 D OUT
 Q
OUT(X) ; write out a frame of data
 S BUFFER("LINES")=$G(BUFFER("LINES"),0)+1
 S ^TMP($J,BUFFER("LINES"))=BUFFER,BUFFER=""
 Q
BUILD ; Build the return records in the proper sort order
 ; Expects:  ORDER, TEMPLATE
 Q:+$G(HTTPERR)>0
 N KEY,KINST,SORT,RECNUM,JPID,LASTTIME
 ; Set time this patient has been accessed for filtering
 S JPID=$$JPID4PID^VPRJPR($G(PID))
 I JPID="" S JPID=$$JPID4PID^VPRJPR($G(ARGS("pid")))
 I JPID'="",$$ISJPID^VPRJPR(JPID),$G(HTTPREQ("store"))="vpr" D
 . S LASTTIME=$$CURRTIME^VPRJRUT
 . S ^VPRMETA("JPID",JPID,"lastAccessTime")=LASTTIME
 ;
 S RECNUM=$G(^TMP($J,"total"))-1 ; ^TMP($J,"total") exists for index queries
 ; case
 I ORDER(0)=0 D  G X0
 . S KEY="" F  S KEY=$O(^TMP("VPRDATA",$J,KEY)) Q:KEY=""  D
 . . S KINST="" F  S KINST=$O(^TMP("VPRDATA",$J,KEY,KINST)) Q:KINST=""  D ADDOBJ(^(KINST))
 I ORDER(0)=1 D  G X0
 . S SORT(1)="" F  S SORT(1)=$O(^TMP("VPRDATA",$J,SORT(1)),ORDER(1,"dir")) Q:SORT(1)=""  D
 . . S KEY="" F  S KEY=$O(^TMP("VPRDATA",$J,SORT(1),KEY)) Q:KEY=""  D
 . . . S KINST="" F  S KINST=$O(^TMP("VPRDATA",$J,SORT(1),KEY,KINST)) Q:KINST=""  D ADDOBJ(^(KINST))
 I ORDER(0)=2 D  G X0
 . S SORT(1)="" F  S SORT(1)=$O(^TMP("VPRDATA",$J,SORT(1)),ORDER(1,"dir")) Q:SORT(1)=""  D
 . . S SORT(2)="" F  S SORT(2)=$O(^TMP("VPRDATA",$J,SORT(1),SORT(2)),ORDER(2,"dir")) Q:SORT(2)=""  D
 . . . S KEY="" F  S KEY=$O(^TMP("VPRDATA",$J,SORT(1),SORT(2),KEY)) Q:KEY=""  D
 . . . . S KINST="" F  S KINST=$O(^TMP("VPRDATA",$J,SORT(1),SORT(2),KEY,KINST)) Q:KINST=""  D ADDOBJ(^(KINST))
 I ORDER(0)=3 D  G X0
 . S SORT(1)="" F  S SORT(1)=$O(^TMP("VPRDATA",$J,SORT(1)),ORDER(1,"dir")) Q:SORT(1)=""  D
 . . S SORT(2)="" F  S SORT(2)=$O(^TMP("VPRDATA",$J,SORT(1),SORT(2)),ORDER(2,"dir")) Q:SORT(2)=""  D
 . . . S SORT(3)="" F  S SORT(3)=$O(^TMP("VPRDATA",$J,SORT(1),SORT(2),SORT(3)),ORDER(3,"dir")) Q:SORT(3)=""  D
 . . . . S KEY="" F  S KEY=$O(^TMP("VPRDATA",$J,SORT(1),SORT(2),SORT(3),KEY)) Q:KEY=""  D
 . . . . . S KINST="" F  S KINST=$O(^TMP("VPRDATA",$J,SORT(1),SORT(2),SORT(3),KEY,KINST)) Q:KINST=""  D ADDOBJ(^(KINST))
 I ORDER(0)=4 D  G X0
 . S SORT(1)="" F  S SORT(1)=$O(^TMP("VPRDATA",$J,SORT(1)),ORDER(1,"dir")) Q:SORT(1)=""  D
 . . S SORT(2)="" F  S SORT(2)=$O(^TMP("VPRDATA",$J,SORT(1),SORT(2)),ORDER(2,"dir")) Q:SORT(2)=""  D
 . . . S SORT(3)="" F  S SORT(3)=$O(^TMP("VPRDATA",$J,SORT(1),SORT(2),SORT(3)),ORDER(3,"dir")) Q:SORT(3)=""  D
 . . . . S SORT(4)="" F  S SORT(4)=$O(^TMP("VPRDATA",$J,SORT(1),SORT(2),SORT(3),SORT(4)),ORDER(4,"dir")) Q:SORT(4)=""  D
 . . . . . S KEY="" F  S KEY=$O(^TMP("VPRDATA",$J,SORT(1),SORT(2),SORT(3),SORT(4),KEY)) Q:KEY=""  D
 . . . . . . S KINST="" F  S KINST=$O(^TMP("VPRDATA",$J,SORT(1),SORT(2),SORT(3),SORT(4),KEY,KINST)) Q:KINST=""  D ADDOBJ(^(KINST))
 I ORDER(0)=5 D  G X0
 . S SORT(1)="" F  S SORT(1)=$O(^TMP("VPRDATA",$J,SORT(1)),ORDER(1,"dir")) Q:SORT(1)=""  D
 . . S SORT(2)="" F  S SORT(2)=$O(^TMP("VPRDATA",$J,SORT(1),SORT(2)),ORDER(2,"dir")) Q:SORT(2)=""  D
 . . . S SORT(3)="" F  S SORT(3)=$O(^TMP("VPRDATA",$J,SORT(1),SORT(2),SORT(3)),ORDER(3,"dir")) Q:SORT(3)=""  D
 . . . . S SORT(4)="" F  S SORT(4)=$O(^TMP("VPRDATA",$J,SORT(1),SORT(2),SORT(3),SORT(4)),ORDER(4,"dir")) Q:SORT(4)=""  D
 . . . . . S SORT(5)="" F  S SORT(5)=$O(^TMP("VPRDATA",$J,SORT(1),SORT(2),SORT(3),SORT(4),SORT(5)),ORDER(5,"dir")) Q:SORT(5)=""  D
 . . . . . . S KEY="" F  S KEY=$O(^TMP("VPRDATA",$J,SORT(1),SORT(2),SORT(3),SORT(4),SORT(5),KEY)) Q:KEY=""  D
 . . . . . . . S KINST="" F  S KINST=$O(^TMP("VPRDATA",$J,SORT(1),SORT(2),SORT(3),SORT(4),SORT(5),KEY,KINST)) Q:KINST=""  D ADDOBJ(^(KINST))
 I ORDER(0)=6 D  G X0
 . S SORT(1)="" F  S SORT(1)=$O(^TMP("VPRDATA",$J,SORT(1)),ORDER(1,"dir")) Q:SORT(1)=""  D
 . . S SORT(2)="" F  S SORT(2)=$O(^TMP("VPRDATA",$J,SORT(1),SORT(2)),ORDER(2,"dir")) Q:SORT(2)=""  D
 . . . S SORT(3)="" F  S SORT(3)=$O(^TMP("VPRDATA",$J,SORT(1),SORT(2),SORT(3)),ORDER(3,"dir")) Q:SORT(3)=""  D
 . . . . S SORT(4)="" F  S SORT(4)=$O(^TMP("VPRDATA",$J,SORT(1),SORT(2),SORT(3),SORT(4)),ORDER(4,"dir")) Q:SORT(4)=""  D
 . . . . . S SORT(5)="" F  S SORT(5)=$O(^TMP("VPRDATA",$J,SORT(1),SORT(2),SORT(3),SORT(4),SORT(5)),ORDER(5,"dir")) Q:SORT(5)=""  D
 . . . . . . S SORT(6)="" F  S SORT(6)=$O(^TMP("VPRDATA",$J,SORT(1),SORT(2),SORT(3),SORT(4),SORT(5),SORT(6)),ORDER(6,"dir")) Q:SORT(6)=""  D
 . . . . . . . S KEY="" F  S KEY=$O(^TMP("VPRDATA",$J,SORT(1),SORT(2),SORT(3),SORT(4),SORT(5),SORT(6),KEY)) Q:KEY=""  D
 . . . . . . . . S KINST="" F  S KINST=$O(^TMP("VPRDATA",$J,SORT(1),SORT(2),SORT(3),SORT(4),SORT(5),SORT(6),KEY,KINST)) Q:KINST=""  D ADDOBJ(^(KINST))
 I ORDER(0)=7 D  G X0
 . S SORT(1)="" F  S SORT(1)=$O(^TMP("VPRDATA",$J,SORT(1)),ORDER(1,"dir")) Q:SORT(1)=""  D
 . . S SORT(2)="" F  S SORT(2)=$O(^TMP("VPRDATA",$J,SORT(1),SORT(2)),ORDER(2,"dir")) Q:SORT(2)=""  D
 . . . S SORT(3)="" F  S SORT(3)=$O(^TMP("VPRDATA",$J,SORT(1),SORT(2),SORT(3)),ORDER(3,"dir")) Q:SORT(3)=""  D
 . . . . S SORT(4)="" F  S SORT(4)=$O(^TMP("VPRDATA",$J,SORT(1),SORT(2),SORT(3),SORT(4)),ORDER(4,"dir")) Q:SORT(4)=""  D
 . . . . . S SORT(5)="" F  S SORT(5)=$O(^TMP("VPRDATA",$J,SORT(1),SORT(2),SORT(3),SORT(4),SORT(5)),ORDER(5,"dir")) Q:SORT(5)=""  D
 . . . . . . S SORT(6)="" F  S SORT(6)=$O(^TMP("VPRDATA",$J,SORT(1),SORT(2),SORT(3),SORT(4),SORT(5),SORT(6)),ORDER(6,"dir")) Q:SORT(6)=""  D
 . . . . . . . S SORT(7)="" F  S SORT(7)=$O(^TMP("VPRDATA",$J,SORT(1),SORT(2),SORT(3),SORT(4),SORT(5),SORT(6),SORT(7)),ORDER(7,"dir")) Q:SORT(7)=""  D
 . . . . . . . . S KEY="" F  S KEY=$O(^TMP("VPRDATA",$J,SORT(1),SORT(2),SORT(3),SORT(4),SORT(5),SORT(6),SORT(7),KEY)) Q:KEY=""  D
 . . . . . . . . . S KINST="" F  S KINST=$O(^TMP("VPRDATA",$J,SORT(1),SORT(2),SORT(3),SORT(4),SORT(5),SORT(6),SORT(7),KEY,KINST)) Q:KINST=""  D ADDOBJ(^(KINST))
X0 ; end case
 S ^TMP($J,"total")=RECNUM+1 ; add 1 since RECNUM is 0 based
 S ^TMP($J,"template")=TEMPLATE
 Q
 ;
ADDOBJ(VAL) ; add object/template in sequence to the return list
 ; the default is to filter out HDR data, unless:
 ;   the HDR data does not have associated primary site data
 ; and
 ;   the HDR data isn't called explicitly from a REST endpoint
 ; flags HDR data for inclusion if the only other associated data is also HDR
 N JPID,LASTTIME
 N ADDFLG,PATID S ADDFLG=0
 I VAL'["HDR" S ADDFLG=1 ; add all non-HDR data to the return list
 E  I $O(^VPRPTJ("KEY",KEY,VAL))="",$O(^VPRPTJ("KEY",KEY,VAL),-1)="" S ADDFLG=1
 E  I $G(HTTPARGS("pid"))["HDR" S ADDFLG=1
 E  S PATID="",ADDFLG=1 D
 . F  S PATID=$O(^VPRPTJ("KEY",KEY,PATID)) Q:PATID=""  S:PATID'["HDR" ADDFLG=0
 ; adds HDR data if no associated primary data was ever found, using ADDFLG
 I ADDFLG D
 . S RECNUM=RECNUM+1
 . S ^TMP($J,"data",RECNUM,KEY,KINST)=VAL ; right now the VAL is just the PID
 Q
