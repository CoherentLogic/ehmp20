define([
    'underscore',
    'backbone'
], function(_, Backbone) {
    'use strict';

    var MAX_PROBLEM_DISPLAY_LENGTH = 45;

    var ProblemUtil = {
        addProblemAssociation: function(collection, problemModel) {
            if (problemModel) {
                collection.add(problemModel);
            }
        },
        removeProblemAssociation: function(collection, problemModel) {
            if (problemModel) {
                collection.remove(problemModel);
            }
        },
        findProblemBySnomedCt: function(collection, snomed) {
            var matches = collection.where({ snomed: snomed });
            return matches.length > 0 ? matches[0] : null;
        },
        queryGlobalProblems: function(queryString, onSuccess, onError) {
            ADK.ResourceService.fetchCollection({
                cache: true,
                pageable: false,
                resourceTitle: 'problems-getProblems',
                criteria: {
                    query: queryString
                },
                collectionConfig: {
                    collectionParse: function(collection) {
                        var models = collection.models;
                        if (collection.size() === 1) {
                            // When there are no results, the endpoint returns "No data" instead of an empty result set
                            // That results in a collection containing a single model with the attributes: { 0: 'N', 1: 'o', 2: 'D', 3: 'a', 4: 't', 5: 'a' }
                            // We want to return an empty collection instead of that
                            var model = collection.models[0];
                            if (model.get('0') === 'N' && model.get('1') === 'o') {
                                models = [];
                            }
                        }
                        return models;
                    }
                },
                onSuccess: onSuccess,
                onError: onError
            });
        },
        getTrimmedProblem: function(problemModel) {
            return {
                problem: problemModel.get('problem'),
                snomed: problemModel.get('snomed')
            };
        }
    };

    return ProblemUtil;
});
