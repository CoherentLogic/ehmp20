define([
    'backbone',
    'marionette',
    'jquery',
    'handlebars',
    'hbs!demo_files/feature_forms/supporting_templates/F413_selectedDiagnosisBody',
    'hbs!demo_files/feature_forms/supporting_templates/F413_selectedProceduresTemplate'
], function(Backbone, Marionette, $, Handlebars, SelectedDiagnosesBody, SelectedProceduresTemplate) {

    //=============================================================================================================
    // PLEASE DO NOT COPY AND PASTE THIS FULL FILE. PLEASE JUST USE AS A REFERENCE AND COPY PARTS THAT ARE NEEDED
    // for more information on how to layout this form for your applet please checkout the following link:
    // http://IP_ADDRESS/documentation/#/adk/conventions#Writeback
    //=============================================================================================================

    var F413 = {
        // DO NOT USE CREATE FORM FUNCTION --- THIS IS FOR DEMO PURPOSES ONLY!!!
        cssClass: "encounters-container",
        createForm: function() {

            // *********************************************** CONTAINERS ***********************************************
            // Okay to copy and paste this !!!!!!!!!!!!! BUT ENSURE TO REPLACE STATIC OPTIONS/DATA WITH REAL DATA !!!!!!!!!!!!!
            var diagnosisHeaderContainer = {
                control: "container",
                extraClasses: ["row", "bottom-padding-xs"],
                items: [{
                    control: "container",
                    extraClasses: ["col-md-12"],
                    template: '<h5>Diagnosis List</h5>'
                }]
            };

            var diagnosesContainer = {
                control: "container",
                extraClasses: ["row", "bottom-padding-xs"],
                items: [{
                    control: "container",
                    extraClasses: ["col-xs-11"],
                    items: [{
                        control: "container",
                        extraClasses: ["row"],
                        items: [{
                            control: "drilldownChecklist",
                            selectOptions: {
                                control: "select",
                                name: "diagnosesSection",
                                label: "Diagnoses Section. Use the up and down arrow keys to view the predefined diagnosis list, then press tab to view the diagnosis.",
                                pickList: "DiagnosisCollection",
                                extraClasses: ["items-shown-md"],
                                size: 10,
                                required: true,
                                srOnlyLabel: true
                            },
                            checklistOptions: {
                                control: "checklist",
                                name: "listItems",
                                extraClasses: ["items-shown-md"],
                                attributeMapping: {
                                    unique: "id"
                                }
                            }
                        }]
                    }]
                }, {
                    control: "container",
                    extraClasses: ["col-xs-1"],
                    items: [{
                        control: 'popover',
                        label: "Add Other",
                        name: "add-other-diagnosis-popover",
                        header: "Add Other Diagnosis",
                        title: "Press enter to add other diagnoses.",
                        size: 'sm',
                        options: {
                            placement: 'left'
                        },
                        extraClasses: ["btn-default", "offset-btn-md"],
                        items: [{
                            control: "container",
                            extraClasses: ["row", "section-add-other-diagnosis"],
                            items: [{
                                control: "container",
                                extraClasses: ["col-xs-10", "bottom-padding-xs"],
                                items: [{
                                    control: "input",
                                    name: "addOtherDiagnosisSearchString",
                                    placeholder: "Search for diagnosis",
                                    label: "Search for diagnosis",
                                    srOnlyLabel: true,
                                    title: "Please enter in text to start searching for a diagnosis, and then press tab to navigate to the search button."
                                }]
                            }, {
                                control: "container",
                                extraClasses: ["col-xs-2", "bottom-padding-xs"],
                                items: [{
                                    control: "button",
                                    type: "button",
                                    label: "",
                                    size: 'sm',
                                    extraClasses: ["btn-default", "btn-block"],
                                    icon: "fa-search",
                                    title: "Press enter to execute search based on entered text, and then press tab to view the results listed below.",
                                    id: "add-other-diagnosis-search-btn"
                                }]
                            }, {
                                control: "container",
                                extraClasses: ["col-xs-12"],
                                items: [{
                                    control: "select",
                                    name: "addOtherDiagnosisSelect",
                                    srOnlyLabel: true,
                                    label: "Diagnosis Results",
                                    size: 10,
                                    extraClasses: ["items-shown-md"],
                                    title: "Use the up and down arrow keys to view options.",
                                    pickList: []
                                }]
                            }, {
                                control: "container",
                                extraClasses: ["col-xs-12"],
                                items: [{
                                    control: "container",
                                    extraClasses: ["text-right"],
                                    items: [{
                                        control: "button",
                                        type: "button",
                                        label: "Cancel",
                                        extraClasses: ["btn-default", "btn-sm"],
                                        title: "Press enter to cancel.",
                                        id: "add-other-diagnosis-cancel-btn"
                                    }, {
                                        control: "button",
                                        type: "button",
                                        label: "Add",
                                        extraClasses: ["btn-primary", "btn-sm"],
                                        title: "Press enter to add.",
                                        id: "add-other-diagnosis-add-btn"
                                    }]
                                }]
                            }]
                        }]
                    }]
                }]
            };

            var selectedDiagnosesContainer = {
                control: "container",
                extraClasses: ["row"],
                items: [{
                    control: "container",
                    extraClasses: ["col-md-12"],
                    items: [{
                        control: "nestedCommentBox",
                        name: "DiagnosisCollection",
                        extraClasses: ["bottom-margin-none"],
                        label: "Selected Diagnosis",
                        commentTemplate: '{{comment}}',
                        maxComments: 1,
                        itemColumn: {
                            columnTitle: "Selected Diagnosis",
                            columnClasses: ["flex-width-7"]
                        },
                        commentColumn: {
                            columnTitle: "Comments",
                            columnClasses: ["text-center"]
                        },
                        additionalColumns: [{
                            columnClasses: ["flex-width-2", "text-center"],
                            columnTitle: "Add to Condition List",
                            name: "addToCL",
                            control: 'checkbox',
                            disabled: true,
                            label: 'Add to Condition List',
                            srOnlyLabel: true
                        }, {
                            columnClasses: ["text-center", "flex-width-2"],
                            columnTitle: "Primary Diagnoses",
                            name: "primary",
                            control: 'checkbox',
                            label: 'Primary Diagnoses. Press spacebar to select this as the primary Diagnoses',
                            srOnlyLabel: true
                        }],
                        attributeMapping: {
                            collection: "listItems",
                            commentsCollection: "comments",
                            comment: "commentString",
                            value: "value",
                            label: "label",
                            unique: "id",
                            author: "author",
                            timeStamp: "timeStamp"
                        }
                    }]
                }]
            };

            var serviceConnectedContainer = {
                control: "container",
                extraClasses: ["col-md-12"],
                items: [{
                    control: "container",
                    extraClasses: ["row", "row-eq-height"],
                    items: [{
                        control: "container",
                        extraClasses: ["col-md-6", "well", "well-flex"],
                        template: [
                            '<p>Service Connected: {{serviceConnected}}%</p>',
                            '<ul><li>Vitamin Deficiency (10% SC)</li>',
                            '<li>Hemorrhoids (10% SC)</li>',
                            '<li>Inguinal Hernia (0% SC)</li>',
                            '<li>Gastric Ulcer (20% SC)</li>',
                            '</ul>'
                        ].join("\n")
                    }, {
                        control: "container",
                        extraClasses: ["col-md-6", "well", "well-flex"],
                        items: [{
                            control: "container",
                            tagName: "fieldset",
                            template: "<legend>Visit Related To</legend>",
                            items: [{
                                control: "radio",
                                extraClasses: ["bottom-border-grey-light"],
                                name: "serviceConnectedCondition",
                                label: "Service Connected Condition",
                                options: [{
                                    label: "Yes",
                                    value: 'true'
                                }, {
                                    label: "No",
                                    value: 'false'
                                }]
                            }, {
                                control: "radio",
                                extraClasses: ["bottom-border-grey-light"],
                                name: "combatVet",
                                label: "Combat Vet (Combat Related)",
                                title: "Combat Vet (Combat Related)",
                                options: [{
                                    label: "Yes",
                                    value: 'true'
                                }, {
                                    label: "No",
                                    value: 'false'
                                }]
                            }, {
                                control: "radio",
                                extraClasses: ["bottom-border-grey-light"],
                                name: "agentOrange",
                                label: "Agent Orange Exposure",
                                title: "Agent Orange Exposure",
                                options: [{
                                    label: "Yes",
                                    value: 'true'
                                }, {
                                    label: "No",
                                    value: 'false'
                                }]
                            }]
                        }]
                    }]
                }]
            };

            var selectedConnectedHeaderContainer = {
                control: "container",
                extraClasses: ["row"],
                items: [{
                    control: "container",
                    extraClasses: ["col-md-12", "bottom-padding-xs"],
                    template: '<h5>Service Connected</h5>'
                }, serviceConnectedContainer]
            };

            var visitTypeHeaderContainer = {
                control: "container",
                extraClasses: ["row", "bottom-padding-xs"],
                items: [{
                    control: "container",
                    extraClasses: ["col-md-12"],
                    template: '<h5>Visit Type</h5>'
                }]
            };

            var visitTypeContainer = {
                control: "container",
                extraClasses: ["row"],
                items: [{
                    control: "container",
                    extraClasses: ["col-md-9"],
                    items: [{
                        control: "container",
                        extraClasses: ["row"],
                        items: [{
                            control: "drilldownChecklist",
                            selectOptions: {
                                control: "select",
                                name: "visitTypeSelection",
                                label: "Type of Visit. Use the up and down arrow keys to view the predefined visit type, then press tab to view the type",
                                pickList: "visitCollection",
                                extraClasses: ["items-shown-md"],
                                size: 10,
                                required: true,
                                srOnlyLabel: true
                            },
                            checklistOptions: {
                                control: "checklist",
                                name: "items",
                                extraClasses: ["items-shown-md", "visit-checklist"],
                                attributeMapping: {
                                    unique: "name"
                                }
                            }
                        }]
                    }]
                }, {
                    control: "container",
                    extraClasses: ["col-md-3"],
                    items: [{
                        control: 'popover',
                        label: "Add Modifiers...",
                        name: "add-visit-modifiers-popover",
                        title: "Add Modifiers",
                        options: {
                            placement: 'left'
                        },
                        extraClasses: ["btn-default", "btn-sm", "btn-block"],
                        items: [{
                            control: "container",
                            extraClasses: ["row", "section-add-modifiers"],
                            items: [{
                                control: "container",
                                extraClasses: ["col-xs-12"],
                                items: [{
                                    control: "multiselectSideBySide",
                                    name: "availableVistModifiers",
                                    label: "Modifiers",
                                    selectedCountName: "visitModifiersCount"
                                }]
                            }, {
                                control: "container",
                                extraClasses: ["col-xs-12"],
                                items: [{
                                    control: "container",
                                    extraClasses: ["text-right"],
                                    items: [{
                                        control: "button",
                                        type: "button",
                                        label: "Done",
                                        extraClasses: ["btn-primary", "btn-sm"],
                                        title: "Press enter to close.",
                                        id: "add-visit-modifiers-close-btn"
                                    }]
                                }]
                            }]
                        }]
                    }, {
                        control: "container",
                        extraClasses: ["well", "read-only-well"],
                        template: Handlebars.compile([
                            '<ul class="list-inline">{{#each selectedModifiersForVist}}<li>{{this}}</li>{{/each}}</ul>'
                        ].join("\n")),
                        modelListeners: ["visitModifiersCount"]
                    }]
                }]
            };

            var providersEncounterContainer = {
                control: "multiselectSideBySide",
                name: "providerList",
                label: "Providers",
                attributeMapping: {
                    id: 'name'
                },
                additionalColumns: [{
                    columnClasses: ["text-center"],
                    columnTitle: "Primary Provider",
                    name: "primaryProviderCheck",
                    extraClasses: ["cell-valign-middle", "bottom-margin-no"],
                    control: 'checkbox',
                    srOnlyLabel: true,
                    label: "Primary Provider"
                }]
            };

            var primaryProviderContainer = {
                control: "container",
                extraClasses: ["row"],
                items: [{
                    control: "container",
                    extraClasses: ["col-md-6"],
                    items: [{
                        control: "select",
                        name: "selectedPrimaryProvider",
                        label: "Primary provider",
                        picklist: new Backbone.Collection([{
                            label: "Provider 1",
                            name: "me"
                        }]),
                        attributeMapping: {
                            value: 'name'
                        }
                    }]
                }]
            };

            var procedureHeaderContainer = {
                control: "container",
                extraClasses: ["row", "bottom-padding-xs"],
                items: [{
                    control: "container",
                    extraClasses: ["col-md-12"],
                    template: '<h5>Procedure</h5>'
                }]
            };

            var procedureContainer = {
                control: "container",
                extraClasses: ["row", "bottom-padding-xs"],
                items: [{
                    control: "container",
                    extraClasses: ["col-md-11"],
                    items: [{
                        control: "container",
                        extraClasses: ["row"],
                        items: [{
                            control: "drilldownChecklist",
                            selectOptions: {
                                control: "select",
                                name: "procedureSection",
                                label: "Procedure Section. Use the up and down arrow keys to view the predefined procedure section, then press tab to view the procedures",
                                pickList: "ProcedureCollection",
                                extraClasses: ["items-shown-md"],
                                size: 10,
                                required: true,
                                srOnlyLabel: true
                            },
                            checklistOptions: {
                                control: "checklist",
                                name: "listItems",
                                extraClasses: ["items-shown-md"],
                                attributeMapping: {
                                    unique: "id"
                                }
                            }
                        }]
                    }]
                }, {
                    control: "container",
                    extraClasses: ["col-xs-1"],
                    items: [{
                        control: 'popover',
                        label: "Add Other",
                        name: "add-other-procedure-popover",
                        header: "Add Other Procedure",
                        title: "Press enter to add other procedure.",
                        size: 'sm',
                        options: {
                            placement: 'left'
                        },
                        extraClasses: ["btn-default", "offset-btn-md", "btn-xs"],
                        items: [{
                            control: "container",
                            extraClasses: ["row", "section-add-other-procedure"],
                            items: [{
                                control: "container",
                                extraClasses: ["col-xs-10", "bottom-padding-xs"],
                                items: [{
                                    control: "input",
                                    name: "addOtherProcedureSearchString",
                                    placeholder: "Search for procedure",
                                    label: "Add Other Procedure Input",
                                    srOnlyLabel: true,
                                    title: "Please enter in a procedure to filter."
                                }]
                            }, {
                                control: "container",
                                extraClasses: ["col-xs-2", "bottom-padding-xs"],
                                items: [{
                                    control: "button",
                                    type: "button",
                                    label: "",
                                    size: 'sm',
                                    extraClasses: ["btn-default", "btn-block"],
                                    icon: "fa-search",
                                    title: "Press enter to search",
                                    id: "add-other-procedure-search-btn"
                                }]
                            }, {
                                control: "container",
                                extraClasses: ["col-xs-12"],
                                items: [{
                                    control: "select",
                                    name: "addOtherProcedureSelect",
                                    srOnlyLabel: true,
                                    label: "Add Other Procedure Selection",
                                    size: 10,
                                    required: true,
                                    extraClasses: ["items-shown-md"],
                                    title: "Press eneter to browse through select options.",
                                    pickList: []
                                }]
                            }, {
                                control: "container",
                                extraClasses: ["col-xs-12"],
                                items: [{
                                    control: "container",
                                    extraClasses: ["text-right"],
                                    items: [{
                                        control: "button",
                                        type: "button",
                                        label: "Cancel",
                                        extraClasses: ["btn-default", "btn-sm"],
                                        title: "Press enter to cancel.",
                                        id: "add-other-procedure-cancel-btn"
                                    }, {
                                        control: "button",
                                        type: "button",
                                        label: "Add",
                                        extraClasses: ["btn-primary", "btn-sm"],
                                        title: "Press enter to add.",
                                        id: "add-other-procedure-add-btn"
                                    }]
                                }]
                            }]
                        }]
                    }]
                }]
            };

            var selectedProceduresContainer = {
                control: "container",
                extraClasses: ["row"],
                items: [{
                    control: "container",
                    extraClasses: ["col-md-12"],
                    items: [{
                        control: "nestedCommentBox",
                        name: "ProcedureCollection",
                        label: "Selected Procedures",
                        extraClasses: ["nested-comment-box", "nested-comment-box-alt", "faux-table-row-container"],
                        itemColumn: {
                            columnTitle: "Selected Procedures",
                            columnClasses: ["flex-width-7"]
                        },
                        commentColumn: {
                            columnTitle: "Comments",
                            columnClasses: ["text-center"]
                        },
                        additionalColumns: [{
                            columnTitle: "Quantity",
                            columnClasses: ["text-center"],
                            control: 'input',
                            extraClasses: ["input-sm", "percent-width-80", "center-margin"],
                            name: "quantity",
                            placeholder: "1",
                            label: 'Quantity',
                            srOnlyLabel: true,
                            title: "Please enter in quantity"
                        }, {
                            columnClasses: ["flex-width-2", "text-center"],
                            columnTitle: "Provider",
                            control: "select",
                            extraClasses: ["input-sm", "all-margin-no"],
                            name: "provider",
                            label: "Provider",
                            srOnlyLabel: true,
                            title: "Please enter in provider.",
                            pickList: new Backbone.Collection([{
                                value: 'provider1',
                                label: 'Provider 1'
                            }, {
                                value: 'provider2',
                                label: 'Provider 2'
                            }])
                        }, {
                            columnTitle: "Add Modifiers",
                            columnClasses: ["flex-width-2", "text-center"],
                            title: "Press enter to add modifiers.",
                            control: 'popover',
                            extraClasses: ["btn-icon", "btn-xs"],
                            name: "itemModifiers",
                            label: "Add Modifiers...",
                            options: {
                                trigger: "click",
                                header: "Add Modifiers",
                                placement: "left"
                            },
                            items: [{
                                control: "container",
                                extraClasses: ["row"],
                                items: [{
                                    control: "container",
                                    extraClasses: ["col-xs-12"],
                                    items: [{
                                        control: "multiselectSideBySide",
                                        name: "modifiers",
                                        label: "Modifiers"
                                    }]
                                }]
                            }]
                        }],
                        attributeMapping: {
                            collection: "listItems",
                            commentsCollection: "comments",
                            comment: "commentString",
                            value: "value",
                            label: "label",
                            unique: "id",
                            author: "author",
                            timeStamp: "timeStamp"
                        }
                    }]
                }]
            };
            // *********************************************** END OF CONTAINERS ****************************************

            // *********************************************** FIELDS ***************************************************
            // Okay to copy and paste
            var F413Fields = [{
                control: "container",
                extraClasses: ["modal-body"],
                items: [{
                    control: "container",
                    extraClasses: ["container-fluid"],
                    items: [diagnosisHeaderContainer, diagnosesContainer, selectedDiagnosesContainer, selectedConnectedHeaderContainer, visitTypeHeaderContainer, visitTypeContainer, providersEncounterContainer, procedureHeaderContainer, procedureContainer, selectedProceduresContainer]
                }]
            }, {
                control: "container",
                extraClasses: ["modal-footer"],
                items: [{
                    control: 'container',
                    extraClasses: ["row"],
                    items: [{
                        control: "container",
                        extraClasses: ["col-xs-6"],
                        template: Handlebars.compile('<p aria-hidden="true">(* indicates a required field.)</p>{{#if savedTime}}<p><span id="immunization-historical-saved-at">Saved at: {{savedTime}}</span></p>{{/if}}')
                    }, {
                        control: "container",
                        extraClasses: ["col-xs-6"],
                        items: [{
                            control: "button",
                            id: "cancel-btn",
                            label: "Cancel",
                            title: "Press enter to cancel.",
                            extraClasses: ["btn-default", "btn-sm", "left-margin-xs"],
                            name: "cancel",
                            type: "button"
                        }, {
                            control: "button",
                            id: "ok-btn",
                            label: "OK",
                            title: "Press enter to confirm.",
                            extraClasses: ["btn-primary", "btn-sm", "left-margin-xs"],
                            name: "ok"
                        }]
                    }]
                }]
            }];
            // *********************************************** END OF FIELDS ********************************************

            // *********************************************** MODEL ****************************************************
            // Okay to copy and paste - Please Add additional items to prepopulate the fields
            var FormModel = Backbone.Model.extend({
                defaults: {
                    //savedTime: moment().format('HH:mm')
                }
            });
            // *********************************************** END OF MODEL *********************************************

            // *********************************************** VIEWS **********************************************
            // Okay to copy and paste - WITH 1 EXCEPTION (see below)
            var DeleteMessageView = Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile('You will lose all work in progress if you delete this task. Would you like to proceed?'),
                tagName: 'p'
            });

            var CloseMessageView = Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile('You will lose all work in progress if you close this task. Would you like to proceed?'),
                tagName: 'p'
            });

            var FooterView = Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile('{{ui-button "Cancel" id="alert-cancel-btn" classes="btn-default btn-sm" title="Press enter to cancel"}}{{ui-button "Continue" id="alert-continue-btn" classes="btn-primary btn-sm" title="Press enter to continue"}}'),
                events: {
                    'click #alert-continue-btn': function() {
                        ADK.UI.Alert.hide();
                        ADK.UI.Workflow.hide();
                    },
                    'click #alert-cancel-btn': function() {
                        ADK.UI.Alert.hide();
                    }
                },
                tagName: 'span'
            });

            var formView = ADK.UI.Form.extend({
                ui: {
                    'VisitChecklistCheckboxes': '.visit-checklist input',
                    'SearchAddOtherDiagnosis': '.add-other-diagnosis-popover #add-other-diagnosis-search-btn',
                    'SelectAddOtherDiagnosis': '.add-other-diagnosis-popover #addOtherDiagnosisSelect',
                    'CancelAddOtherDiagnosis': '.add-other-diagnosis-popover #add-other-diagnosis-cancel-btn',
                    'AddOtherDiagnosisPopover': '.add-other-diagnosis-popover #add-other-diagnosis-add-btn',

                    'SearchAddOtherProcedure': '.add-other-procedure-popover #add-other-procedure-search-btn',
                    'SelectAddOtherProcedure': '.add-other-procedure-popover #addOtherProcedureSelect',
                    'CancelAddOtherProcedure': '.add-other-procedure-popover #add-other-procedure-cancel-btn',
                    'AddOtherProcedurePopover': '.add-other-procedure-popover #add-other-procedure-add-btn',

                    'AddVisitModifiersPopover': '.add-visit-modifiers-popover',
                    'ClosAddVisitModifiers': '.add-visit-modifiers-popover #add-visit-modifiers-close-btn',
                },
                fields: F413Fields,
                modelEvents: {
                    'change:visitModifiersCount': function() {
                        this.model.set('selectedModifiersForVist', _.map(this.model.get('availableVistModifiers').where({
                            value: true
                        }), function(model) {
                            return model.get('label');
                        }));
                    }
                },
                events: {
                    "click #ok-btn": function(e) {
                        e.preventDefault();
                        if (!this.model.isValid())
                            this.model.set("formStatus", {
                                status: "error",
                                message: self.model.validationError
                            });
                        else {
                            this.model.unset("formStatus");
                            var saveAlertView = new ADK.UI.Notification({
                                title: 'Encounter Submitted',
                                icon: 'fa-check',
                                message: 'Encounter successfully submitted with no errors.',
                                type: "success"
                            });
                            saveAlertView.show();
                            ADK.UI.Workflow.hide();
                        }
                    },
                    "click #cancel-btn": function(e) {
                        e.preventDefault();
                        var deleteAlertView = new ADK.UI.Alert({
                            title: 'Are you sure you want to cancel?',
                            icon: 'icon-cancel',
                            messageView: DeleteMessageView,
                            footerView: FooterView
                        });
                        deleteAlertView.show();
                    },
                    "click @ui.CancelAddOtherDiagnosis": function(e) {
                        e.preventDefault();
                        this.closeAddOtherPopover("Diagnosis");
                    },
                    "click @ui.CancelAddOtherProcedure": function(e) {
                        e.preventDefault();
                        this.closeAddOtherPopover("Procedure");
                    },
                    "click @ui.ClosAddVisitModifiers": function(e) {
                        e.preventDefault();
                        this.$(this.ui["AddVisitModifiersPopover"]).trigger('control:popover:hidden', true);
                    },
                    "click @ui.SearchAddOtherDiagnosis": function(e) {
                        e.preventDefault();
                        this.searchForOther("Diagnosis");
                    },
                    "click @ui.SearchAddOtherProcedure": function(e) {
                        e.preventDefault();
                        this.searchForOther("Procedure");
                    },
                    "click @ui.AddOtherDiagnosisPopover": function(e) {
                        e.preventDefault();
                        this.addOtherPopover("Diagnosis");
                    },
                    "click @ui.AddOtherProcedurePopover": function(e) {
                        e.preventDefault();
                        this.addOtherPopover("Procedure");
                    }
                },
                closeAddOtherPopover: function(context) {
                    this.model.unset('addOther' + context + 'SearchString');

                    this.model.unset('addOther' + context + 'Select');
                    this.$(this.ui["SelectAddOther" + context]).trigger("control:picklist:set", [
                        []
                    ]);

                    this.$(this.ui["AddOther" + context + "Popover"]).trigger('control:popover:hidden', true);
                },
                searchForOther: function(context) {
                    var searchString = this.model.get("addOther" + context + "SearchString");
                    if (searchString && searchString.length > 0) {
                        this.$(this.ui["SelectAddOther" + context].selector).trigger("control:picklist:set", [
                            [{
                                label: searchString + ' 1',
                                value: 'opt1'
                            }, {
                                label: searchString + ' 2',
                                value: 'opt2'
                            }]
                        ]);
                    }
                },
                addOtherPopover: function(context) {
                    var itemToAddValue = this.model.get('addOther' + context + 'Select');
                    if (!_.isEmpty(itemToAddValue)) {
                        var itemToAddLabel = this.$(this.ui["SelectAddOther" + context].selector + ' option[value="' + itemToAddValue + '"]').text() || itemToAddValue || "";
                        if (context === "Procedure") {
                            this.model.get(context + 'Collection').add({
                                value: "other",
                                label: "Other Diagnoses",
                                listItems: new Backbone.Collection([{
                                    id: itemToAddValue,
                                    label: itemToAddLabel,
                                    value: true,
                                    quantity: 1,
                                    provider: "",
                                    comments: new Backbone.Collection([]),
                                    modifiers: []
                                }])
                            });
                        } else {
                            this.model.get(context + 'Collection').add({
                                value: "other",
                                label: "Other Diagnoses",
                                listItems: new Backbone.Collection([{
                                    id: itemToAddValue,
                                    label: itemToAddLabel,
                                    value: true,
                                    addToCL: false,
                                    comments: new Backbone.Collection([]),
                                    primary: false
                                }])
                            });
                        }

                        this.closeAddOtherPopover(context);
                    } else {
                        this.model.errorModel.clear();
                        this.model.errorModel.set('addOther' + context + 'Select', "You must select a valid " + context + " before continuing.");
                        this.transferFocusToFirstError();
                    }
                },
            });
            // *********************************************** END OF FORM VIEW *****************************************

            // *********************************************** MODEL AND WORKFLOW INSTANCE ******************************
            // Okay to copy and paste
            var formModel = new FormModel({
                serviceConnected: '40',
                ratedDisabilities: 'Combat',
                providerList: new Backbone.Collection([{
                    name: 'provider1',
                    label: 'Provider 1',
                    value: false
                }, {
                    name: 'provider2',
                    label: 'Provider 2',
                    value: false
                }, {
                    name: 'provider3',
                    label: 'Provider 3',
                    value: false
                }, {
                    name: 'provider4',
                    label: 'Provider 4',
                    value: false
                }, {
                    name: 'provider5',
                    label: 'Provider 5',
                    value: false
                }, {
                    name: 'provider6',
                    label: 'Provider 6',
                    value: false
                }, {
                    name: 'provider7',
                    label: 'Provider 7',
                    value: false
                }, {
                    name: 'provider8',
                    label: 'Provider 8',
                    value: false
                }, {
                    name: 'provider9',
                    label: 'Provider 9',
                    value: false
                }, {
                    name: 'provider10',
                    label: 'Provider 10',
                    value: false
                }]),
                availableVistModifiers: new Backbone.Collection([{
                    name: 'modifier1',
                    label: 'Modifier name',
                    value: false
                }, {
                    name: 'modifier2',
                    label: 'Modifier name',
                    value: false
                }, {
                    name: 'modifier3',
                    label: 'Modifier name',
                    value: false
                }, {
                    name: 'modifier4',
                    label: 'Modifier name',
                    value: false
                }, {
                    name: 'modifier5',
                    label: 'Modifier name',
                    value: false
                }, {
                    name: 'modifier6',
                    label: 'Modifier name',
                    value: false
                }, {
                    name: 'modifier7',
                    label: 'Modifier name',
                    value: false
                }, {
                    name: 'modifier8',
                    label: 'Modifier name',
                    value: false
                }, {
                    name: 'modifier9',
                    label: 'Modifier name',
                    value: false
                }, {
                    name: 'modifier10',
                    label: 'Modifier name',
                    value: false
                }]),
                visitTypeSelection: "opt1",
                visitCollection: new Backbone.Collection([{
                    label: "Office Visit - New Pt.",
                    value: "opt1",
                    items: new Backbone.Collection([{
                        name: 'opt1',
                        label: 'Focused, HX & Exam 99201',
                        value: true
                    }, {
                        name: 'opt2',
                        label: 'Expanded, HX & Exam 99202',
                        value: true
                    }, {
                        name: 'opt3',
                        label: 'Detailed, Low Complexity 99203',
                        value: false
                    }, {
                        name: 'opt4',
                        label: 'Comprehensive, Moderate 99204',
                        value: false
                    }])
                }, {
                    label: "Office Visit - Est Pt.",
                    value: "opt2",
                    items: new Backbone.Collection([{
                        name: 'opt1',
                        label: 'Est Focused, HX & Exam 99201',
                        value: false
                    }, {
                        name: 'opt2',
                        label: 'Est Expanded, HX & Exam 99202',
                        value: false
                    }, {
                        name: 'opt3',
                        label: 'Est Detailed, Low Complexity 99203',
                        value: false
                    }, {
                        name: 'opt4',
                        label: 'Est Comprehensive, Moderate 99204',
                        value: false
                    }])
                }, {
                    label: "Office Consult New",
                    value: "opt3",
                    items: new Backbone.Collection([{
                        name: 'opt1',
                        label: 'Office Focused, HX & Exam 99201',
                        value: false
                    }, {
                        name: 'opt2',
                        label: 'Office Expanded, HX & Exam 99202',
                        value: false
                    }, {
                        name: 'opt3',
                        label: 'Office Detailed, Low Complexity 99203',
                        value: false
                    }, {
                        name: 'opt4',
                        label: 'Office Comprehensive, Moderate 99204',
                        value: false
                    }])
                }, {
                    label: "Prev Medicine Svcs",
                    value: "opt4",
                    items: new Backbone.Collection([{
                        name: 'opt1',
                        label: 'Prev Medicine Focused, HX & Exam 99201',
                        value: false
                    }, {
                        name: 'opt2',
                        label: 'Prev Medicine Expanded, HX & Exam 99202',
                        value: false
                    }, {
                        name: 'opt3',
                        label: 'Prev Medicine Detailed, Low Complexity 99203',
                        value: false
                    }, {
                        name: 'opt4',
                        label: 'Prev Medicine Comprehensive, Moderate 99204',
                        value: false
                    }])
                }, {
                    label: "Counseling / Psychotherapy",
                    value: "opt5",
                    items: new Backbone.Collection([{
                        name: 'opt1',
                        label: 'Counseling Focused, HX & Exam 99201',
                        value: false
                    }, {
                        name: 'opt2',
                        label: 'Counseling Expanded, HX & Exam 99202',
                        value: false
                    }, {
                        name: 'opt3',
                        label: 'Psychotherapy Detailed, Low Complexity 99203',
                        value: false
                    }, {
                        name: 'opt4',
                        label: 'Psychotherapy Comprehensive, Moderate 99204',
                        value: false
                    }])
                }]),
                diagnosesSection: "conditionListItems",
                addOtherDiagnosisSearchString: "",
                DiagnosisCollection: new Backbone.Collection([{
                    value: "conditionListItems",
                    label: "Condition List Items",
                    listItems: new Backbone.Collection([{
                        id: "group1-diagnosis1",
                        label: "Hypertension",
                        value: false,
                        addToCL: false,
                        comments: new Backbone.Collection([]),
                        primary: true
                    }, {
                        id: "group1-diagnosis2",
                        label: "Hyperlipidemia",
                        value: false,
                        addToCL: false,
                        comments: new Backbone.Collection([{
                            commentString: "This might be a non-causative symptom",
                            author: {
                                name: "USER,PANORAMA",
                                duz: {
                                    "9E7A": "10000000255"
                                }
                            },
                            timeStamp: "12/12/2014 11:12PM"
                        }]),
                        primary: false
                    }, {
                        id: "group1-diagnosis3",
                        label: "Acute Myocardial infarction, unspecified site, episode of care unspecified (ICD-9-CM 410.90)",
                        value: false,
                        addToCL: false,
                        comments: new Backbone.Collection([]),
                        primary: false
                    }, {
                        id: "group1-diagnosis4",
                        label: "Chronic Systolic Heart failure",
                        value: false,
                        addToCL: false,
                        comments: new Backbone.Collection([{
                            commentString: "This might be a non-causative symptom",
                            author: {
                                name: "USER,PANORAMA",
                                duz: {
                                    "9E7A": "10000000255"
                                }
                            },
                            timeStamp: "12/12/2014 11:12PM"
                        }]),
                        primary: false
                    }, {
                        id: "group1-diagnosis5",
                        label: "Diabetes Mellitus Type II or unspecified",
                        value: false,
                        addToCL: false,
                        comments: new Backbone.Collection([]),
                        primary: false
                    }, {
                        id: "group1-diagnosis6",
                        label: "Adverse effect of Calcium-Channel Blockers, Initial Encount…",
                        value: false,
                        addToCL: false,
                        comments: new Backbone.Collection([]),
                        primary: true
                    }, {
                        id: "group1-diagnosis6",
                        label: "Acute myocardial infarction, unspecified site, episode of car…",
                        value: false,
                        addToCL: false,
                        comments: new Backbone.Collection([]),
                        primary: true
                    }, {
                        id: "group1-diagnosis7",
                        label: " Diabetes Mellitus Type III",
                        value: false,
                        addToCL: false,
                        comments: new Backbone.Collection([]),
                        primary: true
                    }, {
                        id: "group1-diagnosis8",
                        label: "Adverse effect of Calcium-Channel Blockers, Initial Encount…",
                        value: false,
                        addToCL: false,
                        comments: new Backbone.Collection([]),
                        primary: true
                    }, {
                        id: "group1-diagnosis9",
                        label: "Hypertension",
                        value: false,
                        addToCL: false,
                        comments: new Backbone.Collection([]),
                        primary: true
                    }, {
                        id: "group1-diagnosis10",
                        label: "Hyperlipidemia",
                        value: false,
                        addToCL: false,
                        comments: new Backbone.Collection([]),
                        primary: true
                    }, {
                        id: "group1-diagnosis11",
                        label: "Chronic Systolic Heart failure",
                        value: false,
                        addToCL: false,
                        comments: new Backbone.Collection([]),
                        primary: true
                    }, {
                        id: "group1-diagnosis12",
                        label: "Adverse effect of Calcium-Channel Blockers, Initial Encount…",
                        value: false,
                        addToCL: false,
                        comments: new Backbone.Collection([]),
                        primary: true
                    }])
                }, {
                    value: "infectiousDisease",
                    label: "Infectious Disease",
                    listItems: new Backbone.Collection([{
                        id: "group2-diagnosis1",
                        label: "Infectious Disease Diagnosis 1",
                        value: false,
                        addToCL: true,
                        comments: new Backbone.Collection([]),
                        primary: false
                    }, {
                        id: "group2-diagnosis2",
                        label: "Infectious Disease Diagnosis 2",
                        value: false,
                        addToCL: false,
                        comments: new Backbone.Collection([{
                            commentString: "This might be a non-causative symptom",
                            author: {
                                name: "USER,PANORAMA",
                                duz: {
                                    "9E7A": "10000000255"
                                }
                            },
                            timeStamp: "12/12/2014 11:12PM"
                        }]),
                        primary: false
                    }])
                }, {
                    value: "neoplasm",
                    label: "Neoplasm",
                    listItems: new Backbone.Collection([{
                        id: "group3-diagnosis1",
                        label: "Neoplasm Procedure 1",
                        value: false,
                        addToCL: true,
                        comments: new Backbone.Collection([]),
                        primary: false
                    }, {
                        id: "group3-diagnosis2",
                        label: "Neoplasm Procedure 2",
                        value: false,
                        addToCL: false,
                        comments: new Backbone.Collection([{
                            commentString: "This might be a non-causative symptom",
                            author: {
                                name: "USER,PANORAMA",
                                duz: {
                                    "9E7A": "10000000255"
                                }
                            },
                            timeStamp: "12/12/2014 11:12PM"
                        }]),
                        primary: false
                    }])
                }]),
                procedureSection: "procedureABC",
                addOtherProcedureSearchString: "",
                ProcedureCollection: new Backbone.Collection([{
                    value: "procedureABC",
                    label: "Procedure ABC",
                    listItems: new Backbone.Collection([{
                        id: "group1-procedure1",
                        label: "Item 12345",
                        value: false,
                        quantity: 1,
                        provider: "",
                        comments: new Backbone.Collection([]),
                        modifiers: [{
                            label: "Modifier1",
                            value: false,
                            unique: "mod1"
                        }, {
                            label: "Modifier2",
                            value: false,
                            unique: "mod2"
                        }]
                    }, {
                        id: "group1-procedure2",
                        label: "Item 23456",
                        value: false,
                        quantity: 2,
                        provider: "",
                        comments: new Backbone.Collection([{
                            commentString: "I am a demo comment string.",
                            author: {
                                name: "USER,PANORAMA",
                                duz: {
                                    "9E7A": "10000000255"
                                }
                            },
                            timeStamp: "12/12/2014 11:12PM"
                        }]),
                        modifiers: []
                    }, {
                        id: "group1-procedure3",
                        label: "Item 34567",
                        value: false,
                        quantity: 1,
                        provider: "",
                        comments: new Backbone.Collection([]),
                        primary: true,
                        modifiers: []
                    }, {
                        id: "group1-procedure4",
                        label: "Item 45678",
                        value: false,
                        quantity: 8,
                        provider: "",
                        comments: new Backbone.Collection([{
                            commentString: "This might be a non-causative symptom",
                            author: {
                                name: "USER,PANORAMA",
                                duz: {
                                    "9E7A": "10000000255"
                                }
                            },
                            timeStamp: "12/12/2014 11:12PM"
                        }]),
                        modifiers: []
                    }, {
                        id: "group1-procedure5",
                        label: "Item 56789",
                        value: false,
                        quantity: 1,
                        provider: "",
                        comments: new Backbone.Collection([]),
                        modifiers: []
                    }, ])
                }, {
                    value: "procedureDEF",
                    label: "Procedure DEF",
                    listItems: new Backbone.Collection([{
                        id: "group2-procedure1",
                        label: "Item 98765",
                        value: false,
                        quantity: 3,
                        provider: "",
                        comments: new Backbone.Collection([]),
                        modifiers: []
                    }, {
                        id: "group2-procedure2",
                        label: "Item 87654",
                        value: false,
                        quantity: 1,
                        provider: "",
                        comments: new Backbone.Collection([{
                            commentString: "This might be a non-causative symptom",
                            author: {
                                name: "USER,PANORAMA",
                                duz: {
                                    "9E7A": "10000000255"
                                }
                            },
                            timeStamp: "12/12/2014 11:12PM"
                        }]),
                        modifiers: []
                    }])
                }, {
                    value: "procedureGHI",
                    label: "Procedure GHI",
                    listItems: new Backbone.Collection([{
                        id: "group3-procedure1",
                        label: "Item 19234",
                        value: false,
                        quantity: 3,
                        provider: "",
                        comments: new Backbone.Collection([]),
                        modifiers: []
                    }, {
                        id: "group3-procedure2",
                        label: "Item 34254",
                        value: false,
                        quantity: 4,
                        provider: "",
                        comments: new Backbone.Collection([{
                            commentString: "This might be a non-causative symptom",
                            author: {
                                name: "USER,PANORAMA",
                                duz: {
                                    "9E7A": "10000000255"
                                }
                            },
                            timeStamp: "12/12/2014 11:12PM"
                        }]),
                        modifiers: []
                    }])
                }])
            });
            var workflowOptions = {
                size: "large",
                title: "Encounter Form for Eight, Patient (MM dd, YYYY @00:00)",
                showProgress: false,
                keyboard: true,
                steps: [{
                    view: formView,
                    viewModel: formModel,
                    stepTitle: 'Step 1'
                }]
            };
            var workflow = new ADK.UI.Workflow(workflowOptions);
            workflow.show();
            // *********************************************** END OF MODEL AND WORKFLOW INSTANCE ***********************
        }
    };
    return F413;
});