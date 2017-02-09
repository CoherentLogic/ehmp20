define(['handlebars', 'moment', 'underscore'], function(Handlebars, moment, _) {
    function compare(lvalue, rvalue, options) {
        'use strict';
        if (arguments.length < 3)
            throw new Error("Handlerbars Helper 'compare' needs 2 parameters");

        var operator = options.hash.operator || "==";
        var operators = {
            '==': function(l, r) {
                return l == r;
            },
            '===': function(l, r) {
                return l === r;
            },
            '!=': function(l, r) {
                return l != r;
            },
            '<': function(l, r) {
                return l < r;
            },
            '>': function(l, r) {
                return l > r;
            },
            '<=': function(l, r) {
                return l <= r;
            },
            '>=': function(l, r) {
                return l >= r;
            },
            'typeof': function(l, r) {
                switch (r) {
                    case 'array':
                        return _.isArray(l);
                    default:
                        return typeof l == r;
                }
            }
        };

        if (!operators[operator])
            throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);

        var result = operators[operator](lvalue, rvalue);

        if (result) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }

    }

    Handlebars.registerHelper('compare', compare);
    return compare;
});