define([
    'backbone',
    'marionette',
    'jquery',
    'underscore',
    'handlebars'
], function(Backbone, Marionette, $, _, Handlebars) {
    "use strict";

    var WorkflowControllerView = Backbone.Marionette.CollectionView.extend({
        modelEvents: {
            'change:currentIndex': 'updateProgressIndicator updateSubTrayContainer'
        },
        initialize: function(options) {
            this.model = options.model;
            this.collection = this.model.get('steps');
            this.parentViewInstance = options.parentViewInstance;
        },
        onBeforeShow: function() {
            if (this.collection.length > 0) {
                this.callBeforeShowStepMethod(this._getImmediateChildren()[0].beforeGoingToStep);
            }
        },
        getCurrentFormView: function() {
            return this.children.findByIndex(this.model.get('currentIndex'));
        },
        updateSubTrayContainer: function(e) {
            var currentStepIndex = this.model.get('currentIndex');
            var stepModel = this.collection.at(currentStepIndex);
            this.$el.trigger('step:changed', stepModel);
        },
        updateProgressIndicator: function() {
            var loopIndex = 0;
            // setting "completed: true" on all steps leading up to current step
            _.each(this.collection.models, function(model) {
                model.unset('currentStep');
                var index = this.model.get('currentIndex');
                if (loopIndex === index) {
                    model.set({
                        'currentStep': true,
                        'completed': true,
                        'currentIndex': index + 1
                    });
                } else if (loopIndex < index) {
                    model.set('completed', true);
                } else {
                    model.unset('completed');
                }
                loopIndex++;
            }, this);
        },
        getChildView: function(item) {
            if (item === item.collection.at(this.model.get('currentIndex'))) {
                return item.get('view');
            }
            return item.get('view').extend({
                className: function() {
                    return item.get('view').prototype.className() + ' hidden';
                }
            });
        },
        childViewOptions: function(model, index) {
            return {
                workflow: this,
                viewIndex: index,
                beforeGoingToStep: model.get('onBeforeShow') || null
            };
        },
        buildChildView: function(child, ChildViewClass, childViewOptions) {
            // build the final list of options for the childView class
            var options = _.extend({
                model: child.get('viewModel')
            }, childViewOptions);
            // create the child view instance
            var view = new ChildViewClass(options);
            // return it
            return view;
        },
        checkIndex: function(indexToCheck) {
            if (this._getImmediateChildren()[indexToCheck]) {
                return true;
            }
            return false;
        },
        goToNext: function() {
            var currentIndex = this.model.get('currentIndex');
            if (this.checkIndex(currentIndex + 1)) {
                this.model.set('currentIndex', currentIndex + 1);
                this._getImmediateChildren()[currentIndex].$el.addClass('hidden');
                this.callBeforeShowStepMethod(this._getImmediateChildren()[currentIndex + 1].beforeGoingToStep);
                this._getImmediateChildren()[currentIndex + 1].$el.removeClass('hidden');
                this.parentViewInstance.handleChangeToTrayContainer(true);
                return true;
            }
            return false;
        },
        goToPrevious: function() {
            var currentIndex = this.model.get('currentIndex');
            if (this.checkIndex(currentIndex - 1)) {
                this.model.set('currentIndex', currentIndex - 1);
                this._getImmediateChildren()[currentIndex].$el.addClass('hidden');
                this.callBeforeShowStepMethod(this._getImmediateChildren()[currentIndex - 1].beforeGoingToStep);
                this._getImmediateChildren()[currentIndex - 1].$el.removeClass('hidden');
                this.parentViewInstance.handleChangeToTrayContainer(true);
                return true;
            }
            return false;
        },
        goToIndex: function(indexToGoTo) {
            if (this.checkIndex(indexToGoTo)) {
                var self = this;
                this.model.set('currentIndex', indexToGoTo);
                _.each(this._getImmediateChildren(), function(child, index) {
                    if (index === indexToGoTo) {
                        self.callBeforeShowStepMethod(child.beforeGoingToStep);
                        child.$el.removeClass('hidden');
                    } else {
                        child.$el.addClass('hidden');
                    }
                });
                this.parentViewInstance.handleChangeToTrayContainer(true);
                return true;
            }
            return false;
        },
        callBeforeShowStepMethod: function(beforeShowMethod) {
            if (_.isFunction(beforeShowMethod)) {
                _.bind(beforeShowMethod, this.parentViewInstance)();
            }
        },
        close: function() {
            this.parentViewInstance.close();
        }
    });
    return WorkflowControllerView;
});