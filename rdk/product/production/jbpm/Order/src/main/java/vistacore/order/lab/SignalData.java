package vistacore.order.lab;

/**
 * This class was automatically generated by the data modeler tool.
 */

public class SignalData implements java.io.Serializable
{

   static final long serialVersionUID = 1L;

   private java.lang.String listenerId;

   private java.lang.String message;

   private java.lang.String orderStatusCode;

   private java.lang.String clinicalObjectUid;

   private java.lang.String noResultNotificationDate;

   private java.lang.String pid;

   private java.lang.String facilityCode;

   private java.lang.String labTestText;

   private java.lang.String urgency;

   private java.lang.String providerUid;

   private java.lang.String referenceId;

   private java.lang.String ehmpState;

   private java.lang.String name;

   private java.lang.String authorUid;

   public SignalData()
   {
   }

   public java.lang.String getListenerId()
   {
      return this.listenerId;
   }

   public void setListenerId(java.lang.String listenerId)
   {
      this.listenerId = listenerId;
   }

   public java.lang.String getMessage()
   {
      return this.message;
   }

   public void setMessage(java.lang.String message)
   {
      this.message = message;
   }

   public java.lang.String getOrderStatusCode()
   {
      return this.orderStatusCode;
   }

   public void setOrderStatusCode(java.lang.String orderStatusCode)
   {
      this.orderStatusCode = orderStatusCode;
   }

   public java.lang.String getClinicalObjectUid()
   {
      return this.clinicalObjectUid;
   }

   public void setClinicalObjectUid(java.lang.String clinicalObjectUid)
   {
      this.clinicalObjectUid = clinicalObjectUid;
   }

   public java.lang.String getNoResultNotificationDate()
   {
      return this.noResultNotificationDate;
   }

   public void setNoResultNotificationDate(
         java.lang.String noResultNotificationDate)
   {
      this.noResultNotificationDate = noResultNotificationDate;
   }

   public java.lang.String getPid()
   {
      return this.pid;
   }

   public void setPid(java.lang.String pid)
   {
      this.pid = pid;
   }

   public java.lang.String getFacilityCode()
   {
      return this.facilityCode;
   }

   public void setFacilityCode(java.lang.String facilityCode)
   {
      this.facilityCode = facilityCode;
   }

   public java.lang.String getUrgency()
   {
      return this.urgency;
   }

   public void setUrgency(java.lang.String urgency)
   {
      this.urgency = urgency;
   }

   public java.lang.String getReferenceId()
   {
      return this.referenceId;
   }

   public void setReferenceId(java.lang.String referenceId)
   {
      this.referenceId = referenceId;
   }

   public java.lang.String getEhmpState()
   {
      return this.ehmpState;
   }

   public void setEhmpState(java.lang.String ehmpState)
   {
      this.ehmpState = ehmpState;
   }

   public java.lang.String getLabTestText()
   {
      return this.labTestText;
   }

   public void setLabTestText(java.lang.String labTestText)
   {
      this.labTestText = labTestText;
   }

   public java.lang.String getName()
   {
      return this.name;
   }

   public void setName(java.lang.String name)
   {
      this.name = name;
   }

   public java.lang.String getProviderUid()
   {
      return this.providerUid;
   }

   public void setProviderUid(java.lang.String providerUid)
   {
      this.providerUid = providerUid;
   }

   public java.lang.String getAuthorUid()
   {
      return this.authorUid;
   }

   public void setAuthorUid(java.lang.String authorUid)
   {
      this.authorUid = authorUid;
   }

   public SignalData(java.lang.String listenerId, java.lang.String message,
         java.lang.String orderStatusCode, java.lang.String clinicalObjectUid,
         java.lang.String noResultNotificationDate, java.lang.String pid,
         java.lang.String facilityCode, java.lang.String labTestText,
         java.lang.String urgency, java.lang.String providerUid,
         java.lang.String referenceId, java.lang.String ehmpState,
         java.lang.String name, java.lang.String authorUid)
   {
      this.listenerId = listenerId;
      this.message = message;
      this.orderStatusCode = orderStatusCode;
      this.clinicalObjectUid = clinicalObjectUid;
      this.noResultNotificationDate = noResultNotificationDate;
      this.pid = pid;
      this.facilityCode = facilityCode;
      this.labTestText = labTestText;
      this.urgency = urgency;
      this.providerUid = providerUid;
      this.referenceId = referenceId;
      this.ehmpState = ehmpState;
      this.name = name;
      this.authorUid = authorUid;
   }

}