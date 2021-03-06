package vistacore.order.request;

/**
 * This class was automatically generated by the data modeler tool.
 */

public class RequestData implements java.io.Serializable
{

   static final long serialVersionUID = 1L;

   private java.util.List<vistacore.order.request.Request> responses;

   private java.util.List<vistacore.order.request.Request> requests;

   private vistacore.order.Activity activity;

   private java.util.List<vistacore.order.request.RequestSignal> signals;

   public RequestData()
   {
   }

   public java.util.List<vistacore.order.request.Request> getResponses()
   {
      return this.responses;
   }

   public void setResponses(
         java.util.List<vistacore.order.request.Request> responses)
   {
      this.responses = responses;
   }

   public java.util.List<vistacore.order.request.Request> getRequests()
   {
      return this.requests;
   }

   public void setRequests(java.util.List<vistacore.order.request.Request> requests)
   {
      this.requests = requests;
   }

   public vistacore.order.Activity getActivity()
   {
      return this.activity;
   }

   public void setActivity(vistacore.order.Activity activity)
   {
      this.activity = activity;
   }


   public java.util.List<vistacore.order.request.RequestSignal> getSignals()
   {
      return this.signals;
   }

   public void setSignals(
         java.util.List<vistacore.order.request.RequestSignal> signals)
   {
      this.signals = signals;
   }

   public RequestData(java.util.List<vistacore.order.request.Request> responses,
         java.util.List<vistacore.order.request.Request> requests,
         vistacore.order.Activity activity,
         java.util.List<vistacore.order.request.RequestSignal> signals)
   {
      this.responses = responses;
      this.requests = requests;
      this.activity = activity;
      this.signals = signals;
   }

}