define([
    'backbone',
    'marionette',
    'jquery',
    'handlebars',
], function(Backbone, Marionette, $, Handlebars) {

    //=============================================================================================================
    // PLEASE DO NOT COPY AND PASTE THIS FULL FILE. PLEASE JUST USE AS A REFERENCE AND COPY PARTS THAT ARE NEEDED
    // for more information on how to layout this form for your applet please checkout the following link:
    // http://IP_ADDRESS/documentation/#/adk/conventions#Writeback
    //=============================================================================================================

    var F226 = {
        // DO NOT USE CREATE FORM FUNCTION --- THIS IS FOR DEMO PURPOSES ONLY!!!
        createForm: function() {
            // *********************************************** STATIC ARRAY *****************************************
            // NOTE: PICKLIST IS ONLY FOR THIS DEMO EXAMPLE
            var timeZonesArray = [{
                group: 'Group 1',
                pickList: [{
                    value: 'opt1',
                    label: 'Option 1'
                }, {
                    value: 'opt2',
                    label: 'Option 2'
                }]
            }, {
                group: 'Group 2',
                pickList: [{
                    value: 'opt3',
                    label: 'Option 3'
                }, {
                    value: 'opt4',
                    label: 'Option 4'
                }, {
                    value: 'opt5',
                    label: 'Option 5'
                }, {
                    value: 'opt6',
                    label: 'Option 6'
                }]
            }, {
                group: 'Group 3',
                pickList: [{
                    value: 'opt7',
                    label: 'Option 7'
                }, {
                    value: 'opt8',
                    label: 'Option 8'
                }, {
                    value: 'opt9',
                    label: 'Option 9'
                }]
            }];
            // *********************************************** END OF STATIC ARRAY **********************************

            // *********************************************** FIELDS ***************************************************
            // Okay to copy and paste
            var F226Fields = [{
                control: "container",
                extraClasses: ["modal-body"],
                items: [{
                    control: "container",
                    extraClasses: ["container-fluid"],
                    items: [{
                        control: "container",
                        extraClasses: ["row"],
                        items: [{
                            control: "container",
                            extraClasses: ["col-xs-5"],
                            items: [{
                                control: "select",
                                name: "title",
                                label: "Note Title",
                                title: "Press enter to open search filter text.",
                                pickList: timeZonesArray,
                                showFilter: true,
                                groupEnabled: true,
                                required: true,
                                options: {
                                    minimumInputLength: 0
                                }
                            }]
                        }, {
                            control: "container",
                            extraClasses: ["col-xs-4"],
                            items: [{
                                control: "datepicker",
                                name: "notesCalendar",
                                title: "Enter in a date in the following format, MM/DD/YYYY",
                                label: "Date",
                                required: true
                            }]
                        }, {
                            control: "container",
                            extraClasses: ["col-xs-3"],
                            items: [{
                                control: "timepicker",
                                name: "notesTime",
                                title: "Please enter in a time in the following format, HH:MM",
                                label: "Time",
                                required: true,
                                placeholder: "HH:MM"
                            }]
                        }]
                    }, {
                        control: "container",
                        extraClasses: ["row"],
                        items: [{
                            control: "container",
                            extraClasses: ["col-xs-12"],
                            items: [{
                                control: "textarea",
                                name: "moreInfo",
                                title: "Please enter in note details",
                                label: "Note",
                                rows: 19,
                                required: true
                            }]
                        }]
                    }]
                }]

            }, { //*************************** Modal Footer START ***************************
                control: "container",
                extraClasses: ["modal-footer"],
                items: [{
                    control: "container",
                    extraClasses: ["row"],
                    items: [{
                        control: "container",
                        extraClasses: ["col-xs-6"],
                        template: Handlebars.compile('<p aria-hidden="true">(* indicates a required field.)</p>{{#if savedTime}}<p><span id="notes-saved-at">Saved at: {{savedTime}}</span></p>{{/if}}')
                    }, {
                        control: "container",
                        extraClasses: ["col-xs-6"],
                        items: [{
                            control: "button",
                            id: "form-cancel-btn",
                            extraClasses: ["btn-default", "btn-sm"],
                            title: "Press enter to cancel and close note",
                            label: "Cancel",
                            type: 'button'
                        }, {
                            control: "button",
                            id: "form-close-btn",
                            extraClasses: ["btn-default", "btn-sm"],
                            title: "Press enter to save and close note",
                            label: "Close",
                            type: 'button'
                        }, {
                            control: "button",
                            extraClasses: ["btn-primary", "btn-sm"],
                            title: "Press enter to sign note",
                            label: "Sign",
                            id: "form-sign-btn",
                            type: "submit"
                        }]
                    }]
                }]
            }];
            // *********************************************** END OF FIELDS ********************************************

            // *********************************************** MODEL ****************************************************
            // Okay to copy and paste - Please Add additional items to prepopulate the fields
            var FormModel = Backbone.Model.extend({
                defaults: {
                    name: "",
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
                template: Handlebars.compile('You will lose all work in progress if you cancel this note. Would you like to proceed?'),
                tagName: 'p'
            });
            var FooterView = Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile('{{ui-button "Cancel" classes="btn-default btn-sm" title="Press enter to cancel"}}{{ui-button "Continue" classes="btn-primary btn-sm" title="Press enter to continue"}}'),
                events: {
                    'click .btn-primary': function() {
                        ADK.UI.Alert.hide();
                        ADK.UI.Workflow.hide();
                    },
                    'click .btn-default': function() {
                        ADK.UI.Alert.hide();
                    }
                },
                tagName: 'span'
            });

            var formView = ADK.UI.Form.extend({
                ui: {
                    'CancelButton': '#form-cancel-btn',
                    'CloseButton': '#form-close-btn'
                },
                fields: F226Fields,
                events: {
                    "click @ui.CancelButton": function(e) {
                        e.preventDefault();
                        var closeAlertView = new ADK.UI.Alert({
                            title: 'Are you sure you want to cancel?',
                            icon: 'icon-warning',
                            messageView: CloseMessageView,
                            footerView: FooterView
                        });
                        closeAlertView.show();
                    },
                    "click @ui.CloseButton": function(e) {
                        if (!this.model.isValid())
                            this.model.set("formStatus", {
                                status: "error",
                                message: self.model.validationError
                            });
                        else {
                            this.model.unset("formStatus");
                            var saveAlertView = new ADK.UI.Notification({
                                title: 'Note Saved',
                                icon: 'fa-check',
                                message: 'Note successfully saved with no errors.',
                                type: "success"
                            });
                            saveAlertView.show();
                            ADK.UI.Workflow.hide();
                        }
                    },
                    "submit": function(e) {
                        e.preventDefault();
                        if (!this.model.isValid()) {
                            this.model.set("formStatus", {
                                status: "error",
                                message: self.model.validationError
                            });
                            this.transferFocusToFirstError();
                         } else {
                            this.model.unset("formStatus");
                            var saveAlertView = new ADK.UI.Notification({
                                title: 'Note Saved',
                                icon: 'fa-check',
                                message: 'Note successfully saved with no errors.',
                                type: "success"
                            });
                            saveAlertView.show();
                            ADK.UI.Workflow.hide();

                            // ********************* Go to signature form here *********************

                        }
                        return false;
                    }
                },
                modelEvents: {
                    // none
                }
            });
            // *********************************************** END OF FORM VIEW *****************************************

            // *********************************************** MODEL AND WORKFLOW INSTANCE ******************************
            // Okay to copy and paste
            var formModel = new FormModel();

            var workflowOptions = {
                title: "New Note",
                showProgress: false,
                keyboard: true,
                headerOptions: {
                    actionItems: [{
                        label: 'Preview',
                        onClick: function() {
                            // Preview functionality to go here
                        }
                    }, {
                        label: 'Print',
                        onClick: function() {
                            // Print functionality to go here
                        }
                    }, {
                        label: 'Delete',
                        onClick: function() {
                            // Delete functionality to go here
                        }
                    }],
                    closeButtonOptions: {
                        title: 'Press enter to save and close note',
                        onClick: function(){
                            // Save functionality to go here
                            ADK.UI.Workflow.hide();
                        }
                    }
                },
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
    return F226;
});
