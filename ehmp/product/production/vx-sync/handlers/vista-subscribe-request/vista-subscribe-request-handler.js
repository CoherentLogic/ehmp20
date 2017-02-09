'use strict';

var async = require('async');
var idUtil = require(global.VX_UTILS + 'patient-identifier-utils');
var jobUtil = require(global.VX_UTILS + 'job-utils');
var errorUtil = require(global.VX_UTILS + 'error');
var uuid = require('node-uuid');
var _ = require('underscore');

//---------------------------------------------------------------------------------------------------
// This is called when the beanstalkd worker receives a Job that this handler has been configured
// to process.
//
// vistaId - The site hash for the vistaId that this handler is configured to process.
// log - The logger to be used to log messages.
// config - The configuration information that was established for this environment.
// enviroment - The environment settiongs.
// job - The Job that is being processed.
// handlerCallBack - The call back that should be called when this job is completed.
//---------------------------------------------------------------------------------------------------
function handle(vistaId, log, config, environment, job, handlerCallback) {
	log.debug('vista-subscribe-request-handler.handle: Entering method. vistaId: %s; job: %j', vistaId, job);

	var pid = idUtil.extractPidFromJob(job);
	var pidSite = idUtil.extractSiteFromPid(pid);

    var domainList = config.vista.domains;

	log.debug('vista-subscribe-request-handler.handle: Received request to subscribe pid: %s.', pid);
	var isHdr = jobUtil.isVistAHdrSubscribeRequestType(job.type);
	// Set up the tasks that must be done to process this message - Bind all the arguments that we know.
	//--------------------------------------------------------------------------------------------------
	var tasks = [
		_validateParameters.bind(null, vistaId, pidSite, pid, log),
	];

    var pollerJobIds = [];
    _.each(domainList, function(domain){
        var domainJobId = uuid.v4(); // Since this case we are not getting a JobId from DropWizard - we have to create our own.  Use a UUID.
        pollerJobIds.push({'domain': domain, 'jobId': domainJobId});
        tasks.push(_createNewJobStatus.bind(null, vistaId, domain, pidSite, pid, job, domainJobId, environment.jobStatusUpdater, log));
    });

    if (!isHdr) {
		tasks.push(_subscribePatientToVistA.bind(null, vistaId, pidSite, pid, job, pollerJobIds, environment.vistaClient, log));
	}
	else {
		tasks.push(_subscribePatientToVistAHdr.bind(null, vistaId, pidSite, pid, job, pollerJobIds, environment.hdrClient, log));
	}

	processJob(vistaId, pidSite, pid, tasks, log, handlerCallback);
}

//----------------------------------------------------------------------------------------------------
// This routine essentuially does the work to process this job.
//
// vistaId - The site hash for the vistaId that this handler is configured to process.
// pidSite - The site hash that was in the PID.
// tasks - The array of functions to be called to process this message.
// log - The logger to be used to log messages.
// handlerCallBack - The call back that should be called when this job is completed.
//----------------------------------------------------------------------------------------------------
function processJob(vistaId, pidSite, pid, tasks, log, handlerCallback) {
	log.debug('vista-subscribe-request-handler.processJob: Entering method. vistaId: %s; pidSite: %s for pid: %s', vistaId, pidSite, pid);

	var actualError = null;
	var actualResponse = '';
	async.series(tasks, function (error, response) {
		log.debug('vista-subscribe-request-handler.processJob: callback from async.series called.  error: %s; response: %j', error, response);
		actualError = error ? errorUtil.createTransient(error) : null;
		actualResponse = response;
        handlerCallback(actualError, actualResponse);
	});
}

//--------------------------------------------------------------------------------------------
// This method validates that the parameters are correct.
//
// vistaId - The site hash for the vistaId that this handler is configured to process.
// pidSite - The site hash that was in the PID.
// pid - The pid that identifies the patient.
// log - The logger to be used to log messages.
// callback - This is the callback that is called when the validation is completed.
//--------------------------------------------------------------------------------------------
function _validateParameters(vistaId, pidSite, pid, log, callback) {
	log.debug('vista-subscribe-request-handler._validateParameters: Entering method. vistaId: %s; pidSite: %s', vistaId, pidSite);
	if ((!vistaId) ||
		(!pidSite) ||
		(vistaId !== pidSite)) {
		var errorMessage = 'Subscription request was made for a patient with a pid: ' + pid + ' containing a site that this handler does not support.  Handler supports: ' + vistaId + '  Request was for site: ' + pidSite;
		log.error(errorMessage);
		callback(errorMessage, null);
	} else {
		log.debug('vista-subscribe-request-handler._validateParameters : pidSite and VistaId matched for pid: ', pid);
		callback(null, 'success');
	}
}

//--------------------------------------------------------------------------------------------
// This method creates the JDS job status for the poller job.
//
// vistaId - The site hash for the vistaId that this handler is configured to process.
// pidSite - The site hash that was in the PID.
// pid - The pid that identifies the patient.
// job - The Job that is being processed.
// pollerJobId - The job ID for the job that will be logged in JDS to represent the job that the
//               poller will process.  Note the poller does not get this job from a tube - rather
//               it will get it from VistA when the sync message is received.
// jobStatusUpdater - The handle to the module that is used to update job status in the JDS.
// log - The logger to be used to log messages.
// callback - This is the callback that is called back after the job status has been created.
//--------------------------------------------------------------------------------------------
function _createNewJobStatus(vistaId, domain, pidSite, pid, job, pollerJobId, jobStatusUpdater, log, callback) {
	log.debug('vista-subscribe-request-handler._createNewJobStatus: Entering method. vistaId: %s; pidSite: %s; pid: %j; pollerJobId: %s; job: %j', vistaId, pidSite, pid, pollerJobId, job);
	var patientIdentifier = idUtil.create('pid', pid);
	var record = null;
	var eventUid = null;
	var meta = {
		rootJobId: job.rootJobId,
		jpid: job.jpid,
		priority: job.priority,
		jobId: pollerJobId
	};
	var isHdr = jobUtil.isVistAHdrSubscribeRequestType(job.type);
	var pollerJob;
	if (!isHdr) {
		pollerJob = jobUtil.createVistaPollerDomainRequest(vistaId, domain, patientIdentifier, record, eventUid, meta);
	}
	else {
		pollerJob = jobUtil.createVistaHdrPollerDomainRequest(vistaId, domain, patientIdentifier, record, eventUid, meta);
	}
	// pollerJob.jobId = pollerJobId;
	jobStatusUpdater.createJobStatus(pollerJob, function (error, response) {
		// Note - right now JDS is returning an error 200 if things worked correctly.   So
		// we need to absorb that error.
		//--------------------------------------------------------------------------------
		if ((error) && (String(error) === '200')) {
			callback(null, response);
		}
		else {
			callback(error, response);
		}
	});
}

//--------------------------------------------------------------------------------------------
// This method creates the JDS job status for the poller job.
//
// vistaId - The site hash for the vistaId that this handler is configured to process.
// pidSite - The site hash that was in the PID.
// pid - The pid that identifies the patient.
// job - The Job that is being processed.
// pollerJobId - The job ID for the job that will be logged in JDS to represent the job that the
//               poller will process.  Note the poller does not get this job from a tube - rather
//               it will get it from VistA when the sync message is received.
// vistaClient - The handle to the module that is used to send the subscribe request to
//                       VistA.
// log - The logger to be used to log messages.
// callback - This is the callback that is called back after the job status has been created.
//--------------------------------------------------------------------------------------------
function _subscribePatientToVistA(vistaId, pidSite, pid, job, pollerJobId, vistaClient, log, callback) {
	log.debug('vista-subscribe-request-handler._subscribePatientToVistA: Entering method. vistaId: %s; pidSite: %s for pid: %s', vistaId, pidSite, pid);
	// TODO:  Pass in the pollerJobId so that VistA will send it back to us when it sends the data.
	vistaClient.subscribe(vistaId, job.patientIdentifier, job.rootJobId, pollerJobId, job.priority, callback);
}

function _subscribePatientToVistAHdr(siteId, pidSite, pid, job, pollerJobId, hdrClient, log, callback) {
	log.debug('vista-subscribe-request-handler._subscribePatientToVistAHdr: Entering method. siteId: %s; pidSite: %s for pid: %s', siteId, pidSite, pid);
	// TODO:  Pass in the pollerJobId so that VistA will send it back to us when it sends the data.
	hdrClient.subscribe(siteId, job.patientIdentifier, job.rootJobId, pollerJobId, job.priority, callback);
}
//------------------------------------------------------------------------------------------------------
// Export public artifacts.
//------------------------------------------------------------------------------------------------------
module.exports = handle;
module.exports.handle = handle;
module.exports._validateParameters = _validateParameters;
module.exports._createNewJobStatus = _createNewJobStatus;
module.exports._subscribePatientToVistA = _subscribePatientToVistA;
module.exports._subscribePatientToVistAHdr = _subscribePatientToVistAHdr;