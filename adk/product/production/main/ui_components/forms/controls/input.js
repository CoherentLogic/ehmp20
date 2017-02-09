define([
    'backbone',
    'puppetForm',
    'handlebars',
    'underscore'
], function(Backbone, PuppetForm, Handlebars, _) {
    'use strict';

    var Input = PuppetForm.InputControl = PuppetForm.DefaultInputControl.extend({
        templateHelpers: function() {
            var self = this;
            return {
                'passwordType': function() {
                    if (self.field.get('type') === 'password') {
                        return true;
                    }
                }
            };
        },
        getTemplate: function() {
            var isUnitsArray = _.isArray(this.field.get('units'));

            var characterCount = '{{#if maxlength}}{{#if charCount}}<span class="font-size-11"><span class="input-char-count top-margin-xs left-margin-xs"></span> character<span class="char-count-plural"></span> remaining</span>{{/if}}{{/if}}';
            var helpMessage = '{{#if helpMessage}} <span {{#if (has-puppetForm-prop "helpMessageClassName")}}class="{{PuppetForm "helpMessageClassName"}}"{{/if}}>{{helpMessage}}</span>{{/if}}';

            var singleUnitString = '{{#if units}}<span class="input-group-addon">{{units}}</span></div>{{/if}}',
                singleUnitArray = '{{#if units}}{{#each units}}<span class="input-group-addon">{{label}}</span>{{/each}}</div>{{/if}}';

            var unitsAsString = [
                '{{ui-form-label (add-required-indicator label required) forID=(clean-for-id name) classes=(is-sr-only-label srOnlyLabel)}}',
                '{{#if units}}<div class="input-group">{{/if}}',
                '<input type="{{type}}" {{#if passwordType}}autocomplete="off"{{/if}} class="{{PuppetForm "controlClassName"}}" id="{{clean-for-id name}}" name="{{name}}" maxlength="{{maxlength}}"{{#if value}} value="{{value}}"{{/if}}{{#if title}} title="{{title}}"{{/if}}{{#if placeholder}} placeholder="{{placeholder}}"{{/if}}{{#if disabled}} disabled{{/if}}{{#if required}} required{{/if}}{{#if readonly}} readonly{{/if}}/>',
            ].join("\n");

            var unitsAsArray_2_Elements = Handlebars.compile([
                '<div class="col-xs-8 all-padding-no">',
                '{{ui-form-label (add-required-indicator label required) forID=(clean-for-id name) classes=(is-sr-only-label srOnlyLabel)}}',
                '<input type="{{type}}" class="{{PuppetForm "controlClassName"}}" id="{{clean-for-id name}}" name="{{name}}" maxlength="{{maxlength}}"{{#if value}} value="{{value}}"{{/if}}{{#if title}} title="{{title}}"{{/if}}{{#if placeholder}} placeholder="{{placeholder}}"{{/if}}{{#if disabled}} disabled{{/if}}{{#if required}} required{{/if}}{{#if readonly}} readonly{{/if}}/>',
                '</div>',
                '{{#if units}}',
                '<fieldset class="col-xs-4 radio radio-and-input all-padding-no left-padding-xs top-margin-sm">',
                '<legend class="sr-only">{{label}} Units</legend>',
                '{{#each units}}',
                Handlebars.helpers['ui-form-label'].apply(this, ["{{label}}", {
                    hash: {
                        forID: "{{../name}}-{{clean-for-id value}}-radio-{{value}}",
                        classes: PuppetForm.radioLabelClassName + ' radio-units radio-inline',
                        extraClassLogic: '{{#if disabled}}disabled {{else}}{{#if ../disabled}}disabled {{/if}}{{/if}}',
                        content: '<input type="radio" id="{{../name}}-{{clean-for-id value}}-radio" name="{{../name}}-radio-units" {{#if title}}title="{{title}}"{{/if}} value="{{formatter-from-raw ../formatter value}}" {{#compare value ../rawValueUnits}}checked="checked"{{/compare}}{{#if disabled}} disabled{{else}}{{#if ../disabled}} disabled{{/if}}{{/if}}/>'
                    }
                }]),
                '{{/each}}',
                '</fieldset>',
                '{{/if}}',
                characterCount,
                helpMessage
            ].join("\n"));

            var unitsAsArray_3_OrMoreElements = Handlebars.compile([
                '<div class="input-group">',
                '{{ui-form-label (add-required-indicator label required) forID=(clean-for-id name) classes=(is-sr-only-label srOnlyLabel)}}',
                '<input type="{{type}}" class="{{PuppetForm "controlClassName"}}" id="{{clean-for-id name}}" name="{{name}}" maxlength="{{maxlength}}"{{#if value}} value="{{value}}"{{/if}}{{#if title}} title="{{title}}"{{/if}}{{#if placeholder}} placeholder="{{placeholder}}"{{/if}}{{#if disabled}} disabled{{/if}}{{#if required}} required{{/if}}{{#if readonly}} readonly{{/if}}/>',
                '<div class="input-group-btn">',
                '<label for="{{clean-for-id name}}-unit-select" class="sr-only">{{label}} Unit</label>',
                '<select class="form-control btn-form-control" title="Select from the list" id="{{clean-for-id name}}-unit-select"{{#if disabled}} disabled{{/if}}{{#if required}} required{{/if}}>',
                '{{#each units}}',
                '<option value={{value}}{{#if selected}} selected="selected"{{/if}}>{{label}}</option>',
                '{{/each}}',
                '</select>',
                '</div>',
                '</div>',
                characterCount,
                helpMessage
            ].join("\n"));

            if (isUnitsArray) {
                var unitsArray = this.field.get('units');
                if (unitsArray.length > 2) {
                    // console.log(unitsArray.length);
                    return unitsAsArray_3_OrMoreElements;
                } else if (unitsArray.length == 1) {
                    return Handlebars.compile([
                        unitsAsString,
                        singleUnitArray,
                        characterCount,
                        helpMessage
                    ].join("\n"));
                } else
                    return unitsAsArray_2_Elements;
            }
            return Handlebars.compile([
                unitsAsString,
                singleUnitString,
                characterCount,
                helpMessage
            ].join("\n"));
        },
        events: _.defaults({
            "input": "countChar",
            "change select": function() {
                this.onChange.apply(this, arguments);
                this.onUserInput.apply(this, arguments);
            },
            //Events to be Triggered By User
            "control:required": function(event, booleanValue) {
                this.setBooleanFieldOption("required", booleanValue, event);
            },
            "control:disabled": function(event, booleanValue) {
                this.setBooleanFieldOption("disabled", booleanValue, event);
            },
            "control:readonly": function(event, booleanValue) {
                this.setBooleanFieldOption("readonly", booleanValue, event);
            },
            "control:charCount": function(event, booleanValue) {
                this.setBooleanFieldOption("charCount", booleanValue, event);
            },
            "control:title": function(event, stringValue) {
                this.setStringFieldOption("title", stringValue, event);
            },
            "control:placeholder": function(event, stringValue) {
                this.setStringFieldOption("placeholder", stringValue, event);
            },
            "control:helpMessage": function(event, stringValue) {
                this.setStringFieldOption("helpMessage", stringValue, event);
            },
            "control:units": function(event, stringValue) {
                this.setStringFieldOption("units", stringValue, event);
            },
            "control:maxlength": function(event, intValue) {
                this.setIntegerFieldOption("maxlength", intValue, event);
            },
            "control:update:config": function(event, configHash) {
                if (_.isObject(configHash)) {
                    this.field.set(configHash);
                }
            }
        }, PuppetForm.DefaultInputControl.prototype.events),
        ui: {
            'InputCharCount': '.input-char-count',
            'InputCharCountPluralLetter': '.char-count-plural'
        },
        onRender: function() {
            PuppetForm.DefaultInputControl.prototype.onRender.apply(this, arguments);
            this.countChar();
        },
        countChar: function() {
            if (this.field.get('charCount')) {
                var charactersRemaining = this.$el.find('input').attr('maxlength') - this.$el.find('input').val().length;
                this.ui.InputCharCount.text(charactersRemaining);
                this.ui.InputCharCountPluralLetter.text(charactersRemaining === 1 ? '' : 's');
            }
        },
        getValueFromDOM: function() {
            var isUnitsArray = _.isArray(this.field.get('units'));
            if (isUnitsArray) {
                var value = this.$el.find("input").val();
                var valueWithUnits;
                if (this.field.get('units').length > 2) {
                    valueWithUnits = (value ? value + this.$el.find("select option:selected").val() : value);
                } else {
                    valueWithUnits = (value ? value + this.$el.find(".radio-units input:checked").val() : value);
                }
                return this.formatter.toRaw(valueWithUnits, this.model);
            }
            return this.formatter.toRaw(this.$el.find("input").val(), this.model);
        },
        serializeModel: function(model) {
            var field = _.defaultsDeep(this.field.toJSON(), this.defaults),
                attributes = model.toJSON(),
                attrArr = field.name.split('.'),
                name = attrArr.shift(),
                path = attrArr.join('.'),
                rawValue = this.keyPathAccessor(attributes[name], path);
            if (field.prependToDomId) {
                field.name = field.prependToDomId + name;
            }
            var data = _.extend(field, {
                isUnitsArray: _.isArray(field.units),
                rawValue: rawValue,
                value: this.formatter.fromRaw(rawValue, model),
                attributes: attributes,
                formatter: this.formatter
            });
            if (data.isUnitsArray) {
                data.rawValueUnits = (rawValue && _.isString(rawValue) ? (rawValue.match(/[a-z]+/g) ? rawValue.match(/[a-z]+/g)[0] : rawValue) : field.units[0].value);
            }
            return data;
        }
    });
    return Input;
});
