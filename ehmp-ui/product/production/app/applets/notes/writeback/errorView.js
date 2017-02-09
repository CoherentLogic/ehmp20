define([
    'backbone',
    'marionette',
    'handlebars',
    'underscore'
], function(Backbone, Marionette, Handlebars, _) {
    'use strict';
    return function(params) {
          var errorFooterView = Backbone.Marionette.ItemView.extend({
              template: Handlebars.compile('<button type="button" class="btn btn-primary ok-button" data-dismiss="modal" title="Press enter to close" id="notesErrorBtn">OK</button>'),
              events: {
               'click .ok-button': 'onOk',// params.ok_callback,
              },
              onOk: function() {
                  if(!_.isUndefined(params.ok_callback)){
                    params.ok_callback();
                  }
              }
          });
          var errorBodyView = Backbone.Marionette.LayoutView.extend({
              template: Handlebars.compile(params.message)
          });
        this.showModal = function() {
            var errorView = new ADK.UI.Alert({
                title: 'Error',
                icon:  'icon-error',
                messageView: errorBodyView,
                footerView: errorFooterView
            });
            errorView.show();
        };
    };

});
