package vistacore.order.consult;

/**
 * This class was automatically generated by the data modeler tool.
 */

public class ConsultPreReqQuestion implements java.io.Serializable
{

   static final long serialVersionUID = 1L;

   private java.lang.String question;
   private java.lang.String answer;

   public ConsultPreReqQuestion()
   {
   }

   public java.lang.String getQuestion()
   {
      return this.question;
   }

   public void setQuestion(java.lang.String question)
   {
      this.question = question;
   }

   public java.lang.String getAnswer()
   {
      return this.answer;
   }

   public void setAnswer(java.lang.String answer)
   {
      this.answer = answer;
   }

   public ConsultPreReqQuestion(java.lang.String question,
         java.lang.String answer)
   {
      this.question = question;
      this.answer = answer;
   }

}