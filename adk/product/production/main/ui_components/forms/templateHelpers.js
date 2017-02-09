define([
    'puppetForm',
    'handlebars',
    'underscore'
], function(PuppetForm, Handlebars, _) {
    'use strict';

    // Needed to allow PuppetForm Controls to access attributes of PuppetForm
    Handlebars.registerHelper("PuppetForm", function(methodString) {
        return PuppetForm[methodString];
    });

    Handlebars.registerHelper("has-puppetForm-prop", function(methodString) {
        var prop = PuppetForm[methodString] || "";
        return (prop !== "" ? true : false);
    });

    Handlebars.registerHelper("formatter-from-raw", function(formatter, value) {
        return formatter.fromRaw(value);
    });
    Handlebars.registerHelper("clean-for-id", function replaceSpaces(string) {
        if (_.isString(string)){
            string = string || "";
            return string.replace(/[^A-Z0-9]+/ig, "-");
        }
        return string;
    });
    Handlebars.registerHelper("add-required-indicator", function appendIndicator(string, required) {
        if (required && _.isString(string)){
            return string + ' *';
        }
        return string;
    });
    Handlebars.registerHelper("is-sr-only-label", function srOnlyLabel(bool) {
        return (bool ? 'sr-only' : '');
    });
    Handlebars.registerHelper("not", function not(bool) {
        return (_.isUndefined(bool) ? undefined : !bool);
    });
    Handlebars.registerHelper("include", function(list, value, options) {
        if (_.isString(list)) {
            return (list === value) ? options.fn(this) : options.inverse(this);
        }

        if (_.includes(list, value)) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });

    var UI_Form_Helpers = {
        label: function(labelText, options) {
            options = options.hash || {};
            var hbEscape = Handlebars.Utils.escapeExpression;

            var forID, srOnlyLabel, extraClasses, content, extraClassLogic, classString;
            forID = options.forID || "";
            srOnlyLabel = (_.isBoolean(options.srOnlyLabel) ? options.srOnlyLabel : false);
            extraClasses = (_.isArray(options.classes) ? hbEscape(options.classes.toString().replace(/,/g, ' ')) : hbEscape(options.classes || ""));
            content = options.content || "";
            extraClassLogic = options.extraClassLogic || '';
            classString = extraClassLogic + extraClasses + (PuppetForm.controlLabelClassName || "");
            classString = _.isEmpty(classString) ? '' : ' class="'+classString+'"';

            var htmlString = [
                '<label for="' + forID + '"' + classString + '>',
                (content ? content +'\n' : '') +
                (srOnlyLabel ? '<span class="sr-only">' + labelText + '</span>': labelText),
                '</label>'
            ].join("\n");

            return new Handlebars.SafeString(htmlString);
        },
        checkbox: function(labelText, options) {
            options = options.hash || {};
            var hbEscape = Handlebars.Utils.escapeExpression;

            var id, title, extraClasses, checked, name, disabled, srOnlyLabel, labelTemplate;
            name = hbEscape(options.name || "checkbox");
            labelTemplate = options.labelTemplate || false;
            labelText = (labelTemplate ? labelText || hbEscape(name) : hbEscape(labelText || name));
            id = hbEscape(options.id || "checkbox-" + labelText.replace(/[^A-Z0-9]+/ig, "-"));
            title = hbEscape(options.title || "Press spacebar to select.");
            extraClasses = (_.isArray(options.classes) ? hbEscape(options.classes.toString().replace(/,/g, ' ')) : hbEscape(options.classes || ""));
            checked = (_.isBoolean(options.checked) ? options.checked : false);
            disabled = (_.isBoolean(options.disabled) ? options.disabled : false);
            srOnlyLabel = (_.isBoolean(options.srOnlyLabel) ? options.srOnlyLabel : false);


            var labelOptions = {
                hash: {
                    forID: id,
                    srOnlyLabel: srOnlyLabel,
                    classes: (disabled ? 'disabled' : ''),
                    content: [
                        '<input type="checkbox"' +
                        ' id="' + id + '" name="' + name + '" title="' + title + '"' +
                        (checked ? ' checked="checked"' : '') +
                        (disabled ? ' disabled' : '') +
                        ' />'
                    ].join("\n")
                }
            };

            var htmlString = [
                '<div class="checkbox' +
                (extraClasses ? ' ' + extraClasses + '"' : '"') +
                '>',
                Handlebars.helpers['ui-form-label'].apply(this, [labelText, labelOptions]),
                '</div>'
            ].join("\n");

            return new Handlebars.SafeString(htmlString);
        },
        searchbar: function(placeholderText, options) {
            // placeholder
            // size (bootstrap col width, default: 12)
            // standAloneForm (default false)
            var root = options.data.root;
            options = options.hash || {};
            var hbEscape = Handlebars.Utils.escapeExpression;

            var title, value, size, id, extraClasses, standAloneForm, required, disabled, buttonID;
            placeholderText = hbEscape(placeholderText || "");
            title = hbEscape(options.title || placeholderText);
            value = options.value || "";
            size = hbEscape(parseInt(options.size) || 12);
            id = hbEscape(root.id || "defaultResponsiveSearchBar");
            extraClasses = (_.isArray(options.classes) ? hbEscape(options.classes.toString().replace(/,/g, ' ')) : hbEscape(options.classes || ""));
            standAloneForm = options.standAloneForm || false;
            required = (_.isBoolean(options.required) ? options.required : false);
            disabled = (_.isBoolean(options.disabled) ? options.disabled : false);
            buttonID = id + "Btn";

            var labelOptions = {
                hash: {
                    forID: id,
                    classes: ["sr-only"]
                }
            };

            var htmlString = [
                (standAloneForm ? '<form action="#" method="post">' : ''),
                '<div class="row"><div class="col-xs-' + size + ' ' + extraClasses + '">',
                '<div class="input-group">',
                Handlebars.helpers['ui-form-label'].apply(this, [(placeholderText.length > 0 ? placeholderText : title.length > 0 ? title : 'default searchbar'), labelOptions]),
                '<input type="text" class="form-control" placeholder="' + placeholderText + '" title="' + title + '" ' +
                (disabled ? ' disabled' : '') +
                (required ? ' required' : '') +
                ' id="' + id + '" value="' + value + '" />',
                '<button class="clear-input-btn default btn btn-icon btn-sm color-grey-darkest" type="button" title="Press enter to clear search text">',
                    '<i class="fa fa-times"></i>',
                '</button>',
                '<span class="input-group-btn">',
                '<button id="' + buttonID + '" type="button" class="box-shadow-no text-search btn btn-primary btn-sm"' +
                (disabled ? ' disabled' : '') +
                (required ? ' required' : '') +
                ' title="Press enter to search, then view results below">',
                '<i class="fa fa-search"></i>',
                '</button>',
                '</span>',
                '</div>',
                '</div>',
                '</div>', (standAloneForm ? '</form>' : '')
            ].join("\n");

            return new Handlebars.SafeString(htmlString);
        }
    };

    return UI_Form_Helpers;
});