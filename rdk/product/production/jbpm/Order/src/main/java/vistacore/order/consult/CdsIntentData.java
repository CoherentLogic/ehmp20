package vistacore.order.consult;

/**
 * This class was automatically generated by the data modeler tool.
 */

public class CdsIntentData implements java.io.Serializable
{

   static final long serialVersionUID = 1L;

   private java.util.List<java.lang.String> faultInfo;
   private java.util.List<vistacore.order.consult.Result> results;
   private vistacore.order.consult.CdsIntentStatus status;

   public CdsIntentData()
   {
   }

   public java.util.List<java.lang.String> getFaultInfo()
   {
      return this.faultInfo;
   }

   public void setFaultInfo(java.util.List<java.lang.String> faultInfo)
   {
      this.faultInfo = faultInfo;
   }

   public java.util.List<vistacore.order.consult.Result> getResults()
   {
      return this.results;
   }

   public void setResults(
         java.util.List<vistacore.order.consult.Result> results)
   {
      this.results = results;
   }

   public vistacore.order.consult.CdsIntentStatus getStatus()
   {
      return this.status;
   }

   public void setStatus(vistacore.order.consult.CdsIntentStatus status)
   {
      this.status = status;
   }

   public CdsIntentData(java.util.List<java.lang.String> faultInfo,
         java.util.List<vistacore.order.consult.Result> results,
         vistacore.order.consult.CdsIntentStatus status)
   {
      this.faultInfo = faultInfo;
      this.results = results;
      this.status = status;
   }

}