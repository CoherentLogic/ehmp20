define([], function() {

    var Clinic = ADK.Resources.Picklist.Model.extend({
        idAttribute: 'uid',
        label: 'name',
        value: function(){
            return this.get('uid').split(':').pop();
        },
        defaults: {}
    });

    var Clinics = ADK.Resources.Picklist.Collection.extend({
        type: 'clinics-fetch-list',
        model: Clinic
    });

    return Clinics;
});
