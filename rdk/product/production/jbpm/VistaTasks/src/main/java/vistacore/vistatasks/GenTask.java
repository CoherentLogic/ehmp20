package vistacore.vistatasks;

/**
 * This class was automatically generated by the data modeler tool.
 */

public class GenTask implements java.io.Serializable
{

   static final long serialVersionUID = 1L;

   private java.lang.String patientName;
   private java.lang.String service;
   private java.lang.String team;
   private java.lang.String role;
   private java.util.Date dueDate;
   private java.lang.String priority;
   private java.lang.String taskType;
   private java.lang.String taskReason;
   private java.lang.String todoNote;
   private java.lang.String completionNote;

   public GenTask()
   {
   }

   public java.lang.String getPatientName()
   {
      return this.patientName;
   }

   public void setPatientName(java.lang.String patientName)
   {
      this.patientName = patientName;
   }

   public java.lang.String getService()
   {
      return this.service;
   }

   public void setService(java.lang.String service)
   {
      this.service = service;
   }

   public java.lang.String getTeam()
   {
      return this.team;
   }

   public void setTeam(java.lang.String team)
   {
      this.team = team;
   }

   public java.lang.String getRole()
   {
      return this.role;
   }

   public void setRole(java.lang.String role)
   {
      this.role = role;
   }

   public java.util.Date getDueDate()
   {
      return this.dueDate;
   }

   public void setDueDate(java.util.Date dueDate)
   {
      this.dueDate = dueDate;
   }

   public java.lang.String getPriority()
   {
      return this.priority;
   }

   public void setPriority(java.lang.String priority)
   {
      this.priority = priority;
   }

   public java.lang.String getTaskType()
   {
      return this.taskType;
   }

   public void setTaskType(java.lang.String taskType)
   {
      this.taskType = taskType;
   }

   public java.lang.String getTaskReason()
   {
      return this.taskReason;
   }

   public void setTaskReason(java.lang.String taskReason)
   {
      this.taskReason = taskReason;
   }

   public java.lang.String getTodoNote()
   {
      return this.todoNote;
   }

   public void setTodoNote(java.lang.String todoNote)
   {
      this.todoNote = todoNote;
   }

   public java.lang.String getCompletionNote()
   {
      return this.completionNote;
   }

   public void setCompletionNote(java.lang.String completionNote)
   {
      this.completionNote = completionNote;
   }

   public GenTask(java.lang.String patientName, java.lang.String service,
         java.lang.String team, java.lang.String role,
         java.util.Date dueDate, java.lang.String priority,
         java.lang.String taskType, java.lang.String taskReason,
         java.lang.String todoNote, java.lang.String completionNote)
   {
      this.patientName = patientName;
      this.service = service;
      this.team = team;
      this.role = role;
      this.dueDate = dueDate;
      this.priority = priority;
      this.taskType = taskType;
      this.taskReason = taskReason;
      this.todoNote = todoNote;
      this.completionNote = completionNote;
   }

}