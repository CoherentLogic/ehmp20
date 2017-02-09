VPRJCRC ;SLC/AGP -- Calculate Checksum values
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
 Q
ALL() ;
 Q "problem;allergy;consult;vital;lab;procedure;obs;order;treatment;med;ptf;factor;immunization;exam;cpt;education;pov;skin;image;appointment;surgery;document;visit;mh"
 ;
ATTR(X) ; -- return list of attributes needed for collection X
 N Y S Y=""
 I X="vital"           S Y="^observed^typeName^result^"
 E  I X="problem"      S Y="^onset^problemText^statusName^"
 E  I X="allergy"      S Y="^entered^summary^"
 E  I X="order"        S Y="^start^name^statusName^"
 E  I X="treatment"    S Y="^start^name^statusName^"
 E  I X="med"          S Y="^overallstart^name^vaStatus^"
 E  I X="consult"      S Y="^startDate^typeName^statusName^"
 E  I X="procedure"    S Y="^dateTime^name^statusName^"
 E  I X="obs"          S Y="^observed^typeName^result^"
 E  I X="lab"          S Y="^observed^typeName^"
 E  I X="image"        S Y="^dateTime^name^statusName^"
 E  I X="surgery"      S Y="^dateTime^typeName^statusName^"
 E  I X="document"     S Y="^referenceDateTime^localTitle^statusName^"
 E  I X="mh"           S Y="^administeredDateTime^name^"
 E  I X="immunization" S Y="^administeredDateTime^name^"
 E  I X="pov"          S Y="^entered^name^"
 E  I X="skin"         S Y="^entered^name^result^"
 E  I X="exam"         S Y="^entered^name^result^"
 E  I X="cpt"          S Y="^entered^name^"
 E  I X="education"    S Y="^entered^name^result^"
 E  I X="factor"       S Y="^entered^name^"
 E  I X="appointment"  S Y="^dateTime^typeName^appointmentStatus^"
 E  I X="visit"        S Y="^dateTime^typeName^"
 E  I X="ptf"          S Y="^arrivalDateTime^icdCode^"
 Q Y
 ;
CRC(FLDVAL,CRC) ;
 S CRC=$$CRC32^XLFCRC(FLDVAL,CRC)
 Q
 ;
DATA(PID,UID,DOMAIN,ARRAY,CRC) ;
 N FIELD,VALUE,JPID
 ;
 S JPID=$$JPID4PID^VPRJPR(PID)
 I JPID="" Q
 ;
 S FIELD="" F  S FIELD=$O(ARRAY(DOMAIN,FIELD)) Q:FIELD=""  D
 . I $D(^VPRPT(JPID,PID,UID,FIELD)) S VALUE=$G(^VPRPT(JPID,PID,UID,FIELD)) D CRC(FIELD_":"_VALUE,.CRC)
 Q
 ;
PATCRC(DOMARRY) ;
 N CRC,DOM,VALUE
 S CRC=0,DOM=""
 F  S DOM=$O(DOMARRY(DOM)) Q:DOM=""  D CRC(DOM_":"_DOMARRY(DOM),.CRC)
 Q CRC
 ;
EN(RESULT,SYS,PID) ;
 N ARRAY,CNT,CRC,DOMARRY,ERROR,FIELDS,TEMP,TYPE,U,UID,UIDCRC,VPRP,VPRTYPE,JPID
 S U="^"
 S VPRTYPE=$$ALL
 F VPRP=1:1:$L(VPRTYPE,";") S TYPE=$P(VPRTYPE,";",VPRP) I $L(TYPE) D
 .S ARRAY(TYPE)=""
 .S FIELDS=$$ATTR(TYPE)
 .S NUM=$L(FIELDS,U)
 .S FCNT=0
 .F X=1:1:NUM D
 ..I $P(FIELDS,U,X)="" Q
 ..S ARRAY(TYPE,$P(FIELDS,U,X))=""
 ;D ENCODE^VPRJSON("ARRAY","TEST","ERROR")
 ;
 S JPID=$$JPID4PID^VPRJPR(PID)
 I JPID="" Q
 ;
 S UID="" F  S UID=$O(^VPRPT(JPID,PID,UID)) Q:UID=""  D
 .I $P(UID,":",4)'=SYS Q
 .S DOMAIN=$P(UID,":",3),UIDCRC="" I '$D(ARRAY(DOMAIN)) Q
 .D DATA(PID,UID,DOMAIN,.ARRAY,.UIDCRC)
 .S DOMARRY(DOMAIN,UID)=UIDCRC
 D CALDOM(.DOMARRY)
 S DOMARRY("patient")=$$PATCRC(.DOMARRY)
 ;M RESULT=DOMARRY
 D PREP(.DOMARRY,.TEMP)
 D ENCODE^VPRJSON("TEMP","RESULT","ERROR")
 Q
 ;
CALDOM(DOMARRY) ;
 N CRC,TYPE,UID,VALUE
 S TYPE="" F  S TYPE=$O(DOMARRY(TYPE)) Q:TYPE=""  D
 .S CRC=0,UID="" F  S UID=$O(DOMARRY(TYPE,UID)) Q:UID=""  D
 ..S VALUE=DOMARRY(TYPE,UID) D CRC(UID_":"_VALUE,.CRC)
 ..S DOMARRY(TYPE)=CRC
 Q
 ;
PREP(DOMARRY,TEMP) ;
 N DCNT,DOMAIN,UID,UCNT
 S DOMAIN="",DCNT=0
 F  S DOMAIN=$O(DOMARRY(DOMAIN)) Q:DOMAIN=""  D
 .S TEMP(DOMAIN,"crc")=DOMARRY(DOMAIN)
 .S UCNT=0,UID="" F  S UID=$O(DOMARRY(DOMAIN,UID)) Q:UID=""  D
 ..S UCNT=UCNT+1,TEMP(DOMAIN,"uids",UCNT,UID)=DOMARRY(DOMAIN,UID)
 ..;S TEMP(DOMAIN,"uids",UCNT,"uid")=UID,TEMP(DOMAIN,"uids",UCNT,"crc")=DOMARRY(DOMAIN,UID)
 Q
 ;
TEST(TEST) ;
 N FIELDS,NUM,FCNT,VPRTYPE,VPRP
 K ARRAY,TEST
 S VPRTYPE=$$ALL
 F VPRP=1:1:$L(VPRTYPE,";") S TYPE=$P(VPRTYPE,";",VPRP) I $L(TYPE) D
 .S ARRAY(TYPE)=""
 .S FIELDS=$$ATTR(TYPE)
 .S NUM=$L(FIELDS,U)
 .S FCNT=0
 .F X=1:1:NUM D
 ..I $P(FIELDS,U,X)="" Q
 ..S FCNT=FCNT+1,ARRAY(TYPE,"fields",FCNT,$P(FIELDS,U,X))=""
 D ENCODE^VPRJSON("ARRAY","TEST","ERROR")
 Q
