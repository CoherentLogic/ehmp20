define([
    "backbone",
    "marionette",
    "underscore",
    "moment"
], function(Backbone, Marionette, _, moment) {
    "use strict";

    var newsfeedUtils = {
        templateSelector: function(model) {
            if(this.isVisit(model)) {
                return this.getVisitTemplate(model);
            }
            else if(this.isImmunization(model)) {
                return "immunizationTemplate";
            }
            else if(this.isSurgery(model)) {
                return "surgeryTemplate";
            }
            else if(this.isConsult(model)) {
                return "consultTemplate";
            }
            else if(this.isProcedure(model)) {
                return "procedureTemplate";
            }
            else if(this.isLaboratory(model)) {
                return "laboratoryTemplate";
            }
            //default template?

        },
        getVisitTemplate: function(model) {
            if (model.stopCodeName && model.stopCodeName.toLowerCase() === 'emergency dept')
                return "emergencyDeptTemplate";
            else if (newsfeedUtils.isHospitalization(model)) {
                if(newsfeedUtils.isDischargedOrAdmitted(model))
                    return "dischargedPatientTemplate";
                else
                    return "admittedPatientTemplate";
            }
            else if (model.stopCodeName) {
                return "stopCodeVisitTemplate";
            }

            return "defaultVisitTemplate";
        },
        getPrimaryProviderDisplay:function(response) {
            if(response.primaryProvider !== undefined) {
                return response.primaryProvider.providerDisplayName;
            } else if (response.secondaryProvider !== undefined) {
                return response.secondaryProvider;
            }
            return undefined;
        },
        getEnteredBy:function(response) {
            var kind = response.displayType.toLowerCase();
            if(kind === "visit"){
                if(response.createdByName) return _.isEmpty(response.createdByName) ? undefined : response.createdByName;                  
            } else if (kind === "consult"){
                if(response.providerName)  return _.isEmpty(response.providerName) ? undefined : response.providerName;           
            } else if (response.providers) {
                    for (var m = 0; m < response.providers.length; m++) {
                        if (response.providers[m].primary) {
                            if (response.providers[m].providerDisplayName) {
                                return response.providers[m].providerName;
                            }
                        }
                        if (response.providers[m].providerDisplayName) {
                             return response.providers[m].providerName;
                        }
                    }
                } else {
                    if (response.primaryProvider) {
                        return _.isEmpty(response.primaryProvider.providerName) ? undefined : response.primaryProvider.providerName;
                    } else if (response.secondaryProvider) {
                        return _.isEmpty(response.secondaryProvider) ? undefined : response.secondaryProvider.toUpperCase();
                    } else if (response.providerName) {
                        return _.isEmpty(response.providerName) ? undefined : response.providerName.toUpperCase();
                    }
                }                               
            return undefined;
        },
        isHospitalization: function(model) {
            return model.categoryCode === 'urn:va:encounter-category:AD';
        },
        //returns true if discharged, false if admitted
        isDischargedOrAdmitted: function(model) {
            if(model.stay === undefined)
                throw "stay is required for this method!";
            return model.stay.dischargeDateTime !== undefined;
        },
        /**
            Activity Date time is a derived field. The current rules are:
            generally activityDateTime == dateTime
            Exceptions:
              Visit: If a hospitalization and the patient is being discharged, use the dischargeDateTime
        */
        getActivityDateTime: function(model) {
            if(this.isVisit(model)) {
                if(this.isHospitalization(model) && this.isDischargedOrAdmitted(model))   {
                    return model.stay.dischargeDateTime;
                }
                return model.dateTime;
            }
            else if(this.isImmunization(model)) {
                return model.administeredDateTime;
            }
            else  //generally it's date time, so try that if there is an unhandled usecase
                return model.dateTime;

        },
        isImmunization: function(model) {
            return this.isKindTypeHelper(model, "immunization");
        },
        isVisit: function(model) {
            return this.isKindTypeHelper(model, "visit") ||
                this.isKindTypeHelper(model, "admission") ||
                this.isKindTypeHelper(model, "dod appointment") ||
                this.isKindTypeHelper(model, "dod encounter");
        },
        isSurgery: function(model) {
            return this.isKindTypeHelper(model, "surgery");
        },
        isCptProcedure: function(model) {
           if(_.isUndefined(model)) return false;
           if(model.get('isCPTdomain')){
              return this.isKindTypeHelper(model, "procedure");
           }else{
             return false;
           }
        },
        isConsult: function(model) {
            return this.isKindTypeHelper(model, "consult");
        },
        isProcedure: function(model) {
            return this.isKindTypeHelper(model, "procedure");
        },
        isLaboratory: function(model) {
            return this.isKindTypeHelper(model, "laboratory") || this.isKindTypeHelper(model, "microbiology");
        },
        isKindTypeHelper: function(model, kindType) {
            if(model === undefined) return false;
            var kind = model.kind;
            if(model instanceof Backbone.Model)
                kind = model.get('kind');
            if(kind === undefined) return false;
            kind = kind.toLowerCase();
            return(kind === kindType);

        },
        /** date is expected to be in MMM-YYYY **/
        convertTimelineDate: function(date) {
            if(date === undefined || date.toLowerCase() === 'present')
                return undefined;
            return moment(date, "DD-MMM-YYYY").format("YYYYMMDD");
        },
        getDisplayType: function(model) {
            if (this.isKindTypeHelper(model, "visit")) {
                var uid = model instanceof Backbone.Model ? model.get('uid') : model.uid;
                var type = uid.split(/\:/)[2];
                if (type === 'appointment') {
                    return "Appointment";
                }
                return "Visit";
            }
            var kind = model instanceof Backbone.Model ? model.get('kind') : model.kind;
            return kind;
        }
    };

    return newsfeedUtils;


});
