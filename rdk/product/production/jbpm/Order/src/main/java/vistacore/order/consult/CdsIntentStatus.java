package vistacore.order.consult;

/**
 * This class was automatically generated by the data modeler tool.
 */

public class CdsIntentStatus implements java.io.Serializable
{

   static final long serialVersionUID = 1L;

   private java.lang.String code;
   private java.lang.String httpStatus;

   public CdsIntentStatus()
   {
   }

   public java.lang.String getCode()
   {
      return this.code;
   }

   public void setCode(java.lang.String code)
   {
      this.code = code;
   }

   public java.lang.String getHttpStatus()
   {
      return this.httpStatus;
   }

   public void setHttpStatus(java.lang.String httpStatus)
   {
      this.httpStatus = httpStatus;
   }

   public CdsIntentStatus(java.lang.String code, java.lang.String httpStatus)
   {
      this.code = code;
      this.httpStatus = httpStatus;
   }

}