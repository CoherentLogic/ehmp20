package vistacore.order.request;

/**
 * This class was automatically generated by the data modeler tool.
 */

public class RequestIdentifier implements java.io.Serializable
{

   static final long serialVersionUID = 1L;

   private java.lang.String name;

   private java.lang.String code;

   public RequestIdentifier()
   {
   }

   public java.lang.String getName()
   {
      return this.name;
   }

   public void setName(java.lang.String name)
   {
      this.name = name;
   }

   public java.lang.String getCode()
   {
      return this.code;
   }

   public void setCode(java.lang.String code)
   {
      this.code = code;
   }

   public RequestIdentifier(java.lang.String name, java.lang.String code)
   {
      this.name = name;
      this.code = code;
   }

}