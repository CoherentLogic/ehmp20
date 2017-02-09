define([
    "jquery",
    "jquery.inputmask",
    "moment",
    "backbone",
    "marionette",
    "underscore",
    "handlebars",
    "highcharts",
    "app/applets/lab_results_grid/appletHelpers",
    "hbs!app/applets/lab_results_grid/list/dateTemplate",
    "hbs!app/applets/lab_results_grid/list/resultTemplate",
    "hbs!app/applets/lab_results_grid/list/siteTemplate",
    "hbs!app/applets/lab_results_grid/list/flagTemplate",
    "hbs!app/applets/lab_results_grid/modal/modalTemplate",
    // "hbs!app/applets/lab_results_grid/modal/totalTestsTemplate",
    "app/applets/lab_results_grid/modal/filterDateRangeView"
], function($, InputMask, moment, Backbone, Marionette, _, Handlebars, Highcharts, AppletHelper, dateTemplate, resultTemplate, siteTemplate, flagTemplate, modalTemplate, FilterDateRangeView) {
    'use strict';

    var currentModel, currentCollection, gridOptions = {},
        columns, DataGridCollection, chartOptions, Chart, categories, data = {},
        low, high,
        TotalTestModel = [],
        dataCollection;


    DataGridCollection = Backbone.Collection.extend({});

    columns = [{
        name: "observed",
        label: "Date",
        template: dateTemplate,
        cell: "handlebars",
        sortable: false
    }, {
        name: "flag",
        label: "Flag",
        template: flagTemplate,
        cell: "handlebars",
        sortable: false
    }, {
        name: "result",
        label: "Result",
        template: resultTemplate,
        cell: "handlebars",
        sortable: false
    }, {
        name: "facilityMoniker",
        label: "Facility",
        template: siteTemplate,
        cell: "handlebars",
        sortable: false
    }];

    gridOptions.columns = columns;
    gridOptions.appletConfig = {
        name: 'lab_results_modal',
        id: 'lab_results_grid-modalView',
        simpleGrid: true
    };

    var DateRangeModel = Backbone.Model.extend({
        defaults: {
            fromDate: moment().subtract('years', 2).format(ADK.utils.dateUtils.defaultOptions().placeholder),
            toDate: moment().format(ADK.utils.dateUtils.defaultOptions().placeholder),
            customFromDate: null,
            customToDate: null,
            selectedId: null // '1yr-range'
                // hasCustomRangeValuesBeenPrepopulated: false
        }
    });


    var sharedDateRange;
    var resetSharedModalDateRangeOptions = function() {
        sharedDateRange = new DateRangeModel();
    };

    // TODO - May have to make ChartView a composite view for cycling through panel results
    var ChartView = Backbone.Marionette.ItemView.extend({
        template: '<div></div>',
        id: 'chartContainer',
        initialize: function(options) {
            var self = this;
            this.collection = options.collection;
            this.first = this.collection.first();
            this.chartOptions = $.extend(true, {}, options.chartOptions, {
                chart: {
                    marginRight: 20
                }
            });

            this.fullCollection = this.collection.fullCollection;

            low = this.fullCollection.map(function(model) {
                if (model.has('low')) {
                    return model.get('low');
                }
                return null;
            });
            high = this.fullCollection.map(function(model) {
                if (model.has('high')) {
                    return model.get('high');
                }
                return null;
            });

            low = _.map(low, function(num) {
                return num === null ? num : num * 1;
            });

            high = _.map(high, function(num) {
                return num === null ? num : num * 1;
            });

            var highLow = [];
            _.each(low, function(e, i) {
                var combined = [];
                combined.push(low[i]);
                combined.push(high[i]);
                highLow.push(combined);
            });


            highLow.reverse();


            categories = this.fullCollection.pluck('observed');

            categories = _.map(categories, function(num) {
                return new ADK.utils.dateUtils.StringFormatter(num, 'YYYYMMDDHHmm').format('MMM DD YYYY HH:mm');
            });


            categories.reverse();

            data = this.fullCollection.pluck('result');

            data = _.map(data, function(num) {
                if (_.isNaN(num * 1)) {
                    return null;
                } else {
                    return num * 1;
                }
            });

            data.reverse();


            var flagTooltip = this.fullCollection.pluck('flagTooltip');
            flagTooltip.reverse();
            var labelClass = this.fullCollection.pluck('labelClass');
            labelClass.reverse();
            var interpretationCode = this.fullCollection.pluck('interpretationCode');
            interpretationCode.reverse();
            var showFlagIcon = this.fullCollection.pluck('showFlagIcon');
            showFlagIcon.reverse();

            this.chartOptions.series[0].data = [];


            _.forEach(flagTooltip, function(e, i) {
                var mo = moment(categories[i]);
                if (e) {
                    var bkColor = labelClass[i];
                    var textColor;
                    if (bkColor.match('warning')) {
                        bkColor = '#FD9827';
                        textColor = '#000000';
                    } else {
                        bkColor = '#EB1700';
                        textColor = '#ffffff';
                    }
                    self.chartOptions.series[0].data.push({
                        y: data[i],
                        dataLabels: {
                            enabled: true,
                            useHTML: false,
                            backgroundColor: bkColor,
                            borderRadius: 5,
                            formatter: function() {
                                return interpretationCode[i];
                            },
                            style: {
                                color: textColor,
                                fontSize: "11px",
                                padding: '1.8px 5.4px 2.7px 5.4px'
                            }
                        },
                        x: Date.UTC(mo.year(), mo.month(), mo.date(), mo.hour(), mo.minute())
                    });

                } else {

                    self.chartOptions.series[0].data.push({
                        y: data[i],
                        dataLabels: {
                            enabled: false
                        },
                        x: Date.UTC(mo.year(), mo.month(), mo.date(), mo.hour(), mo.minute())
                    });

                }
                highLow[i].unshift(Date.UTC(mo.year(), mo.month(), mo.date(), mo.hour(), mo.minute()));

            });

            var uniqueData = this.chartOptions.series[0].data.filter(function(value, index, self) {
                var idx = _.pluck(self, 'x').indexOf(value.x);
                return (_.pluck(self, 'y')[idx] === value.y && idx === index);
            });

            this.chartOptions.xAxis.tickPositioner = function() {
                this.tickInterval = 1;
                if (uniqueData.length === 0) return [];

                if (uniqueData.length > 60) {
                    this.tickInterval = 10;
                } else if (uniqueData.length > 35) {
                    this.tickInterval = 7;
                } else if (uniqueData.length > 10) {
                    this.tickInterval = 5;
                }
                this.tickLength = Math.round((uniqueData.length - 1) / this.tickInterval);
                var tickPositions = [];
                if (uniqueData.length === 1) {
                    tickPositions.push(_.pluck(uniqueData, 'x')[0]);
                } else {
                    var iterator = 0;
                    while (uniqueData.length > (iterator * this.tickLength)) {
                        tickPositions.push(_.pluck(uniqueData, 'x')[(iterator * this.tickLength)]);
                        iterator++;
                    }
                    if (_.isUndefined(tickPositions[tickPositions.length - 1])) {
                        tickPositions[tickPositions.length - 1] = _.pluck(uniqueData, 'x')[uniqueData.length - 1];
                    }
                    tickPositions.push(_.pluck(uniqueData, 'x')[uniqueData.length - 1]);
                }

                this.tickAmount = tickPositions.length;

                return tickPositions;
            };

            this.chartOptions.series[0].zIndex = 1;
            this.chartOptions.yAxis.title.text = this.first.get('units');
            this.chartOptions.tooltip = {
                valueSuffix: ' ' + this.first.get('units'),
                crosshairs: true,
                shared: true,
                style: {
                    padding: 10,
                    zIndex: 9999
                },
                useHTML: true,
                xDateFormat: "%m/%d/%Y %H:%M"
            };

            this.chartOptions.series[1] = {
                name: 'Ref Range',
                data: highLow,
                type: 'arearange',
                lineWidth: 0,
                linkedTo: ':previous',
                color: '#5CB85C',
                fillOpacity: 0.3,
                zIndex: 0,
                showInLegend: false
            };


        },
        onShow: function() {
            var $body = $('body');

            // setInterval was removed because I could not see a clear race condition
            Chart = new Highcharts.Chart(this.chartOptions);
            $body.on('mouseover.modalChart', '#data-grid-lab_results_grid-modalView tbody tr', this.highLightChartPoint);
            $body.on('mouseout.modalChart', '#data-grid-lab_results_grid-modalView tbody tr', this.highLightChartPoint);
            this.$el.find('svg').attr('focusable', false);
            this.$el.find('svg').attr('aria-hidden', true);
        },
        onBeforeDestroy: function() {
            $('body').off('.modalChart');
        },
        highLightChartPoint: function(e) {
            switch (e.type) {
                case 'mouseover':
                    Chart.tooltip.shared = false;
                    var $this = $(this),
                        $td3 = $this.find('td:eq(2)'),
                        $td1 = $this.find('td:eq(0)'),
                        result = $td3.text().replace(/[^\d\.-]/g, '') * 1,
                        date = moment(AppletHelper.getDateForChart($this.data('model').get('observed')));
                    date = (Date.UTC(date.year(), date.month(), date.date(), date.hour(), date.minute()));

                    $.each(Chart.series[0].points, function(i, point) {
                        if (point.y === result && point.x === date) {
                            point.onMouseOver();
                            return false;
                        }
                    });
                    break;
                default:
                    Chart.tooltip.shared = true;
                    break;
            }
        }
    });

    var TotalView = Backbone.Marionette.ItemView.extend({
        template: Handlebars.compile('{{totalTests}}'),
        tagName: 'span',
        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
        }

    });

    TotalTestModel = Backbone.Model.extend({
        defaults: {
            totalTests: 0
        }
    });

    var totalTestModel = new TotalTestModel();


    var ModalView = Backbone.Marionette.LayoutView.extend({

        template: modalTemplate,
        fetchOptions: {},

        initialize: function(options) {
            var self = this;
            this.tableLoadingView = ADK.Views.Loading.create();
            this.chartLoadingView = ADK.Views.Loading.create();
            this.isFromPanel = options.isFromPanel;
            this.isFromNonPanel = options.isFromNonPanel;

            this.fullScreen = options.fullScreen;
            dataCollection = options.gridCollection;

            if (this.showNavHeader) {
                this.model.attributes.navHeader = true;
            }

            // Fetch patientrecord data from RDK
            this.fetchOptions.resourceTitle = "patient-record-lab";

            this.fetchOptions.criteria = {
                pid: this.model.attributes.pid, // "10108V420871"
            };

            //Establish filter
            if (this.model.attributes.facilityCode === 'DOD' && self.model.attributes.codes[0].code) {
                this.fetchOptions.criteria.filter = 'eq("codes[].code",' + self.model.attributes.codes[0].code + ')';
            } else {
                this.fetchOptions.criteria.filter = 'eq(typeName,"' + self.model.attributes.typeName + '"), eq(specimen,"' + self.model.attributes.specimen + '")';
            }


            this.fetchOptions.criteria.filterHold = this.fetchOptions.criteria.filter;

            this.fetchOptions.viewModel = {
                parse: AppletHelper.parseLabResponse
            };


            this.fetchOptions.pageable = true;
            this.fetchOptions.cache = false;

            gridOptions.appletConfig.gridTitle = 'This table represents the selected numeric lab result, ' + this.model.attributes.qualifiedName;

            this.fetchOptions.onSuccess = function(collection, response) {
                self.collection = collection;

                self.$el.find('.lab-results-next, .lab-results-prev').attr('disabled', false);

                var tempCollection = self.collection.fullCollection.pluck('result');


                tempCollection = _.map(tempCollection, function(num) {
                    return _.isNaN(num * 1);
                });

                tempCollection = _.without(tempCollection, false);

                if (self.showNavHeader) {
                    self.model.attributes.navHeader = true;
                }

                if (!_.isEmpty(self.chart)) {
                    self.chart.reset();
                }

                if (collection.length !== 0 && (tempCollection.length !== self.collection.fullCollection.length)) {
                    self.$('#lrDataTableView').removeClass('col-md-12').addClass('col-md-5');
                    self.$('#lrGraph').removeClass('hidden');
                    if (!_.isEmpty(self.chart)) {
                        self.chart.show(new ChartView({
                            chartOptions: AppletHelper.chartOptions,
                            model: self.model,
                            data: data,
                            collection: self.collection
                        }));
                    }
                } else {
                    self.$('#lrDataTableView').removeClass('col-md-5').addClass('col-md-12');
                    self.$('#lrGraph').addClass('hidden');
                }

                gridOptions.collection = self.collection;
                gridOptions.filterDateRangeEnabled = true;

                currentModel = options.model;
                self.model = options.model;
                currentCollection = options.collection;

                totalTestModel.set({
                    totalTests: gridOptions.collection.fullCollection.length
                });

                self.dataGrid = ADK.Views.DataGrid.create(gridOptions);

                if (self.leftColumn !== undefined && self.leftColumn !== null) {
                    self.leftColumn.reset();
                    self.leftColumn.show(self.dataGrid);
                }

                gridOptions.collection = self.collection;
                if (collection.length !== 0) {

                    self.paginatorView = ADK.Views.Paginator.create({
                        collection: gridOptions.collection,
                        windowSize: 4
                    });
                    self.$('.js-backgrid').append(self.paginatorView.render().el);
                } else {
                    $('#data-grid-lab_results_grid-modalView').find('tbody').append($('<tr><td>No Records Found</td></tr>'));
                }

            }; // end of onSuccess
        },
        regions: {
            leftColumn: '.js-backgrid',
            chart: '#js-chart',
            totalTests: '#totalTests',
            dateRangeFilter: '#dateRangeFilter'
        },
        resetSharedModalDateRangeOptions: resetSharedModalDateRangeOptions,
        onRender: function() {
            var dateRange;
            if (sharedDateRange === undefined || sharedDateRange === null) {
                this.resetSharedModalDateRangeOptions();
            }

            if (sharedDateRange !== undefined && sharedDateRange !== null &&
                sharedDateRange.get('selectedId') !== undefined &&
                sharedDateRange.get('selectedId') !== null) {
                dateRange = sharedDateRange.clone();
            } else {
                dateRange = new DateRangeModel();
            }

            var filterDateRangeView = new FilterDateRangeView({
                model: dateRange,
                parentView: this,
                fullScreen: this.fullScreen
            });
            filterDateRangeView.setFetchOptions(this.fetchOptions);
            filterDateRangeView.setSharedDateRange(sharedDateRange);

            this.dateRangeFilter.show(filterDateRangeView);
            this.leftColumn.show(this.tableLoadingView);
            this.chart.show(this.chartLoadingView);

            // this.totalTests.reset();
            this.totalTests.show(new TotalView({
                model: totalTestModel
            }));

            self.collection = ADK.PatientRecordService.fetchCollection(this.fetchOptions);
        }
    });

    return {
        ModalView: ModalView,
        resetSharedModalDateRangeOptions: resetSharedModalDateRangeOptions
    };

});