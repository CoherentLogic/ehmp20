HMPDGMRA ;SLC/MKB,ASMR/RRB,JD - Allergy/Reaction extract ;May 15, 2016 14:15
 ;;2.0;ENTERPRISE HEALTH MANAGEMENT PLATFORM;**1**;May 15, 2016;Build 1
 ;Per VA Directive 6402, this routine should not be modified.
 ;
 ;DE4220 - JD - 4/1/16: Fixed the date function so that seconds are considered for
 ;                      Origination Date/Time field (^DD(120.8,4)).
 ;
 ; External References          DBIA#
 ; -------------------          -----
 ; ^VA(200                      10060
 ; %DT                          10003
 ; GMRADPT                      10099
 ; EN1^GMRAOR2                   2422
 ; PSN50P41                      4531
 ; PSN50P65                      4543
 Q
 ; ------------ Get reactions from VistA ------------
 ;
EN(DFN,BEG,END,MAX,IFN) ; -- find patient's allergies/reactions
 N GMRA,GMRAL,HMPN,HMPITM,HMPCNT
 S DFN=+$G(DFN) Q:DFN<1
 S BEG=$G(BEG,1410101),END=$G(END,4141015),MAX=$G(MAX,9999),HMPCNT=0
 D EN1^GMRADPT
 ;
 ; get one reaction
 I $G(IFN) D EN1(IFN,.HMPITM),XML(.HMPITM) Q
 ;
 ; get all reactions
 I 'GMRAL D  Q
 . S HMPITM("assessment")=$S(GMRAL=0:"nka",1:"not done")
 . S HMPITM("facility")=$$FAC^HMPD ;local stn#^name
 . D XML(.HMPITM)
 S HMPN=0 F  S HMPN=+$O(GMRAL(HMPN)) Q:HMPN<1  D  Q:HMPCNT'<MAX
 . K HMPITM D EN1(HMPN,.HMPITM) Q:'$D(HMPITM)
 . D XML(.HMPITM) S HMPCNT=HMPCNT+1
 Q
 ;
EN1(ID,REAC) ; -- return a reaction in REAC("attribute")=value
 ;          from EN: expects GMRAL(ID)
 N HMPY,GMRA,I,J,X,Y,SEV,TXT,SEV K REAC
 S GMRA=$G(GMRAL(ID)) D EN1^GMRAOR2(ID,"HMPY")
 S X=$P(HMPY,U,10) I $L(X) S X=$$DATE(X) Q:X<BEG  Q:X>END  S REAC("entered")=X
 S REAC("facility")=$$FAC^HMPD ;local stn#^name
 S REAC("id")=ID,REAC("name")=$P(HMPY,U) I $P(GMRA,U,9) D
 . S X=$P(GMRA,U,9),Y=+$P(X,"(",2) I 'Y,X["PSDRUG" S Y=50
 . S REAC("localCode")=X,REAC("vuid")=$$VUID^HMPD(+X,Y)
 S X=$P(HMPY,U,6) S:$L(X) REAC("mechanism")=X
 S X=$P(HMPY,U,5),REAC("source")=$E(X)
 S REAC("type")=$S($L(GMRA):$P(GMRA,U,7),1:$$DFO($P(HMPY,U,7)))_U_$P(HMPY,U,7)
 I $P(HMPY,U,4)="VERIFIED",$P(HMPY,U,9) S REAC("verified")=$P(HMPY,U,9)
 S I=0,SEV="" F  S I=$O(HMPY("O",I)) Q:I<1  S X=$P(HMPY("O",I),U,2) S:X]SEV SEV=X ;find highest severity
 S:$L(SEV) REAC("severity")=SEV
 ; reactions
 S I=0 F  S I=$O(GMRAL(ID,"S",I)) Q:I<1  D
 . S X=$G(GMRAL(ID,"S",I)),Y=+$P(X,";",2)
 . S REAC("reaction",I)=$P(X,";")_U_$$VUID^HMPD(Y,120.83)
 ; comments
 S I=0 F  S I=$O(HMPY("C",I)) Q:I<1  D
 . S X=$G(HMPY("C",I)) K TXT
 . S Y=$$VA200($P(X,U,3))_U_$P(X,U)
 . S Y=Y_U_$S($L($P(X,U,2)):$E($P(X,U,2)),1:"E")
 . S J=0 F  S J=$O(HMPY("C",I,J)) Q:J<1  S X=$G(HMPY("C",I,J,0)),TXT(J)=X
 . K X S X=$$STRING^HMPD(.TXT)
 . S REAC("comment",I)=Y_U_X ;ien^name^date^type^text
 ; drug info
 I $D(HMPY("I")) D
 . N ROOT S ROOT=$$B^PSN50P41
 . S I=0 F  S I=$O(HMPY("I",I)) Q:I<1  S X=$G(HMPY("I",I)) D
 .. N IEN S IEN=$O(@ROOT@(X,0))
 .. S REAC("drugIngredient",I)=X_U_$$VUID^HMPD(IEN,50.416)
 I $D(HMPY("V")) D
 . S I=0 F  S I=$O(HMPY("V",I)) Q:I<1  S X=$G(HMPY("V",I)) D
 .. D C^PSN50P65("",$P(X,U,2),"PSN")
 .. N IEN S IEN=+$O(^TMP($J,"PSN","C",$P(X,U),0))
 .. S REAC("drugClass",I)=$P(X,U,2)_U_$$VUID^HMPD(IEN,50.605)
 I GMRA="" S REAC("removed")=1 ;entered in error
 Q
 ;
VA200(NAME) ; -- Return ien^name from #200
 N Y S NAME=$G(NAME),Y="^"
 I $L(NAME) S Y=+$O(^VA(200,"B",NAME,0))_U_NAME  ; IA 10060, DE2818
 Q Y
 ;
DATE(X) ; -- Return internal form of date X
 N %DT,Y
 S %DT="STX" D ^%DT  ;Added the "S" to allow for seconds.  DE4220
 Q Y
 ;
DFO(X) ; -- Return 'DFO' string for mechanism name(s)
 N I,P,Y S Y=""
 F I=1:1:$L(X,",") S P=$P(X,",",I),Y=Y_$S($E(P)=" ":$E(P,2),1:$E(P))
 S:Y="" Y=$G(X)
 Q Y
 ;
 ; ------------ Return data to middle tier ------------
 ;
XML(REAC) ; -- Return patient reaction as XML
 ;  as <element code='123' displayName='ABC' />
 N ATT,X,Y,I,P,NM,TAG
 D ADD("<allergy>") S HMPTOTL=$G(HMPTOTL)+1
 S ATT="" F  S ATT=$O(REAC(ATT)) Q:ATT=""  D  D:$L(Y) ADD(Y)
 . I ATT="comment" D  S Y="" Q
 .. S I=0,Y="<comments>" D ADD(Y)
 .. F  S I=$O(REAC(ATT,I)) Q:I<1  S X=$G(REAC(ATT,I)) D
 ... S Y="<comment id='"_I
 ... S:$L($P(X,U,3)) Y=Y_"' entered='"_$P(X,U,3)
 ... S:$L($P(X,U,2)) Y=Y_"' enteredBy='"_$$ESC^HMPD($P(X,U,2))
 ... S:$L($P(X,U,4)) Y=Y_"' commentType='"_$P(X,U,4)
 ... S:$L($P(X,U,5)) Y=Y_"' commentText='"_$$ESC^HMPD($P(X,U,5))
 ... S Y=Y_"' />" D ADD(Y)
 .. D ADD("</comments>")
 . I $O(REAC(ATT,0)) D  S Y="" Q
 .. S NM=ATT_$S($E(ATT,$L(ATT))="s":"es",1:"s") D ADD("<"_NM_">")
 .. S I=0 F  S I=$O(REAC(ATT,I)) Q:I<1  D
 ... S X=$G(REAC(ATT,I)),Y="<"_ATT_" "
 ... F P=1:1 S TAG=$P("name^vuid^severity^Z",U,P) Q:TAG="Z"  I $L($P(X,U,P)) S Y=Y_TAG_"='"_$$ESC^HMPD($P(X,U,P))_"' "
 ... S Y=Y_"/>" D ADD(Y)
 .. D ADD("</"_NM_">")
 . S X=$G(REAC(ATT)),Y="" Q:'$L(X)
 . I X'["^" S Y="<"_ATT_" value='"_$$ESC^HMPD(X)_"' />" Q
 . I $L(X)>1 D  S Y=""
 .. S Y="<"_ATT_" "
 .. F P=1:1 S TAG=$P("code^name^Z",U,P) Q:TAG="Z"  I $L($P(X,U,P)) S Y=Y_TAG_"='"_$$ESC^HMPD($P(X,U,P))_"' "
 .. S Y=Y_"/>" D ADD(Y)
 D ADD("</allergy>")
 Q
 ;
ADD(X) ; Add a line @HMP@(n)=X
 S HMPI=$G(HMPI)+1
 S @HMP@(HMPI)=X
 Q
