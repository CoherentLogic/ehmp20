package vistacore.order;

/**
 * This class was automatically generated by the data modeler tool.
 */

public class Appointment implements java.io.Serializable
{

   static final long serialVersionUID = 1L;

   private vistacore.order.AppointmentType type;
   private vistacore.order.AppointmentStatus status;
   private java.lang.String date;
   private vistacore.order.Facility clinic;
   private java.lang.String provider;
   private java.lang.Boolean ewl;

   public Appointment()
   {
   }

   public vistacore.order.AppointmentType getType()
   {
      return this.type;
   }

   public void setType(vistacore.order.AppointmentType type)
   {
      this.type = type;
   }

   public vistacore.order.AppointmentStatus getStatus()
   {
      return this.status;
   }

   public void setStatus(vistacore.order.AppointmentStatus status)
   {
      this.status = status;
   }

   public java.lang.String getDate()
   {
      return this.date;
   }

   public void setDate(java.lang.String date)
   {
      this.date = date;
   }

   public vistacore.order.Facility getClinic()
   {
      return this.clinic;
   }

   public void setClinic(vistacore.order.Facility clinic)
   {
      this.clinic = clinic;
   }

   public java.lang.String getProvider()
   {
      return this.provider;
   }

   public void setProvider(java.lang.String provider)
   {
      this.provider = provider;
   }

   public java.lang.Boolean getEwl()
   {
      return this.ewl;
   }

   public void setEwl(java.lang.Boolean ewl)
   {
      this.ewl = ewl;
   }

   public Appointment(vistacore.order.AppointmentType type,
         vistacore.order.AppointmentStatus status, java.lang.String date,
         vistacore.order.Facility clinic, java.lang.String provider,
         java.lang.Boolean ewl)
   {
      this.type = type;
      this.status = status;
      this.date = date;
      this.clinic = clinic;
      this.provider = provider;
      this.ewl = ewl;
   }

}