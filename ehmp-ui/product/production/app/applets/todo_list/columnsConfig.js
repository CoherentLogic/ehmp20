define([
    'underscore',
    'backgrid',
    'hbs!app/applets/todo_list/templates/dueStatusTemplateSummary',
    'hbs!app/applets/todo_list/templates/dueStatusTemplateExpanded',
    'hbs!app/applets/todo_list/templates/actionTemplate',
    'hbs!app/applets/todo_list/templates/taskNameTemplate',
    'hbs!app/applets/todo_list/templates/taskNameStaffTemplate',
    'hbs!app/applets/todo_list/templates/activityTemplateExpanded',
    'hbs!app/applets/todo_list/templates/actionHeaderTemplate',
    'hbs!app/applets/todo_list/templates/notificationTemplate',
], function(_, Backgrid, dueStatusSummary, dueStatusExpanded, actionTemplate, taskName, taskNameStaff, activityExpanded, actionHeaderTemplate, notificationTemplate) {
    'use strict';

    var customPrioritySort = function(model, sortKey) {
        if (model instanceof Backbone.Model) {
            return -model.get("PRIORITY");
        } else return -model.priority;
    };
    var customDueDateSort = function(model, sortKey) {
        if (model instanceof Backbone.Model) {
            if (!model.get('ACTIVE')) {
                return '';
            } else {
                return parseInt('' + (model.get('dueTextValue') * 1 + 1) + model.get("earliestDateMilliseconds"));
            }
        } else if (!model.ACTIVE) {
            return '';
        } else {
            return parseInt('' + (model.dueTextValue * 1 + 1) + model.earliestDateMilliseconds);
        }
    };
    var customEarliestDateSort = function(model, sortKey) {
        if (model instanceof Backbone.Model) {
            return model.get("earliestDateMilliseconds");
        } else return model.earliestDateMilliseconds;
    };
    var customPastDueDateSort = function(model, sortKey) {
        if (model instanceof Backbone.Model) {
            return model.get("dueDateMilliseconds");
        } else return model.dueDateMilliseconds;
    };
    var customArrowSort = function(model, sortKey) {
        if (model instanceof Backbone.Model) {
            return -(model.get("ACTIVE") && model.get("dueTextValue") !== 1 && model.get("hasPermissions"));
        } else return -(model.ACTIVE && model.dueTextValue !== 1 && model.get("hasPermissions"));
    };
    var customTaskNameSort = function(model, sortKey) {
        if (model instanceof Backbone.Model) {
            return (model.get("TASKNAME") + model.get("INSTANCENAME"));
        } else return (model.TASKNAME + model.INSTANCENAME);
    };

    var actionColumn = {
        name: 'ACTION',
        label: '->',
        headerCellTemplate: actionHeaderTemplate,
        flexWidth: 'flex-width-comment flex-width-0_5',
        cell: Backgrid.HandlebarsCell.extend({
            className: 'handlebars-cell flex-width-comment flex-width-0_5'
        }),
        template: actionTemplate,
        sortValue: customArrowSort
    };

    var notificationColumn = {
        name: 'NOTIFICATION',
        label: '',
        flexWidth: 'flex-width-comment flex-width-0_5',
        cell: Backgrid.HandlebarsCell.extend({
            className: 'handlebars-cell flex-width-comment flex-width-0_5',
            render: function() {
                this.$el.empty();
                this.$el.html(this.column.get('template')(this.model.toJSON()));
                this.$el.tooltip({
                    container: 'body',
                    placement: 'auto top',
                    title: this.model.get('NOTIFICATIONTITLE')
                });
                this.delegateEvents();
                return this;
            },
            remove: function() {
                this.$el.tooltip('destroy');
            }
        }),
        template: notificationTemplate,
        sortable: false
    };

    var taskNameColumnExpanded = {
        name: 'TASKNAME',
        label: 'Task Name',
        flexWidth: 'flex-width-3',
        cell: Backgrid.HandlebarsCell.extend({
            className: 'handlebars-cell flex-width-3'
        }),
        template: taskName,
        sortValue: customTaskNameSort
    };

    var taskNameColumnSummary = {
        name: 'TASKNAME',
        label: 'Task Name',
        flexWidth: 'flex-width-3',
        cell: Backgrid.HandlebarsCell.extend({
            className: 'handlebars-cell flex-width-3',
            render: function() {
                this.$el.empty();
                this.$el.html(this.column.get('template')(this.model.toJSON()));
                this.$el.tooltip({
                    container: 'body',
                    placement: 'auto top',
                    title: this.model.get('DESCRIPTION')
                });
                this.delegateEvents();
                return this;
            },
            remove: function() {
                this.$el.tooltip('destroy');
            }
        }),
        template: taskNameStaff,
        sortValue: customTaskNameSort
    };

    var Config = {
        summary: {
            columns: {
                provider: [notificationColumn, actionColumn, {
                        name: 'priorityFormatted',
                        label: 'Priority',
                        cell: Backgrid.StringCell.extend({
                            className: 'string-cell'
                        }),
                        sortValue: customPrioritySort
                    }, {
                        name: 'dueText',
                        label: 'Due',
                        cell: Backgrid.HandlebarsCell.extend({
                            className: 'handlebars-cell'
                        }),
                        template: dueStatusSummary,
                        sortValue: customDueDateSort
                    }, {
                        name: 'PATIENTNAMESSN',
                        label: 'Patient Name',
                        cell: Backgrid.StringCell.extend({
                            className: 'string-cell'
                        })
                    },
                    taskNameColumnSummary
                ],
                patient: [notificationColumn, actionColumn, {
                        name: 'priorityFormatted',
                        label: 'Priority',
                        cell: Backgrid.StringCell.extend({
                            className: 'string-cell'
                        }),
                        sortValue: customPrioritySort
                    }, {
                        name: 'dueText',
                        label: 'Due',
                        cell: Backgrid.HandlebarsCell.extend({
                            className: 'handlebars-cell'
                        }),
                        template: dueStatusSummary,
                        sortValue: customDueDateSort
                    },
                    taskNameColumnSummary
                ]
            }
        },
        expanded: {
            columns: {
                provider: [notificationColumn, actionColumn, {
                        name: 'priorityFormatted',
                        label: 'Priority',
                        cell: Backgrid.StringCell.extend({
                            className: 'string-cell'
                        }),
                        sortValue: customPrioritySort
                    }, {
                        name: 'dueText',
                        label: 'Due Status',
                        cell: Backgrid.HandlebarsCell.extend({
                            className: 'handlebars-cell'
                        }),
                        template: dueStatusExpanded,
                        sortValue: customDueDateSort
                    }, {
                        name: 'DUEDATEFORMATTED',
                        label: 'Earliest Date',
                        flexWidth: 'flex-width-2',
                        cell: Backgrid.StringCell.extend({
                            className: 'string-cell flex-width-2'
                        }),
                        sortValue: customEarliestDateSort
                    }, {
                        name: 'EXPIRATIONTIMEFORMATTED',
                        label: 'Latest Date',
                        flexWidth: 'flex-width-2',
                        cell: Backgrid.StringCell.extend({
                            className: 'string-cell flex-width-2'
                        }),
                        sortValue: customPastDueDateSort
                    }, {
                        name: 'PATIENTNAMESSN',
                        label: 'Patient Name',
                        flexWidth: 'flex-width-2',
                        cell: Backgrid.StringCell.extend({
                            className: 'string-cell flex-width-2'
                        })
                    },
                    taskNameColumnExpanded, {
                        name: 'DESCRIPTION',
                        label: 'Description',
                        flexWidth: 'flex-width-4_5',
                        cell: Backgrid.StringCell.extend({
                            className: 'string-cell flex-width-4_5',
                        })
                    }, {
                        name: 'INTENDEDFOR',
                        label: 'Assigned To',
                        flexWidth: 'flex-width-2',
                        cell: Backgrid.StringCell.extend({
                            className: 'string-cell flex-width-2'
                        })
                    }, {
                        name: 'statusFormatted',
                        label: 'Status',
                        flexWidth: 'flex-width-1_5',
                        cell: Backgrid.StringCell.extend({
                            className: 'string-cell flex-width-1_5'
                        })
                    }, {
                        name: 'ACTIVITYDOMAIN',
                        label: 'Activity Domain',
                        flexWidth: 'flex-width-3',
                        cell: Backgrid.StringCell.extend({
                            className: 'string-cell flex-width-3 transform-text-capitalize'
                        })
                    }, {
                        name: 'ACTIVITYNAME',
                        label: 'Go to',
                        flexWidth: 'flex-width-2_5',
                        cell: Backgrid.HandlebarsCell.extend({
                            className: 'handlebars-cell flex-width-2_5',
                            events: {
                                'click button': "onClickAction"
                            },
                            onClickAction: function(event) {
                                event.stopPropagation();
                                showActivityModal(this.model);
                            }
                        }),
                        template: activityExpanded
                    }
                ],
                patient: [notificationColumn, actionColumn, {
                        name: 'priorityFormatted',
                        label: 'Priority',
                        flexWidth: 'flex-width-2_5',
                        cell: Backgrid.StringCell.extend({
                            className: 'string-cell flex-width-2_5'
                        }),
                        sortValue: customPrioritySort
                    }, {
                        name: 'dueText',
                        label: 'Due Status',
                        flexWidth: 'flex-width-3',
                        cell: Backgrid.HandlebarsCell.extend({
                            className: 'handlebars-cell flex-width-3'
                        }),
                        template: dueStatusExpanded,
                        sortValue: customDueDateSort
                    }, {
                        name: 'DUEDATEFORMATTED',
                        label: 'Earliest Date',
                        flexWidth: 'flex-width-4',
                        cell: Backgrid.StringCell.extend({
                            className: 'string-cell flex-width-4'
                        }),
                        sortValue: customEarliestDateSort
                    }, {
                        name: 'EXPIRATIONTIMEFORMATTED',
                        label: 'Latest Date',
                        flexWidth: 'flex-width-3_5',
                        cell: Backgrid.StringCell.extend({
                            className: 'string-cell flex-width-3_5'
                        }),
                        sortValue: customPastDueDateSort
                    },
                    taskNameColumnExpanded, {
                        name: 'DESCRIPTION',
                        label: 'Description',
                        flexWidth: 'flex-width-4',
                        cell: Backgrid.StringCell.extend({
                            className: 'string-cell flex-width-4',
                        })
                    }, {
                        name: 'INTENDEDFOR',
                        label: 'Assigned To',
                        flexWidth: 'flex-width-3_5',
                        cell: Backgrid.StringCell.extend({
                            className: 'string-cell flex-width-3_5'
                        })
                    }, {
                        name: 'statusFormatted',
                        label: 'Status',
                        flexWidth: 'flex-width-2',
                        cell: Backgrid.StringCell.extend({
                            className: 'string-cell flex-width-2'
                        })
                    }, {
                        name: 'ACTIVITYDOMAIN',
                        label: 'Activity Domain',
                        flexWidth: 'flex-width-5',
                        cell: Backgrid.StringCell.extend({
                            className: 'string-cell flex-width-5 transform-text-capitalize'
                        })
                    }, {
                        name: 'ACTIVITYNAME',
                        label: 'Go to',
                        flexWidth: 'flex-width-3',
                        cell: Backgrid.HandlebarsCell.extend({
                            className: 'handlebars-cell flex-width-3',
                            events: {
                                'click button': "onClickAction"
                            },
                            onClickAction: function(event) {
                                event.stopPropagation();
                                showActivityModal(this.model);
                            }
                        }),
                        template: activityExpanded
                    }
                ]
            }
        }
    };

    return Config;

    function isStaffView() {
        var requestView = ADK.Messaging.request('get:current:screen').config.id;
        return (requestView === 'provider-centric-view' || requestView === 'todo-list-provider-full');
    }

    function showActivityModal(model) {
        var params = {
            processId: model.get('PROCESSINSTANCEID')
        };
        ADK.PatientRecordService.setCurrentPatient(model.get('PATIENTICN'), {
            reconfirm: isStaffView(),
            navigation: false,
            callback: function() {
                ADK.Messaging.getChannel('task_forms').request('activity_detail', params);
            }
        });
    }
});