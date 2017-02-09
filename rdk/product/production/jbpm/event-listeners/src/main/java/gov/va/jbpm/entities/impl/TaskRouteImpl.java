package gov.va.jbpm.entities.impl;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

@Entity
@Table(name = "ACTIVITYDB.AM_TASKROUTE")
public class TaskRouteImpl extends BaseRoute {
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "taskRoute_seq")	
	@SequenceGenerator(name = "taskRoute_seq", sequenceName = "ACTIVITYDB.AM_TASKROUTE_ID_SEQ", allocationSize = 1)
	private long id;
	private Long taskInstanceId; 
	
	//Constructors
	public TaskRouteImpl(Long taskInstanceId, String facility, Integer team, Integer teamFocus, Integer teamType, 
			Integer teamRole, String userId, boolean patientAssignment) {
			
		super(facility, team, teamFocus, teamType, teamRole, userId, patientAssignment);
		this.taskInstanceId = taskInstanceId; 
	}

	public TaskRouteImpl(Long taskInstanceId, BaseRoute baseRoute) {
		
		this(taskInstanceId, baseRoute.facility, baseRoute.team, baseRoute.teamFocus, baseRoute.teamType, baseRoute.teamRole, baseRoute.userId, baseRoute.patientAssignment);	
	}
	
	/**
	 * @return the taskInstanceId
	 */
	public long getTaskInstanceId() {
		return taskInstanceId;
	}

	/**
	 * @param taskInstanceId the taskInstanceId to set
	 */
	public void setTaskInstanceId(long taskInstanceId) {
		this.taskInstanceId = taskInstanceId;
	}
	
//-----------------------------------------------------------------------------
//-----------------------toString----------------------------------------------
//-----------------------------------------------------------------------------

	@Override
	public String toString() {
		return "TaskRouteImpl [id=" + id + ", taskInstanceId=" + taskInstanceId + ", " + super.toString() +"]";
	}
}
