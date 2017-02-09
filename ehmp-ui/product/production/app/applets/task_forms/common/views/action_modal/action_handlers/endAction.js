define([

], function() {
    'use strict';

    var EndActionBody = {
        control: "container",
        extraClasses: ["row"],
        items: [{
            control: 'container',
            extraClasses: ['col-xs-12'],
            modelListeners: [''],
            template: Handlebars.compile('<h5 class="top-margin-xs bottom-margin-xs bottom-padding-xs font-size-18">{{clinicalObject.displayName}}</h5>')
        }, {
            control: "container",
            extraClasses: ["col-xs-6", "top-margin-sm"],
            title: 'Use up and down arrow keys to view options and press enter to select',
            items: [{
                control: 'select',
                name: 'reason',
                label: 'Reason for Discontinue',
                required: true,
                disabled: false,
                pickList: [{
                    value: 'By Ordering Provider',
                    label: 'By Ordering Provider'
                }, {
                    value: 'Patient Did Not Respond',
                    label: 'Patient Did Not Respond'
                }, {
                    value: 'Patient Request',
                    label: 'Patient request'

                }, {
                    value: 'By Consultant',
                    label: 'By Consultant'

                }]
            }]
        }, {
            control: "container",
            extraClasses: ["col-xs-12"],
            items: [{
                control: "textarea",
                name: "comment",
                title: "Enter a comment",
                label: "Comment",
                rows: 3,
                required: false,
                maxlength: 200
            }]
        }]
    };

    return {
        getBodyView: function() {
            return EndActionBody;
        },
        onAccept: function(model) {
            model.set('signalBody', {
                reason: model.get('reason'),
                comment: model.get('comment')
            });
        }
    };
});