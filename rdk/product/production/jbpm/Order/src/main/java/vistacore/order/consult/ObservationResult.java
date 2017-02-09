package vistacore.order.consult;

/**
 * This class was automatically generated by the data modeler tool.
 */

public class ObservationResult implements java.io.Serializable
{

   static final long serialVersionUID = 1L;

   private vistacore.order.consult.DerivedFrom derivedFrom;
   private java.lang.String episodicity;
   private java.lang.String legoId;
   private java.lang.String observable;
   private java.lang.String provenance;
   private java.lang.String questionText;
   private java.lang.String timing;
   private java.lang.String value;
   private vistacore.order.consult.Version version;

   public ObservationResult()
   {
   }

   public vistacore.order.consult.DerivedFrom getDerivedFrom()
   {
      return this.derivedFrom;
   }

   public void setDerivedFrom(vistacore.order.consult.DerivedFrom derivedFrom)
   {
      this.derivedFrom = derivedFrom;
   }

   public java.lang.String getEpisodicity()
   {
      return this.episodicity;
   }

   public void setEpisodicity(java.lang.String episodicity)
   {
      this.episodicity = episodicity;
   }

   public java.lang.String getLegoId()
   {
      return this.legoId;
   }

   public void setLegoId(java.lang.String legoId)
   {
      this.legoId = legoId;
   }

   public java.lang.String getObservable()
   {
      return this.observable;
   }

   public void setObservable(java.lang.String observable)
   {
      this.observable = observable;
   }

   public java.lang.String getProvenance()
   {
      return this.provenance;
   }

   public void setProvenance(java.lang.String provenance)
   {
      this.provenance = provenance;
   }

   public java.lang.String getQuestionText()
   {
      return this.questionText;
   }

   public void setQuestionText(java.lang.String questionText)
   {
      this.questionText = questionText;
   }

   public java.lang.String getTiming()
   {
      return this.timing;
   }

   public void setTiming(java.lang.String timing)
   {
      this.timing = timing;
   }

   public java.lang.String getValue()
   {
      return this.value;
   }

   public void setValue(java.lang.String value)
   {
      this.value = value;
   }

   public vistacore.order.consult.Version getVersion()
   {
      return this.version;
   }

   public void setVersion(vistacore.order.consult.Version version)
   {
      this.version = version;
   }

   public ObservationResult(vistacore.order.consult.DerivedFrom derivedFrom,
         java.lang.String episodicity, java.lang.String legoId,
         java.lang.String observable, java.lang.String provenance,
         java.lang.String questionText, java.lang.String timing,
         java.lang.String value, vistacore.order.consult.Version version)
   {
      this.derivedFrom = derivedFrom;
      this.episodicity = episodicity;
      this.legoId = legoId;
      this.observable = observable;
      this.provenance = provenance;
      this.questionText = questionText;
      this.timing = timing;
      this.value = value;
      this.version = version;
   }

}