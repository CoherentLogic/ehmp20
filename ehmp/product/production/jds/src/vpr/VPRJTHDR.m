VPRJTHDR ;KRM/CJE -- Integration tests for Patient Data and HDR
 ;;1.0;JSON DATA STORE;;May 05, 2015
 ;
STARTUP  ; Run once before all tests
 N I,TAGS
 F I=1:1:5 S TAGS(I)="MED"_I_"^VPRJTP02"
 D BLDPT^VPRJTX(.TAGS)
 Q
SHUTDOWN ; Run once after all tests
 D CLRPT^VPRJTX
 K ^VPRPTJ
 K ^VPRPT
 K ^VPRMETA("JPID")
 K ^TMP
 Q
SETUP    ; Run before each test
 K HTTPREQ,HTTPERR,HTTPRSP
 N I,TAGS
 F I=1:1:5 S TAGS(I)="MED"_I_"^VPRJTP02"
 D BLDPT^VPRJTX(.TAGS)
 Q
TEARDOWN ; Run after each test
 K HTTPREQ,HTTPERR,HTTPRSP
 D CLRPT^VPRJTX
 K ^VPRPTJ
 K ^VPRPT
 K ^VPRMETA("JPID")
 K ^TMP
 Q
ASSERT(EXPECT,ACTUAL,MSG) ; convenience
 D EQ^VPRJT(EXPECT,ACTUAL,$G(MSG))
 Q
 ;
GETUID ;; @TEST getting an object by UID only
 N JSON,ERR,HTTPERR,PTIME,TIME,VPRJPID
 ; The hang commands are necessary to ensure subsequent accesses on the lastAccessTime node don't happen within the same second
 S VPRJPID=$$JPID4PID^VPRJPR(VPRJTPID)
 D ASSERT(1,$G(VPRJPID)'="","JPID doesn't exist for this patient")
 I $G(VPRJPID)="" QUIT
 D ASSERT(1,$D(^VPRMETA("JPID",VPRJPID,"lastAccessTime")),"lastAccessTime doesn't exist for this patient")
 S TIME=^VPRMETA("JPID",VPRJPID,"lastAccessTime")
 H 1
 ; Add primary site data
 D SETPUT^VPRJTX("/vpr/"_VPRJTPID,"MED6","VPRJTP02")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 K HTTPERR
 ; Get primary site data
 D SETGET^VPRJTX("/vpr/uid/urn:va:med:93EF:-7:15231")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 K HTTPERR
 S PTIME=TIME
 H 1
 S TIME=$G(^VPRMETA("JPID",VPRJPID,"lastAccessTime"))
 D ASSERT(1,TIME>PTIME)
 D DATA2ARY^VPRJTX(.JSON)
 D ASSERT("TAKE ONE TABLET BY BY MOUTH TWICE A DAY",$G(JSON("data","items",1,"sig")))
 ; Add HDR site data
 D SETPUT^VPRJTX("/vpr/"_VPRJTPID,"MED6HDR1","VPRJTP02")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 K HTTPERR
 ; Get primary site data
 D SETGET^VPRJTX("/vpr/uid/urn:va:med:93EF:-7:15231")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 S PTIME=TIME
 H 1
 S TIME=$G(^VPRMETA("JPID",VPRJPID,"lastAccessTime"))
 D ASSERT(1,TIME>PTIME)
 K HTTPERR,JSON
 D DATA2ARY^VPRJTX(.JSON)
 D ASSERT("TAKE ONE TABLET BY BY MOUTH TWICE A DAY",$G(JSON("data","items",1,"sig")))
 Q
GETUIDR ;; @TEST getting an object by UID only (HDR then Primary Site)
 N JSON,ERR,HTTPERR,PTIME,TIME,VPRJPID
 ; The hang commands are necessary to ensure subsequent accesses on the lastAccessTime node don't happen within the same second
 S VPRJPID=$$JPID4PID^VPRJPR(VPRJTPID)
 D ASSERT(1,$G(VPRJPID)'="","JPID doesn't exist for this patient")
 I $G(VPRJPID)="" QUIT
 D ASSERT(1,$D(^VPRMETA("JPID",VPRJPID,"lastAccessTime")),"lastAccessTime doesn't exist for this patient")
 S TIME=^VPRMETA("JPID",VPRJPID,"lastAccessTime")
 H 1
 ; Add HDR site data
 D SETPUT^VPRJTX("/vpr/1HDR;-777V123777","MED6HDR1","VPRJTP02")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 K HTTPERR
 ; Get HDR site data
 D SETGET^VPRJTX("/vpr/uid/urn:va:med:93EF:-7:15231")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 K HTTPERR
 S PTIME=TIME
 H 1
 S TIME=$G(^VPRMETA("JPID",VPRJPID,"lastAccessTime"))
 D ASSERT(1,TIME>PTIME)
 D DATA2ARY^VPRJTX(.JSON)
 D ASSERT("HDR TAKE ONE TABLET BY BY MOUTH TWICE A DAY",$G(JSON("data","items",1,"sig")))
 ; Add primary site data
 D SETPUT^VPRJTX("/vpr/93EF;-7","MED6","VPRJTP02")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 K HTTPERR
 ; Get primary site data
 D SETGET^VPRJTX("/vpr/uid/urn:va:med:93EF:-7:15231")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 S PTIME=TIME
 H 1
 S TIME=$G(^VPRMETA("JPID",VPRJPID,"lastAccessTime"))
 D ASSERT(1,TIME>PTIME)
 K HTTPERR,JSON
 D DATA2ARY^VPRJTX(.JSON)
 D ASSERT("TAKE ONE TABLET BY BY MOUTH TWICE A DAY",$G(JSON("data","items",1,"sig")))
 Q
GETOBJ ;; @TEST getting an object by PID & UID
 N JSON,ERR,HTTPERR,PTIME,TIME,VPRJPID
 ; The hang commands are necessary to ensure subsequent accesses on the lastAccessTime node don't happen within the same second
 S VPRJPID=$$JPID4PID^VPRJPR(VPRJTPID)
 D ASSERT(1,$G(VPRJPID)'="","JPID doesn't exist for this patient")
 I $G(VPRJPID)="" QUIT
 D ASSERT(1,$D(^VPRMETA("JPID",VPRJPID,"lastAccessTime")),"lastAccessTime doesn't exist for this patient")
 S TIME=^VPRMETA("JPID",VPRJPID,"lastAccessTime")
 H 1
 ; Add primary site data
 D SETPUT^VPRJTX("/vpr/"_VPRJTPID,"MED6","VPRJTP02")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 K HTTPERR
 ; Get primary site data
 D SETGET^VPRJTX("/vpr/93EF;-7/urn:va:med:93EF:-7:15231")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D ASSERT(1,$D(^VPRMETA("JPID",VPRJPID,"lastAccessTime")))
 K HTTPERR
 S PTIME=TIME
 H 1
 S TIME=$G(^VPRMETA("JPID",VPRJPID,"lastAccessTime"))
 D ASSERT(1,TIME>PTIME)
 D DATA2ARY^VPRJTX(.JSON)
 D ASSERT("TAKE ONE TABLET BY BY MOUTH TWICE A DAY",$G(JSON("data","items",1,"sig")))
 ; Add HDR site data
 D SETPUT^VPRJTX("/vpr/"_VPRJTPID,"MED6HDR1","VPRJTP02")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 K HTTPERR
 ; Get HDR site data
 D SETGET^VPRJTX("/vpr/1HDR;-777V123777/urn:va:med:93EF:-7:15231")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D ASSERT(1,$D(^VPRMETA("JPID",VPRJPID,"lastAccessTime")))
 S PTIME=TIME
 H 1
 S TIME=$G(^VPRMETA("JPID",VPRJPID,"lastAccessTime"))
 D ASSERT(1,TIME>PTIME)
 K HTTPERR,JSON
 D DATA2ARY^VPRJTX(.JSON)
 D ASSERT("HDR TAKE ONE TABLET BY BY MOUTH TWICE A DAY",$G(JSON("data","items",1,"sig")))
 Q
GETOBJR ;; @TEST getting an object by PID & UID (HDR then Primary Site)
 N JSON,ERR,HTTPERR,PTIME,TIME,VPRJPID
 ; The hang commands are necessary to ensure subsequent accesses on the lastAccessTime node don't happen within the same second
 S VPRJPID=$$JPID4PID^VPRJPR(VPRJTPID)
 D ASSERT(1,$G(VPRJPID)'="","JPID doesn't exist for this patient")
 I $G(VPRJPID)="" QUIT
 D ASSERT(1,$D(^VPRMETA("JPID",VPRJPID,"lastAccessTime")),"lastAccessTime doesn't exist for this patient")
 S TIME=^VPRMETA("JPID",VPRJPID,"lastAccessTime")
 H 1
 ; Add HDR site data
 D SETPUT^VPRJTX("/vpr/"_VPRJTPID,"MED6HDR1","VPRJTP02")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 K HTTPERR
 ; Get HDR site data
 D SETGET^VPRJTX("/vpr/1HDR;-777V123777/urn:va:med:93EF:-7:15231")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 D ASSERT(1,$D(^VPRMETA("JPID",VPRJPID,"lastAccessTime")))
 K HTTPERR
 S PTIME=TIME
 H 1
 S TIME=$G(^VPRMETA("JPID",VPRJPID,"lastAccessTime"))
 D ASSERT(1,TIME>PTIME)
 D DATA2ARY^VPRJTX(.JSON)
 D ASSERT("HDR TAKE ONE TABLET BY BY MOUTH TWICE A DAY",$G(JSON("data","items",1,"sig")))
 ; Add primary site data
 D SETPUT^VPRJTX("/vpr/"_VPRJTPID,"MED6","VPRJTP02")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 K HTTPERR
 ; Get primary site data
 D SETGET^VPRJTX("/vpr/93EF;-7/urn:va:med:93EF:-7:15231")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 S PTIME=TIME
 H 1
 S TIME=$G(^VPRMETA("JPID",VPRJPID,"lastAccessTime"))
 D ASSERT(1,TIME>PTIME)
 K HTTPERR,JSON
 D DATA2ARY^VPRJTX(.JSON)
 D ASSERT("TAKE ONE TABLET BY BY MOUTH TWICE A DAY",$G(JSON("data","items",1,"sig")))
 Q
DELUID ;; @TEST deleting an object with primary and HDR data by UID
 N JSON,ERR,HTTPERR,PTIME,TIME,VPRJPID
 ; The hang commands are necessary to ensure subsequent accesses on the lastAccessTime node don't happen within the same second
 S VPRJPID=$$JPID4PID^VPRJPR(VPRJTPID)
 D ASSERT(1,$G(VPRJPID)'="","JPID doesn't exist for this patient")
 I $G(VPRJPID)="" QUIT
 D ASSERT(1,$D(^VPRMETA("JPID",VPRJPID,"lastAccessTime")),"lastAccessTime doesn't exist for this patient")
 S TIME=^VPRMETA("JPID",VPRJPID,"lastAccessTime")
 H 1
 ; Add primary site data
 D SETPUT^VPRJTX("/vpr/"_VPRJTPID,"MED6","VPRJTP02")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 K HTTPERR
 ; Add HDR site data
 D SETPUT^VPRJTX("/vpr/"_VPRJTPID,"MED6HDR1","VPRJTP02")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 K HTTPERR
 ; Delete data
 D SETDEL^VPRJTX("/vpr/uid/urn:va:med:93EF:-7:15231")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 ; Test data
 D ASSERT(0,$D(^VPRPT(VPRJPID,VPRJTPID,"urn:va:med:93EF:-7:15231")))
 D ASSERT(0,$D(^VPRPTI(VPRJPID,VPRJTPID,"list","medication",20050331,"urn:va:med:93EF:-7:15231")))
 K HTTPERR
 S PTIME=TIME
 H 1
 S TIME=$G(^VPRMETA("JPID",VPRJPID,"lastAccessTime"))
 D ASSERT(1,TIME>PTIME)
 ; Get data
 D SETGET^VPRJTX("/vpr/uid/urn:va:med:93EF:-7:15231")
 D RESPOND^VPRJRSP
 D ASSERT(404,$G(HTTPERR))
 K HTTPERR
 ; Add HDR site data
 D SETPUT^VPRJTX("/vpr/"_VPRJTPID,"MED6HDR1","VPRJTP02")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 K HTTPERR
 ; Add primary site data
 D SETPUT^VPRJTX("/vpr/"_VPRJTPID,"MED6","VPRJTP02")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 K HTTPERR
 ; Delete data with PID
 D SETDEL^VPRJTX("/vpr/"_VPRJTPID_"/urn:va:med:93EF:-7:15231")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 ; Test data
 D ASSERT(0,$D(^VPRPT(VPRJPID,VPRJTPID,"urn:va:med:93EF:-7:15231")))
 D ASSERT(0,$D(^VPRPTI(VPRJPID,VPRJTPID,"list","medication",20050331,"urn:va:med:93EF:-7:15231")))
 K HTTPERR
 S PTIME=TIME
 H 1
 S TIME=$G(^VPRMETA("JPID",VPRJPID,"lastAccessTime"))
 D ASSERT(1,TIME>PTIME)
 ; Get data
 D SETGET^VPRJTX("/vpr/uid/urn:va:med:93EF:-7:15231")
 D RESPOND^VPRJRSP
 D ASSERT(404,$G(HTTPERR))
 K HTTPERR
 Q
 ;
EVERY ;;  retrieving every object for a patient
 N JSON,ERR,HTTPERR,VPRJTPID1
 D SETGET^VPRJTX("/vpr/"_VPRJTPID_"/index/every")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 K HTTPERR
 D DATA2ARY^VPRJTX(.JSON)
 D ASSERT(6,$G(JSON("data","totalItems")))
 D ASSERT(0,$D(^TMP($J,$J)))
 S VPRJTPID1=$$JPID4PID^VPRJPR(VPRJTPID)
 ; Cache is disable
 ;D ASSERT(10,$D(^VPRTMP($$HASH^VPRJRUT("vpr/index/"_VPRJTPID1_"/every////"))))
 ;D ASSERT(0,$D(^VPRTMP($$HASH^VPRJRUT("vpr/index/"_VPRJTPID1_"/every////"),$J)))
 D SETGET^VPRJTX("/vpr/"_VPRJTPID_"/index/every?start=3&limit=3")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 K HTTPERR,JSON
 D DATA2ARY^VPRJTX(.JSON)
 D ASSERT(3,$G(JSON("data","currentItemCount")))
 ; Cache is disabled
 ;D ASSERT(10,$D(^VPRTMP($$HASH^VPRJRUT("vpr/index/"_VPRJTPID1_"/every////"))))
 ;D ASSERT(0,$D(^VPRTMP($$HASH^VPRJRUT("vpr/index/"_VPRJTPID1_"/every////"),$J)))
 Q
FINDALL ;; @TEST finding every object in collection
 N JSON,ERR,HTTPERR,FLAG,ITEM,PTIME,TIME,VPRJPID
 ; The hang commands are necessary to ensure subsequent accesses on the lastAccessTime node don't happen within the same second
 S VPRJPID=$$JPID4PID^VPRJPR(VPRJTPID)
 D ASSERT(1,$G(VPRJPID)'="","JPID doesn't exist for this patient")
 I $G(VPRJPID)="" QUIT
 D ASSERT(1,$D(^VPRMETA("JPID",VPRJPID,"lastAccessTime")),"lastAccessTime doesn't exist for this patient")
 S TIME=^VPRMETA("JPID",VPRJPID,"lastAccessTime")
 H 1
 ; Add primary site data
 D SETPUT^VPRJTX("/vpr/"_VPRJTPID,"MED6","VPRJTP02")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 K HTTPERR
 ; Get medications
 D SETGET^VPRJTX("/vpr/93EF;-7/find/med")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 K HTTPERR
 S PTIME=TIME
 H 1
 S TIME=$G(^VPRMETA("JPID",VPRJPID,"lastAccessTime"))
 D ASSERT(1,TIME>PTIME)
 D DATA2ARY^VPRJTX(.JSON)
 ; Search array structure for Primary data
 S ITEM=""
 S FLAG=0
 F  S ITEM=$O(JSON("data","items",ITEM)) Q:ITEM=""  D
 . I JSON("data","items",ITEM,"sig")="TAKE ONE TABLET BY BY MOUTH TWICE A DAY" S FLAG=1
 D ASSERT(1,$G(FLAG),"Primary data not found")
 ; Add HDR site data
 K HTTPERR
 D SETPUT^VPRJTX("/vpr/1HDR;-777V123777","MED6HDR1","VPRJTP02")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 K HTTPERR
 ; Get medications
 D SETGET^VPRJTX("/vpr/1HDR;-777V123777/find/med")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 S PTIME=TIME
 H 1
 S TIME=$G(^VPRMETA("JPID",VPRJPID,"lastAccessTime"))
 D ASSERT(1,TIME>PTIME)
 K HTTPERR,JSON
 D DATA2ARY^VPRJTX(.JSON)
 ; Search array structure for HDR data
 S ITEM=""
 S FLAG=0
 F  S ITEM=$O(JSON("data","items",ITEM)) Q:ITEM=""  D
 . I JSON("data","items",ITEM,"sig")="HDR TAKE ONE TABLET BY BY MOUTH TWICE A DAY" S FLAG=1
 D ASSERT(1,$G(FLAG),"HDR data not found")
 Q
FINDPAR ;;  finding with parameters
 N JSON,ERR,HTTPERR
 D SETGET^VPRJTX("/vpr/"_VPRJTPID_"/find/med?filter=eq(""products[].ingredientName"",""METFORMIN"") eq(""dosages[].dose"",""250 MG"")")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 K HTTPERR
 D DATA2ARY^VPRJTX(.JSON)
 D ASSERT(1,$G(JSON("data","totalItems")))
 D ASSERT("urn:va:med:93EF:-7:16982",$G(JSON("data","items",1,"uid")))
 Q
FINDLIKE ;;  finding using like()
 N JSON,ERR,HTTPERR
 D SETGET^VPRJTX("/vpr/"_VPRJTPID_"/find/med?filter=like(""products[].ingredientName"",""ASPIRIN%25"")")
 D RESPOND^VPRJRSP
 D ASSERT(0,$G(HTTPERR))
 K HTTPERR
 D DATA2ARY^VPRJTX(.JSON)
 D ASSERT(1,$G(JSON("data","totalItems")))
 D ASSERT("urn:va:med:93EF:-7:18068",$G(JSON("data","items",1,"uid")))
 Q
