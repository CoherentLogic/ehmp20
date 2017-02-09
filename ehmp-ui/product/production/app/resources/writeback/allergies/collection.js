define([
    'app/resources/writeback/allergies/model'
], function(Model) {
    var allergies = ADK.Resources.Writeback.Collection.extend({
        resource: 'allergies-add',
        vpr: 'allergies',
        model: Model
    });

    return allergies;
});