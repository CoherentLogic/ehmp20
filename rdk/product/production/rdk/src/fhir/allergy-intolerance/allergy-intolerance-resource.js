'use strict';
//var ao = require('../common/entities/allergy-objects.js');
var errors = require('../common/errors');
var helpers = require('../common/utils/helpers');
var rdk = require('../../core/rdk');
var nullchecker = rdk.utils.nullchecker;
var _ = require('lodash');
var querystring = require('querystring');
var fhirUtils = require('../common/utils/fhir-converter');
var fhirResource = require('../common/entities/fhir-resource');
var constants = require('../common/utils/constants');
var conformanceUtils = require('../conformance/conformance-utils');
var conformance = require('../conformance/conformance-resource');

var fhirToJDSAttrMap = [{
    fhirName: 'subject.identifier',
    vprName: 'pid',
    dataType: 'string',
    definition: 'http://hl7.org/FHIR/2015May/datatypes.html#string',
    description: 'Patient indentifier - note that this patient identifier will overrule any patient identifier that is in the URI of this endpoint.',
    searchable: true
},{
    fhirName: 'pid',
    vprName: 'pid',
    dataType: 'string',
    definition: 'http://hl7.org/FHIR/2015May/datatypes.html#string',
    description: 'Patient indentifier - note that this patient identifier will overrule any patient identifier that has been specified in the URI of this endpoint as well as the subject.identifier on the query string.',
    searchable: true
},{
    fhirName: 'identifier.value',
    vprName: 'uid',
    dataType: 'string',
    definition: 'http://hl7.org/FHIR/2015May/datatypes.html#string',
    description: 'The uid of the allergy.',
    searchable: true
}];

// Issue call to Conformance registration
conformance.register(conformanceUtils.domains.ALLERGY_INTOLERANCE, createAllergyIntoleranceConformanceData());

function createAllergyIntoleranceConformanceData() {   
   var resourceType = conformanceUtils.domains.ALLERGY_INTOLERANCE;
   var profileReference = 'http://hl7.org/fhir/2015MAY/allergyintolerance.html';
   var interactions = [ 'read', 'search-type' ];

   return conformanceUtils.createConformanceData(resourceType, profileReference,
           interactions, fhirToJDSAttrMap);
}

// TODO-FUTURE:
// As JSON.parse and JSON.stringify work in a blocking manner perhaps we should switch to a streaming parser as this one:
// https://github.com/dominictarr/JSONStream


function getResourceConfig() {
    return [{
        name: 'allergyIntolerance-allergyintolerances',
        path: '',
        get: getAllergyIntolerances,
        subsystems: ['patientrecord', 'jds', 'solr', 'jdsSync', 'authorization'],
        requiredPermissions: [],
        isPatientCentric: true,
        permitResponseFormat: true
    }];
}


function getAllergyIntolerances(req, res) {

    getAllergyData(req, 'allergy', function(err, inputJSON) {

        if (err instanceof errors.ParamError) {
            res.status(rdk.httpstatus.bad_request).send(err.message);
        } else if (err instanceof errors.NotFoundError) {
            res.status(rdk.httpstatus.not_found).send(err.error);
        } else if (err instanceof errors.FetchError) {
            req.logger.error(err.message);
            res.status(rdk.httpstatus.internal_server_error).send('There was an error processing your request. The error has been logged.');
        } else if (err) {
            res.status(rdk.httpstatus.internal_server_error).send(err.message);
        } else {
            res.status(200).send(processJSON(inputJSON, req));
        }
    });
}

function getFhirItems(inputJSON, req) {

    var fhirResult = {};
    fhirResult = processJSON(inputJSON, req);

    var fhirItems = [];
    fhirItems = fhirResult.entry;

    return fhirItems;
}

function processJSON(inputJSON, req) {

    var link = req.protocol + '://' + req.headers.host + req.originalUrl;
    var fhirResult = new fhirResource.Bundle([new fhirResource.Link(link, 'self')]);

    fhirResult.entry = [];
    var items = inputJSON.data.items;

    _.forEach(items, function(item, index) {
        fhirResult.entry.push(createIntolerance(item, req, fhirResult.updated));
    });

    fhirResult.total = inputJSON.data.totalItems;
    return fhirResult;
}

function getAllergyData(req, domain, callback) {

    var pid = req.param('subject.identifier');
    var uid = req.param('uid');
    var start = req.param('start') || 0;
    var limit = req.param('limit');
    var config = req.app.config;

    if (nullchecker.isNullish(pid)) {
        return callback(new errors.ParamError('subject.identifier'));
    }
    var jdsResource;
    var jdsQuery = {
        start: start
    };
    if (limit) {
        jdsQuery.limit = limit;
    }
    if (uid) {
        jdsQuery.filter = 'like("uid","' + uid + '")';
    }

    jdsResource = '/vpr/' + pid + '/find/' + domain;
    var jdsPath = jdsResource + '?' + querystring.stringify(jdsQuery);
    var options = _.extend({}, config.jdsServer, {
        url: jdsPath,
        logger: req.logger,
        json: true
    });

    rdk.utils.http.get(options, function(error, response, obj) {
        req.logger.debug('callback from fetch()');
        if (error) {
            callback(new errors.FetchError('Error fetching pid=' + pid + ' - ' + (error.message || error), error));
        } else {
            if ('data' in obj) {
                return callback(null, obj);
            } else if ('error' in obj) {
                if (errors.isNotFound(obj)) {
                    return callback(new errors.NotFoundError('Object not found', obj));
                }
            }

            return callback(new Error('There was an error processing your request. The error has been logged.'));
        }
    });
}

function createExtensions(item) {
    var extns = [];
    if (nullchecker.isNotNullish(item.facilityCode)) {
        extns.push(new fhirResource.Extension(constants.allergyintolerancefhir.ALLERGYINTOLERANCE_EXTENSION_URL_PREFIX + 'facilityCode', item.facilityCode, 'String'));
    }
    if (nullchecker.isNotNullish(item.facilityName)) {
        extns.push(new fhirResource.Extension(constants.allergyintolerancefhir.ALLERGYINTOLERANCE_EXTENSION_URL_PREFIX + 'facilityName', item.facilityName, 'String'));
    }
    if (nullchecker.isNotNullish(item.historical)) {
        extns.push(new fhirResource.Extension(constants.allergyintolerancefhir.ALLERGYINTOLERANCE_EXTENSION_URL_PREFIX + 'historical', item.historical, 'String'));
    }
    if (nullchecker.isNotNullish(item.kind)) {
        extns.push(new fhirResource.Extension(constants.allergyintolerancefhir.ALLERGYINTOLERANCE_EXTENSION_URL_PREFIX + 'kind', item.kind, 'String'));
    }
    if (nullchecker.isNotNullish(item.lastUpdateTime)) {
        extns.push(new fhirResource.Extension(constants.allergyintolerancefhir.ALLERGYINTOLERANCE_EXTENSION_URL_PREFIX + 'lastUpdateTime', item.lastUpdateTime, 'String'));
    }
    if (nullchecker.isNotNullish(item.localId)) {
        extns.push(new fhirResource.Extension(constants.allergyintolerancefhir.ALLERGYINTOLERANCE_EXTENSION_URL_PREFIX + 'localId', item.localId, 'String'));
    }
    if (nullchecker.isNotNullish(item.mechanism)) {
        extns.push(new fhirResource.Extension(constants.allergyintolerancefhir.ALLERGYINTOLERANCE_EXTENSION_URL_PREFIX + 'mechanism', item.mechanism, 'String'));
    }
    if (nullchecker.isNotNullish(item.originatorName)) {
        extns.push(new fhirResource.Extension(constants.allergyintolerancefhir.ALLERGYINTOLERANCE_EXTENSION_URL_PREFIX + 'originatorName', item.originatorName, 'String'));
    }
    if (nullchecker.isNotNullish(item.reference)) {
        extns.push(new fhirResource.Extension(constants.allergyintolerancefhir.ALLERGYINTOLERANCE_EXTENSION_URL_PREFIX + 'reference', item.reference, 'String'));
    }
    if (nullchecker.isNotNullish(item.stampTime)) {
        extns.push(new fhirResource.Extension(constants.allergyintolerancefhir.ALLERGYINTOLERANCE_EXTENSION_URL_PREFIX + 'stampTime', item.stampTime, 'String'));
    }
    if (nullchecker.isNotNullish(item.typeName)) {
        extns.push(new fhirResource.Extension(constants.allergyintolerancefhir.ALLERGYINTOLERANCE_EXTENSION_URL_PREFIX + 'typeName', item.typeName, 'String'));
    }
    if (nullchecker.isNotNullish(item.uid)) {
        extns.push(new fhirResource.Extension(constants.allergyintolerancefhir.ALLERGYINTOLERANCE_EXTENSION_URL_PREFIX + 'uid', item.uid, 'String'));
    }
    if (nullchecker.isNotNullish(item.verified)) {
        extns.push(new fhirResource.Extension(constants.allergyintolerancefhir.ALLERGYINTOLERANCE_EXTENSION_URL_PREFIX + 'verified', item.verified, 'String'));
    }
    if (nullchecker.isNotNullish(item.verifierName)) {
        extns.push(new fhirResource.Extension(constants.allergyintolerancefhir.ALLERGYINTOLERANCE_EXTENSION_URL_PREFIX + 'verifierName', item.verifierName, 'String'));
    }
    if (nullchecker.isNotNullish(item.comments) && item.comments.length > 0) {
        if (nullchecker.isNotNullish(item.comments[0].comment)) {
            extns.push(new fhirResource.Extension(constants.allergyintolerancefhir.ALLERGYINTOLERANCE_EXTENSION_URL_PREFIX + 'comments[].comment', item.comments[0].comment, 'String'));
        }
        if (nullchecker.isNotNullish(item.comments[0].entered)) {
            extns.push(new fhirResource.Extension(constants.allergyintolerancefhir.ALLERGYINTOLERANCE_EXTENSION_URL_PREFIX + 'comments[].entered', item.comments[0].entered, 'String'));
        }
        if (nullchecker.isNotNullish(item.comments[0].enteredByName)) {
            extns.push(new fhirResource.Extension(constants.allergyintolerancefhir.ALLERGYINTOLERANCE_EXTENSION_URL_PREFIX + 'comments[].enteredByName', item.comments[0].enteredByName, 'String'));
        }
        if (nullchecker.isNotNullish(item.comments[0].enteredByUid)) {
            extns.push(new fhirResource.Extension(constants.allergyintolerancefhir.ALLERGYINTOLERANCE_EXTENSION_URL_PREFIX + 'comments[].enteredByUid', item.comments[0].enteredByUid, 'String'));
        }
        if (nullchecker.isNotNullish(item.comments[0].summary)) {
            extns.push(new fhirResource.Extension(constants.allergyintolerancefhir.ALLERGYINTOLERANCE_EXTENSION_URL_PREFIX + 'comments[].summary', item.comments[0].summary, 'String'));
        }
    }

    if (extns.length === 0) {
        extns = undefined;
    }

    return extns;
}

function createIntolerance(item) {
    var fhirItem = {};

    fhirItem.resource = {};
    fhirItem.resource.resourceType = 'AllergyIntolerance';
    fhirItem.resource.text = {
        'status': 'generated',
        'div': '<div>' + _.escape(item.summary) + '</div>'
    };
    //var orgUid = helpers.generateUUID();


    fhirItem.resource.identifier = [{
        'use': 'official',
        'system': 'http://vistacore.us/fhir/id/uid',
        'value': item.uid
    }];

    fhirItem.resource.recordedDate = fhirUtils.convertToFhirDateTime(item.entered, fhirUtils.getSiteHash(item.uid)); // "<dateTime>", // When recorded
    //  "recorder" : { Reference(Practitioner|Patient) }, // Who recorded the sensitivity
    //  {
    //   "reference" : "<string>", // C? Relative, internal or absolute URL reference
    //   "display" : "<string>" // Text alternative for the resource
    //  }
    if (nullchecker.isNotNullish(item.comments)) {
        // fhirItem.resource.reporter = item.comments.enteredByUid; //Reference(Patient|RelatedPerson|Practitioner) Source of the information about the allergy
        fhirItem.resource.comment = item.comments.comment; //"<string>", // Additional text not captured in other fields
    }
    fhirItem.resource.patient = new fhirResource.ReferenceResource('Patient/' + item.pid); // R!  Who the sensitivity is for

    fhirItem.resource.substance = {}; //  : { CodeableConcept }, // Specific substance considered to be responsible for event
    var coding = [];
    if (nullchecker.isNotNullish(item.drugClasses) && item.drugClasses.length > 0) {
        coding.push(new fhirResource.Coding(item.drugClasses[0].code, item.drugClasses[0].name, 'urn:oid:2.16.840.1.113883.6.233'));
    }
    if (nullchecker.isNotNullish(item.codes) && item.codes.length > 0) {
        coding.push(new fhirResource.Coding(item.codes[0].code, item.codes[0].name, 'urn:oid:2.16.840.1.113883.6.233'));
    }
    fhirItem.resource.substance = new fhirResource.CodeableConcept(null, coding);

    fhirItem.resource.status = null; //"<code>", // unconfirmed | confirmed | resolved | refuted | entered-in-error
    //    fhirItem.resource.status = 'unconfirmed';
    //    if (nullchecker.isNotNullish(item.verified)) {
    //        fhirItem.resource.status = 'confirmed';
    //    }

    fhirItem.resource.criticality = 'unassessible'; //"<code>", // low | high | unassessible - Estimated potential clinical harm
    fhirItem.resource.type = 'immune'; //"<code>", // immune | non-immune - Underlying mechanism (if known)
    fhirItem.resource.category = null; // item.typeName? //"<code>", // food | medication | environment - Category of Substance
    fhirItem.resource.lastOccurence = null; //"<dateTime>", // Date(/time) of last known occurence of a reaction

    fhirItem.resource.event = []; // [{ // Adverse Reaction Events linked to exposure to substance
    fhirItem.resource.event[0] = {};

    if (nullchecker.isNotNullish(item.products)) {
        coding = [];
        fhirItem.resource.event[0].substance = {};
        _.forEach(item.products, function(product, index) {
            coding.push(new fhirResource.Coding(product.vuid, product.name, 'urn:oid:2.16.840.1.113883.6.233'));
        });
        fhirItem.resource.event[0].substance.coding = coding;
    }
    fhirItem.resource.event[0].certainty = 'likely'; //  : "<code>", // unlikely | likely | confirmed - clinical certainty about the specific substance

    if (nullchecker.isNotNullish(item.reactions)) {
        coding = [];
        fhirItem.resource.event[0].manifestation = {};
        _.forEach(item.reactions, function(reaction, index) {
            coding.push(new fhirResource.Coding(reaction.vuid, reaction.name, 'urn:oid:2.16.840.1.113883.6.233'));
        });
        fhirItem.resource.event[0].manifestation.coding = coding;
    }

    fhirItem.resource.event[0].description = null; //  : "<string>", // Description of the event as a whole
    fhirItem.resource.event[0].onset = null; //  : "<dateTime>", // Date(/time) when manifestations showed
    fhirItem.resource.event[0].duration = null; //  : { Duration }, // How long Manifestations persisted
    fhirItem.resource.event[0].severity = null; //  : "<code>", // mild | moderate | severe (of event as a whole)
    fhirItem.resource.event[0].exposureRoute = null; //  : { CodeableConcept }, // How the subject was exposed to the substance
    fhirItem.resource.event[0].comment = null; //  : "<string>" // Text about event not captured in other fields

    fhirItem.resource.extension = createExtensions(item);

    return fhirItem;
}

module.exports.getResourceConfig = getResourceConfig;
module.exports.convertToFhir = processJSON;
module.exports.getFhirItems = getFhirItems;
module.exports.createAllergyIntoleranceConformanceData = createAllergyIntoleranceConformanceData;
