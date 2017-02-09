define([
    'backbone',
    'marionette',
    'underscore',
    'handlebars',
    'hbs!app/applets/task_forms/common/templates/domainDetails_Template'
    ], function(Backbone, Marionette, _, Handlebars, domainDetailsTemplate) {
        'use strict';
        return Backbone.Marionette.LayoutView.extend({
            template: domainDetailsTemplate,
            regions: {
                domainDetailsContentRegion: '#domainDetailsContentRegion'
            },
            initialize: function(options){
                if(!_.isUndefined(this.model.get('domainDetailsContentView'))){
                    var ContentView = this.model.get('domainDetailsContentView');
                    this.contentView = new ContentView({model: this.model});
                }
            },
            onRender: function(){
                if(!_.isUndefined(this.contentView)){
                    this.domainDetailsContentRegion.show(this.contentView);
                }
            }
        });
    });