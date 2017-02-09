define([
    'backbone',
    'marionette',
    'underscore',
    'handlebars',
    'moment',
    'backgrid',
    'app/applets/todo_list/eventHandler',
    'app/applets/todo_list/columnsConfig',
    'app/applets/todo_list/toolbar/toolbarView',
    'app/applets/todo_list/statusView',
    'app/applets/todo_list/statusNotCompletedView',
    'hbs!app/applets/todo_list/templates/statusModalFooterTemplate'
], function(Backbone, Marionette, _, Handlebars, moment, Backgrid, EventHandler, ColumnsConfig, ToolbarView, StatusView, StatusNotCompletedView, StatusModalFooterTemplate) {
    "use strict";


    var Config = ColumnsConfig;
    var columns, collection;
    var session;

    var TaskCollection = Backbone.PageableCollection.extend({});

    var filterByDueDate = function(collection) {
        var filtered = collection.filter(function(model) {
            return model.get("dueTextValue") < 1;
        });
        return new TaskCollection(filtered);
    };

    var MenuItem = Backbone.Model.extend({
        defaults: {
            'displayText': 'Me',
            'value': 'teamroles',
            'show': true
        }
    });
    var MenuItems = Backbone.Collection.extend({
        model: MenuItem
    });

    var assignedToOptions = new MenuItems([{
        'displayText': 'Me',
        'value': 'teamroles'
    }, {
        'displayText': 'My Teams',
        'value': 'teams'
    }, {
        'displayText': 'Anyone',
        'value': 'any',
        'show': function() {
            return !isStaffView();
        }
    }]);

    var statusOptions = new MenuItems([{
        'displayText': 'Active',
        'value': 'Active'
    }, {
        'displayText': 'Inactive',
        'value': 'Inactive'
    }, {
        'displayText': 'All',
        'value': 'All'
    }]);

    //the following model is shared between the applet and the toolbar view
    var SharedModel = Backbone.Model.extend({
        defaults: {
            assignedTo: 'teamroles',
            status: 'Active',
            dateFilter: {}
        }
    });

    var priority = {
        0: 'High',
        1: 'High',
        2: 'High',
        3: 'High',
        4: 'Medium',
        5: 'Medium',
        6: 'Medium',
        7: 'Low',
        8: 'Low',
        9: 'Low',
        10: 'Low'
    };

    var statusMappings = {
        'Active': ['Created', 'Ready', 'Reserved', 'InProgress'],
        'Inactive': ['Completed', 'Failed', 'Exited', 'Suspended'],
        'All': ['All']
    };

    var fetchOptions = {
        resourceTitle: 'tasks-tasks',
        fetchType: 'POST',
        pageable: false,
        cache: false,
        viewModel: {
            parse: function(response) {
                response.DUEDATEFORMATTED = moment(response.DUE).isValid() ? moment(response.DUE).format('MM/DD/YYYY') : 'N/A';
                response.EXPIRATIONTIMEFORMATTED = moment(response.EXPIRATIONTIME).isValid() ? moment(response.EXPIRATIONTIME).format('MM/DD/YYYY') : 'N/A';
                response.earliestDateMilliseconds = moment(response.DUE).valueOf();
                response.dueDateMilliseconds = moment(response.EXPIRATIONTIME).valueOf();
                _.extend(response, setOverdueText(response.DUE, response.EXPIRATIONTIME));

                if (response.PRIORITY !== undefined) {
                    response.priorityFormatted = priority[response.PRIORITY];
                }

                response.statusFormatted = _.findKey(statusMappings, function(mapping) {
                    return _.indexOf(mapping, response.STATUS) > -1;
                }, response);

                response.ACTIVE = (response.statusFormatted === 'Active');

                if (!_.isNull(response.PATIENTNAME) && !_.isUndefined(response.PATIENTNAME) && response.PATIENTNAME !== '') {
                    response.PATIENTNAMESSN = response.PATIENTNAME + ' (' + response.LAST4 + ')';
                }
                response.hasPermissions = hasPermissions(response);

                return response;
            }
        },
        onSuccess: function(collection) {
            // Default sorting
            var sortedCollection = _.sortBy(collection.models, function(obj) {
                var sortValue = 0;
                var dueDateVal = 0;
                var dueStatusVal = obj.get('dueTextValue') * 1 + 1;
                var priorityVal = Math.floor((obj.get('PRIORITY')) / 3.5);
                if (!_.isNull(obj.get('DUE'))) {
                    dueDateVal = obj.get('earliestDateMilliseconds');
                }
                var activeSort = obj.get('ACTIVE') ? 0 : 1;
                sortValue = parseInt('1' + activeSort + dueStatusVal + priorityVal + dueDateVal);
                return sortValue;
            });
            if (collection.fetchOptions.viewType === 'summary') {
                sortedCollection = filterByDueDate(sortedCollection).models;
            }
            collection.reset(sortedCollection, {
                silent: true
            });
            collection.trigger('sort', collection);
        }
    };

    var isStaffView = function() {
        var requestView = ADK.Messaging.request('get:current:screen').config.id;
        return (requestView === 'provider-centric-view' || requestView === 'todo-list-provider-full');
    };

    var hasPermissions = function(task) {
        var permission = task.PERMISSION;
        if (_.isUndefined(permission) || _.isNull(permission)) {
            return true;
        }
        if (_.isEmpty(permission.ehmp) && _.isEmpty(permission.user)) {
            return true;
        }
        var userSession = ADK.UserService.getUserSession();
        var userId = userSession.get('duz')[userSession.get('site')];
        if (ADK.UserService.hasPermissions(permission.ehmp.join('|'))) {
            if (_.isEmpty(permission.user) || _.contains(permission.user, userId)) {
                return true;
            }
        }
        if (_.contains(permission.user, userId)) {
            if (_.isEmpty(permission.ehmp)) {
                return true;
            }
        }
        return false;
    };


    var view = ADK.AppletViews.GridView.extend({
        _super: ADK.AppletViews.GridView.prototype,
        sites: [],
        initialize: function(options) {
            var self = this;
            var toolbarView, sharedModel, assignedTo, status, dateFilter;

            this.isStaffView = isStaffView();
            this.taskCollection = new TaskCollection();
            this.fetchOptions = {
                viewType: this.columnsViewType
            };
            _.extend(this.fetchOptions, fetchOptions);
            this.expandedAppletId = this.options.appletConfig.instanceId;
            if (this.options.appletConfig.fullScreen) {
                this.parentWorkspace = ADK.Messaging.request('get:current:workspace');
                var expandedModel = ADK.SessionStorage.get.sessionModel('expandedAppletId');
                if (!_.isUndefined(expandedModel) && !_.isUndefined(expandedModel.get('id'))) {
                    this.expandedAppletId = expandedModel.get('id');
                }
            }

            assignedTo = ADK.SessionStorage.getAppletStorageModel(this.expandedAppletId, 'assignedTo', true, this.parentWorkspace) || 'teamroles';
            if (this.columnsViewType === 'summary') {
                status = 'Active';
            } else {
                status = ADK.SessionStorage.getAppletStorageModel(this.expandedAppletId, 'status', true, this.parentWorkspace) || 'Active';
            }
            if (isStaffView()) {
                dateFilter = {
                    fromDate: moment().subtract('years', 2).format('MM/DD/YYYY'),
                    toDate: moment().add('months', 6).format('MM/DD/YYYY')
                };
            } else {
                dateFilter = ADK.SessionStorage.getModel('globalDate').toJSON();
            }

            if (this.sharedModel === undefined) {
                this.sharedModel = new SharedModel({
                    assignedTo: assignedTo,
                    status: status,
                    dateFilter: dateFilter
                });
            }
            this.assignedToOptionChanged = function(model) {
                assignedTo = model.get('assignedTo');
                self.fetchOptions.criteria.subContext = assignedTo;
                this.refresh();
            };

            this.statusOptionChanged = function(model) {
                status = model.get('status');
                self.fetchOptions.criteria.status = statusMappings[status].toString();
                this.refresh();
            };

            this.dateFilterChanged = function(model) {
                var fromDate, toDate;
                dateFilter = model.get('dateFilter');
                if (!_.isUndefined(dateFilter) && !_.isNull(dateFilter)) {
                    fromDate = moment(dateFilter.fromDate).startOf('day').format('YYYYMMDDHHmm');
                    toDate = moment(dateFilter.toDate).endOf('day').format('YYYYMMDDHHmm');
                }
                this.fetchOptions.criteria.startDate = fromDate;
                this.fetchOptions.criteria.endDate = toDate;
                if (status !== 'Active') {
                    this.$el.find("[name='assignedTo']").prop('disabled', true);
                    this.$el.find("[name='status']").prop('disabled', true);
                    this.refresh();
                }
            };

            this.listenTo(this.sharedModel, 'change:assignedTo', this.assignedToOptionChanged);
            this.listenTo(this.sharedModel, 'change:status', this.statusOptionChanged);
            this.listenTo(this.sharedModel, 'change:dateFilter', this.dateFilterChanged);
            this.listenTo(ADK.Messaging, 'globalDate:selected', function(dateModel) {
                self.dateRangeRefresh('DUEDATEFORMATTED', dateModel.toJSON());
            });

            if (isStaffView()) {
                //provider data
                this.fetchOptions.criteria = {
                    context: "user",
                    subContext: assignedTo,
                    status: statusMappings[status].toString(),
                    getNotifications: true
                };
                columns = Config[this.columnsViewType].columns.provider;
            } else {
                //patient data
                this.fetchOptions.criteria = {
                    context: "patient",
                    patientICN: ADK.PatientRecordService.getCurrentPatient().get('pid'),
                    subContext: assignedTo,
                    status: statusMappings[status].toString(),
                    getNotifications: true
                };
                columns = Config[this.columnsViewType].columns.patient;
            }
            this.fetchOptions.criteria.startDate = moment(dateFilter.fromDate).startOf('day').format('YYYYMMDDHHmm');
            this.fetchOptions.criteria.endDate = moment(dateFilter.toDate).endOf('day').format('YYYYMMDDHHmm');

            this.taskCollection = ADK.ResourceService.fetchCollection(this.fetchOptions);
            this.listenTo(this.taskCollection, 'fetch:success', function(fetchedModel) {
                this.$el.find("[name='assignedTo']").removeAttr('disabled');
                this.$el.find("[name='status']").removeAttr('disabled');
            });
            this.listenTo(this.taskCollection, 'fetch:error', function(fetchedModel) {
                this.$el.find("[name='assignedTo']").removeAttr('disabled');
                this.$el.find("[name='status']").removeAttr('disabled');
            });

            toolbarView = new ToolbarView({
                instanceId: options.appletConfig.instanceId,
                assignedToOptions: assignedToOptions,
                statusOptions: statusOptions,
                sharedModel: this.sharedModel,
                expandedAppletId: this.expandedAppletId,
                parentWorkspace: this.parentWorkspace,
                isSummaryView: (this.columnsViewType === 'summary'),
                isStaffView: isStaffView()
            });

            this.appletOptions = {
                columns: columns,
                collection: this.taskCollection,
                filterFields: _.union(_.pluck(columns, 'name'), ['dueDate'], ['INSTANCENAME']),
                onClickRow: this.onClickRow,
                parent: self,
                toolbarView: toolbarView,
                filterDateRangeEnabled: true,
                filterDateRangeField: {
                    name: "DUEDATEFORMATTED",
                    label: "Date",
                    format: "YYYYMMDDHHmm"
                }
            };

            var siteOptions = {
                resourceTitle: 'authentication-list',
                cache: false
            };
            siteOptions.onError = function(resp) {};
            siteOptions.onSuccess = function(collection, resp) {
                self.sites = collection;
            };
            ADK.ResourceService.fetchCollection(siteOptions);
            this.listenTo(ADK.Messaging.getChannel('activities'), 'create:success', function() {
                ADK.Messaging.trigger('refresh:applet:todo_list');
            });

            ADK.Messaging.on('refresh:applet:todo_list', function() {
                var collection = self.appletOptions.collection;

                if (!_.isUndefined(self.appletContainer)) {
                    self.loading();
                    self.setAppletView();
                }

                if (collection instanceof Backbone.PageableCollection) {
                    collection.fullCollection.reset();
                } else {
                    collection.reset();
                }

                ADK.ResourceService.clearCache(collection.url);
                ADK.ResourceService.fetchCollection(collection.fetchOptions, collection);
            });
            self._super.initialize.apply(self, arguments);
            //end of initialize
        },
        onBeforeDestroy: function() {
            ADK.Messaging.getChannel('task_forms').off('modal:close');
        },
        onShow: function() {
            if (this.appletOptions.appletConfig.fullScreen) {
                if (isStaffView()) {
                    this.$el.find('#2yr-range-' + this.appletOptions.appletId).addClass('active-range');
                }
                this.$el.find('#filter-from-date-' + this.appletOptions.appletId).val(this.sharedModel.get('dateFilter').fromDate);
                this.$el.find('#filter-to-date-' + this.appletOptions.appletId).val(this.sharedModel.get('dateFilter').toDate);
            }
            this._super.onShow.apply(this, arguments);
        },
        onRender: function() {
            this._super.onRender.apply(this, arguments);
        },
        dateRangeRefresh: function(filterParameter, options) {
            this.sharedModel.set('dateFilter', options);
        },
        onClickRow: function(model, event) {
            var reason = '',
                modalModel, view, modalOptions, modal, headerView, footerView;

            footerView = Backbone.Marionette.ItemView.extend({
                template: StatusModalFooterTemplate,
                model: new Backbone.Model({
                    patientId: model.get('PATIENTICN'),
                    params: {
                        processId: model.get('PROCESSINSTANCEID')
                    }
                }),
                events: {
                    'click #activDetailBtn': 'activDetail'
                },
                event: event,
                activDetail: function(event) {
                    event.preventDefault();
                    var params = this.model.get('params');
                    ADK.PatientRecordService.setCurrentPatient(this.model.get('patientId'), {
                        reconfirm: isStaffView(),
                        navigation: false,
                        callback: function() {
                            ADK.Messaging.getChannel('task_forms').request('activity_detail', params);
                        }
                    });
                }
            });
            if (model.get('STATUS') === 'Completed') {
                headerView = Backbone.Marionette.ItemView.extend({
                    template: Handlebars.compile('<h4 class="top-margin-no all-padding-no left-margin-sm right-margin-sm"><i class="fa fa-check color-secondary right-padding-sm" aria-hidden="true"></i>Task Completed</h4>')
                });

                reason = 'This task has been completed and there are no further actions that need to be taken.';
                modalModel = {
                    reason: reason
                };
                view = new StatusView({
                    model: new Backbone.Model(modalModel)
                });
                modalOptions = {
                    'size': 'normal',
                    'headerView': headerView,
                    'footerView': footerView
                };
                modal = new ADK.UI.Modal({
                    view: view,
                    options: modalOptions
                });
                modal.show();
            } else if (model.get('ACTIVE') && (model.get('dueTextValue') !== 1) && model.get('hasPermissions')) {
                var req = ADK.Messaging.request('get:current:screen').config.id;
                if (req === 'provider-centric-view' || req === 'todo-list-provider-full') {
                    session = new Backbone.Model({});
                    session.attributes = _.cloneDeep(ADK.SessionStorage.get.sessionModel("patient").attributes);
                }
                EventHandler.todoListViewOnClickRow.call(this.parent, model, event, session);
                event.currentTarget.focus();
            } else {
                headerView = Backbone.Marionette.ItemView.extend({
                    template: Handlebars.compile('<h4 class="top-margin-no all-padding-no left-margin-sm right-margin-sm"><i class="fa fa-ban font-size-16 color-primary-dark right-padding-sm" aria-hidden="true"></i>Task Cannot Be Completed</h4>')
                });

                modalModel = {
                    reason: reason,
                    icon: 'fa-exclamation-circle',
                    color: 'color-red'
                };
                view = new StatusNotCompletedView({
                    model: new Backbone.Model(modalModel)
                });
                modalOptions = {
                    'size': 'xsmall',
                    'headerView': headerView,
                    'footerView': footerView
                };
                modal = new ADK.UI.Modal({
                    view: view,
                    options: modalOptions
                });
                modal.show();
            }
        }
    });

    return view;

    function hashCode(input) {
        var hash = 0;
        if (input.length === 0) return hash;
        for (var i = 0; i < input.length; i++) {
            var character = input.charCodeAt(i);
            hash = ((hash << 5) - hash) + character;
            hash = hash & hash;
        }
        return hash;
    }

    function setOverdueText(dueDate, pastDueDate) {

        var ret = {
            '-1': {
                dueText: 'Past due',
                dueTextClass: 'text-danger',
                dueTextValue: -1
            },
            '0': {
                dueText: 'Due',
                dueTextClass: '',
                dueTextValue: 0
            },
            '1': {
                dueText: '',
                dueTextClass: '',
                dueTextValue: 1
            }
        };

        if (moment().isAfter(pastDueDate, 'day')) {
            return ret[-1];
        }

        if (moment().isSameOrAfter(dueDate, 'day') && (moment().isSameOrBefore(pastDueDate, 'day') || !moment(pastDueDate).isValid())) {
            return ret[0];
        }

        return ret[1];
    }


    //end of function
});