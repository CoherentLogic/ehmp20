define([
    'backbone',
    'marionette',
    'jquery',
    'underscore',
    'handlebars',
    "api/Messaging",
], function(Backbone, Marionette, $, _, Handlebars, Messaging) {
    "use strict";

    var DivModel = Backbone.Model.extend({
        defaults: {
            sizeClass: '',
            backdrop: true,
            keyboard: true
        }
    });

    var WorkflowContainerView = Backbone.Marionette.LayoutView.extend({
        className: 'modal fade',
        tagName: 'div',
        attributes: {
            'role': 'dialog',
            'tabindex': '-1',
            'id': 'mainWorkflow'
        },
        modelEvents: {
            'change': 'render'
        },
        ui: {
            WorkflowRegion: '.modal-dialog'
        },
        regions: {
            workflowRegion: '@ui.WorkflowRegion'
        },
        template: Handlebars.compile('<div class="workflow-container"><div class="modal-dialog{{#if sizeClass}} {{sizeClass}}{{/if}}"></div></div>'),
        initialize: function(options) {
            this.workflowOptions = options.workflowOptions;
            this.controllerView = options.controllerView;
            this.model = new DivModel();
        },
        onBeforeShow: function() {
            if (this.workflowOptions.keyboard === false) {
                this.model.set('keyboard', this.workflowOptions.keyboard);
            }
            if (this.workflowOptions.backdrop === false || this.workflowOptions.backdrop === 'static') {
                this.model.set('backdrop', this.workflowOptions.backdrop);
            }
            this.$el.attr({
                'data-backdrop': this.model.get('backdrop'),
                'data-keyboard': this.model.get('keyboard')
            });

            if (this.workflowOptions.size === 'small') {
                this.model.set('sizeClass', 'modal-sm');
            } else if (this.workflowOptions.size === 'large') {
                this.model.set('sizeClass', 'modal-lg');
            } else if (this.workflowOptions.size === 'xlarge') {
                this.model.set('sizeClass', 'modal-xl');
            }
            this.showChildView('workflowRegion', this.controllerView);
            Messaging.getChannel('toolbar').trigger('open:worflow:modal');
        },
        onShow: function() {
            if ($('.modal:visible').length >= 1) {
                var zIndex = Math.max.apply(null, Array.prototype.map.call($('.modal:visible'), function(el) {
                    return +el.style.zIndex;
                })) + 1111;
                this.$el.css('z-index', zIndex);
            }
        }
    });
    return WorkflowContainerView;
});
