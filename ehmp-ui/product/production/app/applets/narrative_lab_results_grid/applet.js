define([
    "backbone",
    "marionette",
    'underscore',
    "app/applets/narrative_lab_results_grid/appletHelpers",
    "app/applets/narrative_lab_results_grid/appletUiHelpers",
    "app/applets/narrative_lab_results_grid/gridView",
    "app/applets/narrative_lab_results_grid/details/detailsView",
    "app/applets/narrative_lab_results_grid/modal/modalView",
    "hbs!app/applets/narrative_lab_results_grid/templates/tooltip",
    'app/applets/narrative_lab_results_grid/modal/stackedGraph',
    'app/applets/orders/tray/labs/trayView',
    'app/applets/orders/tray/labs/trayUtils'
], function(Backbone, Marionette, _, AppletHelper, AppletUiHelper, GridView, DetailsView, ModalView, tooltip, StackedGraph, trayView, LabOrderTrayUtils) {
    "use strict";

    var _fetchOptions = {
        resourceTitle: 'patient-record-lab',
        pageable: true,
        cache: true,
        allowAbort: true,
        viewModel: {
            parse: function(response) {
                // Check 'codes' for LOINC codes and Standard test name.
                var lCodes = [];
                var testNames = [];
                if (response.codes) {
                    response.codes.forEach(function(code) {
                        if (code.system.indexOf("loinc") != -1) {
                            lCodes.push(" " + code.code);
                            testNames.push(" " + code.display);
                        }
                    });
                }
                response.loinc = lCodes;
                response.stdTestNames = testNames;

                var low = response.low,
                    high = response.high;

                if (low && high) {
                    response.referenceRange = low + '-' + high;
                }

                if (response.interpretationCode) {
                    var temp = response.interpretationCode.split(":").pop(),
                        flagTooltip = "",
                        labelClass = "label-danger";

                    if (temp === "HH") {
                        temp = "H*";
                        flagTooltip = "Critical High";
                    }
                    if (temp === "LL") {
                        temp = "L*";
                        flagTooltip = "Critical Low";
                    }
                    if (temp === "H") {
                        flagTooltip = "Abnormal High";
                        labelClass = "label-warning";
                    }
                    if (temp === "L") {
                        flagTooltip = "Abnormal Low";
                        labelClass = "label-warning";
                    }
                    response.interpretationCode = temp;
                    response.flagTooltip = flagTooltip;
                    response.labelClass = labelClass;
                }

                if (response.categoryCode) {
                    var categoryCode = response.categoryCode.slice(response.categoryCode.lastIndexOf(':') + 1);
                    switch (categoryCode) {
                        case 'EM':
                        case 'MI':
                        case 'SP':
                        case 'CY':
                        case 'AP':
                            response.result = 'View Report';
                            if (!response.typeName) {
                                response.typeName = response.categoryName;
                            }
                            response.pathology = true;
                            break;
                    }
                }
                return response;
            }
        }
    };

    var gistConfiguration = {
        //Collection fetchOptions

        gistModel: [{
            id: 'shortName',
            field: 'shortName'
        }, {
            id: 'displayName',
            field: 'normalizedName'
        }, {
            id: 'result',
            field: 'result'
        }, {
            id: 'previousInterpretationCode',
            field: 'previousInterpretationCode'
        }, {
            id: 'previousResult',
            field: 'previousResult'
        }, {
            id: 'units',
            field: 'units'
        }, {
            id: 'timeSince',
            field: 'timeSince'
        }, {
            id: 'observationType',
            field: 'observationType'
        }, {
            id: 'tooltip',
            field: 'tooltip'
        }],
        filterFields: ['shortName', 'typeName', 'normalizedName', 'timeSince', 'result', 'units'],
        gistHeaders: {
            header1: {
                title: 'Lab Test',
                sortable: true,
                sortType: 'alphabetical',
                key: 'shortName',
                hoverTip: 'labresults_description'
            },
            header2: {
                title: 'Result',
                sortable: true,
                sortType: 'numeric',
                key: 'result',
                hoverTip: 'labresults_results'
            },
            header3: {
                title: '',
                sortable: false,
            },
            header4: {
                title: 'Last',
                sortable: true,
                sortType: 'date',
                key: 'observed',
                hoverTip: 'labresults_last'
            }
        },
        defaultView: 'observation',
        enableHeader: 'true',
        graphOptions: {
            height: '19', //defaults to 20
            width: '90', //defaults to 80
            id: '',
            //abnormalRangeWidth: 14, //defaults to Math.floor(w / 6)
            //rhombusA: 6, //defaults to Math.floor(h / 2 * 0.7)
            //rhombusB: 4, //defaults to Math.floor(aw / 2 * 0.7)
            //radius: 3, //defaults to 3
            //minimumDistance: 10, //defaults to 10
            hasCriticalInterpretation: true, //defaults to false
        }
    };

    var InAPanelModel = Backbone.Model.extend({
        parse: _fetchOptions.viewModel.parse
    });

    var gridView;
    var GistView = ADK.Applets.BaseGridApplet.extend({
        initialize: function(options) {
            this._super = ADK.Applets.BaseGridApplet.prototype;

            var fetchOptions = _.clone(_fetchOptions);

            var dataGridOptions = {
                //filterFields: ['observed', 'typeName', 'flag', 'result', 'specimen', 'groupName', 'isPanel', 'units', 'referenceRange', 'facilityMoniker', 'labs.models'],
                filterFields: gistConfiguration.filterFields,
                formattedFilterFields: {
                    'observed': function(model, key) {
                        var val = model.get(key);
                        val = val.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})/, '$2/$3/$1 $4:$5');
                        return val;
                    }
                },
                gistView: true,
                appletConfiguration: gistConfiguration,
                DetailsView: DetailsView,
                onClickRow: function(model, event, gridView) {
                    event.preventDefault();

                    if (model.get('isPanel')) {
                        if (!$(event.currentTarget).data('isOpen')) {
                            $(event.currentTarget).data('isOpen', true);
                        } else {
                            var k = $(event.currentTarget).data('isOpen');
                            k = !k;
                            $(event.currentTarget).data('isOpen', k);
                        }

                        var i = $(event.currentTarget).find('.js-has-panel i');
                        if (i.length) {
                            if (i.hasClass('fa-chevron-up')) {
                                i.removeClass('fa-chevron-up')
                                    .addClass('fa-chevron-down');
                                $(event.currentTarget).data('isOpen', true);
                            } else {
                                i.removeClass('fa-chevron-down')
                                    .addClass('fa-chevron-up');
                                $(event.currentTarget).data('isOpen', false);
                            }
                        }
                        gridView.expandRow(model, event);
                    } else {
                        AppletUiHelper.getDetailView(model, event.currentTarget, dataGridOptions.collection, true, AppletUiHelper.showModal, AppletUiHelper.showErrorModal);
                    }
                },

                onClickAdd: LabOrderTrayUtils.launchLabForm,
                filterDateRangeEnabled: true,
                filterDateRangeField: {
                    name: "observed",
                    label: "Date",
                    format: "YYYYMMDD"
                }
            };

            var self = this;
            //date change handling
            this.listenTo(ADK.Messaging, 'globalDate:selected', function(dateModel) {
                // Bypass the global date filtering if All button is selected
                var selectedId = ADK.SessionStorage.getModel('globalDate').get('selectedId');
                if (selectedId !== 'allRangeGlobal') {
                    self.dataGridOptions.collection.fetchOptions.criteria.filter = self.buildJdsDateFilter('observed', options);
                } else {
                    delete self.dataGridOptions.collection.fetchOptions.criteria.filter;
                }

                self.loading();
                self.createDataGridView();
                ADK.ResourceService.fetchCollection(self.dataGridOptions.collection.fetchOptions, self.dataGridOptions.collection);
            });
            fetchOptions.onSuccess = function(collection) {
                var fullCollection = collection.fullCollection || collection;

                fullCollection.each(function(result) {
                    var resultAttributes = _.values(result.attributes);

                    if (typeof resultAttributes[0][0] === 'object' && !resultAttributes[0][0].code) {
                        var currentPanel = resultAttributes[0];
                        var currentPanelFirstLab = currentPanel[0];
                        var panelGroupName = _.keys(result.attributes)[0];

                        var group = panelGroupName,
                            id = group.replace(/\s/g, ''),
                            tempCode = "",
                            tempTooltip = "",
                            labelClass = "";

                        _.each(currentPanel, function(lab, i) {
                            lab = new InAPanelModel(InAPanelModel.prototype.parse(lab));

                            if (lab.attributes.interpretationCode == "H*") {
                                tempCode = "H*";
                                tempTooltip = "Critical High";
                                labelClass = "label-danger";

                            } else if (lab.attributes.interpretationCode == "L*") {
                                if (tempCode == "H" || tempCode == "L" || tempCode === "") {
                                    tempCode = "L*";
                                    tempTooltip = "Critical Low";
                                    labelClass = "label-danger";
                                }
                            } else if (lab.attributes.interpretationCode == "H") {
                                if (tempCode == "L" || tempCode === "") {
                                    tempCode = "H";
                                    tempTooltip = "Abnormal High";
                                    labelClass = "label-warning";
                                }
                            } else if (lab.attributes.interpretationCode == "L") {
                                if (tempCode === "") {
                                    tempCode = "L";
                                    tempTooltip = "Abnormal Low";
                                    labelClass = "label-warning";
                                }
                            }
                            currentPanel[i] = lab;
                        });

                        var tempUid = panelGroupName.replace(/\s/g, '') + "_" + currentPanelFirstLab.groupUid.replace(/\s/g, '');
                        tempUid = tempUid.replace('#', '');

                        result.set({
                            labs: new Backbone.Collection(currentPanel),
                            observed: currentPanelFirstLab.observed,
                            isPanel: 'Panel',
                            typeName: group,
                            panelGroupName: panelGroupName,
                            facilityCode: currentPanelFirstLab.facilityCode,
                            facilityMoniker: currentPanelFirstLab.facilityMoniker,
                            interpretationCode: tempCode,
                            flagTooltip: tempTooltip,
                            labelClass: labelClass,
                            uid: tempUid,
                            type: 'panel'
                        });
                    }
                });

                var sortedModels = _.sortBy(fullCollection.models, function(lab) {
                    return -(lab.attributes.observed);
                });

                fullCollection.set(sortedModels);

                if (options.appletConfig !== undefined && options.appletConfig.viewType !== undefined && options.appletConfig.viewType === 'gist') {
                    var modifiedCollection = self.modifyModel(fullCollection);
                    modifiedCollection = self.addTooltips(modifiedCollection, 4);
                    fullCollection.set(modifiedCollection.models);
                }
                var pageSize = (fullCollection.length) ? fullCollection.length : 1;
                dataGridOptions.collection.setPageSize(pageSize);
            };
            fetchOptions.criteria = {
                filter: this.buildJdsDateFilter('observed') + ',eq(categoryCode , "urn:va:lab-category:CH")'
            };

            dataGridOptions.collection = ADK.PatientRecordService.fetchCollection(fetchOptions);

            dataGridOptions.toolbarOptions = {
                buttonTypes: ['infobutton', 'detailsviewbutton'],
            };

            this.dataGridOptions = dataGridOptions;
            if (!self.isFullscreen) {
                if (dataGridOptions.gistView === true) {
                    this.dataGridOptions.SummaryView = ADK.Views.LabresultsGist.getView();
                    this.dataGridOptions.SummaryViewOptions = {
                        gistHeaders: gistConfiguration.gistHeaders,
                        enableTileSorting: true
                    };
                }
            }
            this._super.initialize.apply(this, arguments);

            this.listenTo(ADK.Messaging.getChannel('narrative_lab_results_grid'), 'addItem', function(e) {
                var addOrdersChannel = ADK.Messaging.getChannel('addALabOrdersRequestChannel');
                addOrdersChannel.trigger('addLabOrdersModal', event, gridView);
            });

            var message = ADK.Messaging.getChannel('narrative_lab_results');

            message.reply('gridCollection', function() {
                return self.gridCollection;
            });

        },

        onRender: function() {
            this._super.onRender.apply(this, arguments);
        },
        onDestroy: function(){
            var message = ADK.Messaging.getChannel('narrative_lab_results');
            message.stopReplying('gridCollection');
        },
        addTooltips: function(collectionItems, limit) {
            for (var i = 0; i < collectionItems.models.length; i++) {
                var attr = collectionItems.models[i].attributes;
                if (attr.oldValues) {
                    attr.limitedoldValues = attr.oldValues.splice(0, limit - 1);
                    if ((attr.oldValues.length - attr.limitedoldValues.length) > 0) {
                        attr.moreresultsCount = attr.oldValues.length - attr.limitedoldValues.length;
                    }
                }
                collectionItems.models[i].attributes.tooltip = tooltip(attr);
            }
            return collectionItems;
        },
        modifyModel: function(collectionItems) {
            var modifiedCollection = {};
            var appletid = this.dataGridOptions.appletId;

            //Create deep clone for collection
            _.extend(modifiedCollection, collectionItems);
            //Reset models field for the new collection
            modifiedCollection.models = [];

            for (var i = 0; i < collectionItems.models.length; i++) {
                //Only laboratory results should be visible
                if (collectionItems.models[i].attributes.kind !== undefined && collectionItems.models[i].attributes.kind === 'Laboratory') {
                    //Add applet_id to model (used in toolbarview to trigger detailview)
                    collectionItems.models[i].attributes.applet_id = appletid;
                    //Add fields necessary to the gist mmodel
                    collectionItems.models[i].attributes.timeSince = AppletHelper.setTimeSince(collectionItems.models[i].attributes.observed);
                    collectionItems.models[i].attributes.observedFormatted = AppletHelper.getObservedFormatted(collectionItems.models[i].attributes.observed);
                    collectionItems.models[i].attributes.numericTime = AppletHelper.getNumericTime(collectionItems.models[i].attributes.timeSince);
                    collectionItems.models[i].attributes.observationType = 'labs';
                    collectionItems.models[i].attributes.shortName = collectionItems.models[i].attributes.typeName;
                    if (collectionItems.models[i].attributes.typeName.indexOf(',') >= 0) {
                        collectionItems.models[i].attributes.shortName = collectionItems.models[i].attributes.typeName.substring(0, collectionItems.models[i].attributes.typeName.indexOf(','));
                    }
                    collectionItems.models[i].attributes.graphOptions = gistConfiguration.graphOptions;
                    collectionItems.models[i].attributes.normalizedName = collectionItems.models[i].attributes.typeName.replace(/\W/g, '_');
                    //Initialize modifiedCollection models field.
                    if (modifiedCollection.models.length === 0) {
                        modifiedCollection.models.push(collectionItems.models[i]);
                    } else {
                        //found is true when we find another item in the modifiedCollection with the same typeName
                        var found = false;
                        for (var j = 0; j < modifiedCollection.models.length; j++) {
                            //If the modifiedCollection item has the same typeName as the initial collectionItems item
                            if ((modifiedCollection.models[j].attributes.facilityCode === 'DOD' && collectionItems.models[i].facilityCode === 'DOD' &&
                                    modifiedCollection.models[j].attributes.codes[0].code === collectionItems.models[i].attributes.codes[0].code) ||
                                (modifiedCollection.models[j].attributes.typeCode && modifiedCollection.models[j].attributes.typeCode === collectionItems.models[i].attributes.typeCode) ||
                                (modifiedCollection.models[j].attributes.typeName === collectionItems.models[i].attributes.typeName)) {
                                //We will put the old values with the same typeName in the oldValues array within the attributes
                                if (modifiedCollection.models[j].attributes.oldValues === undefined) {
                                    //Initialize the oldValues if this is the second value found in the collectionItems
                                    modifiedCollection.models[j].attributes.oldValues = [];
                                    //Previous value represents the second value with the same typeName of the collectionItems array
                                    modifiedCollection.models[j].attributes.previousResult = collectionItems.models[i].attributes.result;
                                    modifiedCollection.models[j].attributes.previousInterpretationCode = collectionItems.models[i].attributes.interpretationCode;
                                }
                                modifiedCollection.models[j].attributes.oldValues.push(collectionItems.models[i]);
                                found = true;
                            }
                        }
                        //If this is the first time when we encounter the typeName we add it to the modifiedCollection
                        if (!found) modifiedCollection.models.push(collectionItems.models[i]);
                    }
                }

            }
            modifiedCollection.length = modifiedCollection.models.length;
            return modifiedCollection;
        }
    });

    var applet = {
        id: 'narrative_lab_results_grid',
        viewTypes: [{
            type: 'summary',
            view: GridView.extend({
                columnsViewType: "summary"
            }),
            chromeEnabled: true
        }, {
            type: 'expanded',
            view: GridView.extend({
                columnsViewType: "expanded"
            }),
            chromeEnabled: true
        }, {
            //new writeback code added from ADK documentation
            type: 'writeback',
            view: trayView,
            chromeEnabled: false
        }],
        defaultViewType: 'summary'
    };


    // expose detail view through messaging
    var channel = ADK.Messaging.getChannel(applet.id);

    channel.on('detailView', function(params) {
        var modalView = new ModalView.ModalView({
            model: params.model,
            navHeader: false,
        });

        var modalOptions = {
            'fullScreen': self.isFullscreen,
            'size': "large",
            'title': params.model.get('typeName')
        };

        var modal = new ADK.UI.Modal({
            view: modalView,
            options: modalOptions
        });

        modal.show();
    });

    // get the chart for the StackedGraph applet
    channel.reply('chartInfo', function(params) {

        var displayName = params.typeName;
        var ChartModel = Backbone.Model.extend({});
        var chartModel = new ChartModel({
            typeName: params.typeName,
            displayName: displayName,
            requesterInstanceId: params.instanceId,
            graphType: params.graphType,
            applet_id: applet.id
        });

        var response = $.Deferred();

        var stackedGraph = new StackedGraph({
            model: chartModel,
            target: null,
            requestParams: params
        });

        response.resolve({
            view: stackedGraph
        });

        return response.promise();
    });

    return applet;
});
