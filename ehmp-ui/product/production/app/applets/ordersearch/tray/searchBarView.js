define([
    'underscore',
    'backbone',
    'handlebars'
], function(_, Backbone, Handlebars) {
    'use strict';

    var View = Backbone.Marionette.ItemView.extend({
        tagName: 'form',
        className: 'backgrid-filter form-search flex-display',
        template: Handlebars.compile([
            '<label class="sr-only">{{screenReaderLabel}} for="searchInput"</label>',
            '<input id="searchInput" type="search" placeholder="{{placeholder}}" title="{{instructions}}"/>',
            '<div class="input-group-btn">',
            '<button type="button" class="clear-input default btn btn-icon btn-sm color-grey-darkest" title="Press enter to clear search text" data-search-action="clear"><i class="fa fa-remove"></i></button>',
            '</div>'
        ].join('\n')),
        templateHelpers: function() {
            return {
                screenReaderLabel: this.screenReaderLabel,
                placeholder: this.placeholder || '',
                instructions: this.instructions
            };
        },
        ui: {
            searchBox: '#searchInput',
            clearButton: 'button[data-search-action=clear]'
        },
        events: {
            'click @ui.clearButton': function(e) {
                e.preventDefault();
                this.clear();
            },
            'keyup @ui.searchBox': 'search',
            'submit': function(e) {
                e.preventDefault();
                this.search();
            }
        },
        initialize: function(options) {
            this.placeholder = options.placeholder || this.placeholder;
            this.screenReaderLabel = options.screenReaderLabel;
            this.instructions = options.instructions;

            this.template = options.template || this.template;
            if (_.isEmpty(this.model)) {
                this.model = new Backbone.Model();
            }
        },
        modelEvents: {
            'change:criteria': function(model) {
                if(!model.get('criteria')) this.ui.searchBox.val('');
            }
        },
        search: _.debounce(function(e) {
            if (e) {
                e.preventDefault();
            }
            var criteria = this.ui.searchBox.val();
            this.model.set('criteria', criteria);
            if (this.ui.searchBox.val()){
                this.ui.clearButton.show();
            } else {
                this.ui.clearButton.hide();
            }
        }, 500),
        clear: function(e) {
            if (e) {
                e.preventDefault();
            }
            this.model.set('criteria', null);
            this.ui.clearButton.hide();
        },
        onRender: function() {
            this.ui.searchBox.val(this.model.get('criteria'));
        }
    });

    return View;
});