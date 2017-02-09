'use strict';
define([
    'jquery',
    'backbone',
    'marionette',
    'main/ui_components/components',
    'api/UIComponents',
    'jasminejquery',
    'bootstrap-timepicker'
], function($, Backbone, Marionette, UI) {
    var $form, form;

    var timePickerControlDefinitionBasic = {
        name: 'timePicker0',
        label: 'timepicker0',
        control: 'timepicker',
        title: 'This is a timepicker'
    };
    var timePickerControlDefinitionBasicSrOnlyLabel = {
        name: 'timePicker0',
        label: 'timepicker sr-only label',
        control: 'timepicker',
        title: 'This is a timepicker',
        srOnlyLabel: true
    };

    var timePickerControlDefinitionWithMoreOptions = {
        name: 'timePicker1',
        label: 'timepicker',
        control: 'timepicker',
        options: {
            defaultTime: false,
            minuteStep: 1
        }
    };

    var timePickerControlDefinitionWithExtraClasses = {
        name: 'timePicker2',
        label: 'timepicker (with extra classes)',
        control: 'timepicker',
        extraClasses: ['special-class-1', 'special-class-2']
    };

    var timePickerControlDefinitionDiabled = {
        name: 'timePicker3',
        label: 'timepicker (disabled)',
        disabled: true,
        control: 'timepicker'
    };

    var timePickerControlDefinitionRequired = {
        name: 'timePicker4',
        label: 'timepicker (required)',
        required: true,
        control: 'timepicker'
    };

    var timePickerControlDefinitionReadonly = {
        name: 'timePicker5',
        label: 'timepicker (readonly)',
        readonly: true,
        control: 'timepicker'
    };

    var timePickerControlDefinitionHelpMessage = {
        name: 'timePicker6',
        label: 'timepicker (readonly)',
        control: 'timepicker',
        helpMessage: 'This is a help message.'
    };

    var formModelCleanSlate = new Backbone.Model();

    var formModelWithInitialTime = new Backbone.Model({
        timePicker0: '14:05'
    });

    var clickOnSpanTag = function(){
        $form.find('span.input-group-addon').focus().click();
    };
    var getTimepickerHour = function(){
        return $('body > .bootstrap-timepicker-widget .bootstrap-timepicker-hour');
    };
    var getTimepickerMinute = function(){
        return $('body > .bootstrap-timepicker-widget .bootstrap-timepicker-minute');
    };
    var useArrowToIncrementTime = function(range){
        $('body > .bootstrap-timepicker-widget a[data-action=increment'+range+']').focus().click();
    };
    var useArrowToDecrementTime = function(range){
        $('body > .bootstrap-timepicker-widget a[data-action=decrement'+range+']').focus().click();
    };

    describe('A timepicker', function() {
        afterEach(function() {
            form.destroy();
        });

        describe('basic', function() {
            beforeEach(function() {
                form = new UI.Form({
                    model: formModelCleanSlate,
                    // model: formModelWithInitialTime,
                    fields: [timePickerControlDefinitionBasic]
                });

                $form = form.render().$el;
                $('body').append($form);
            });


            it('contains an input time field', function() {
                expect($form.find('#timePicker0').length).toBe(1);
                expect($form.find('#timePicker0')).toBeVisible();
            });

            it('contains an input minute field', function() {
                clickOnSpanTag();
                expect(getTimepickerMinute().length).toBe(1);
            });

            it('contains an input hour field', function() {
                clickOnSpanTag();
                expect(getTimepickerHour().length).toBe(1);
            });

            it('contains a time icon', function() {
                expect($form.find('div.bootstrap-timepicker').length).toBe(1);
            });

            it('contains a title on the input field', function() {
                expect($form.find('#timePicker0').attr('title')).toBe('This is a timepicker');
            });

            it('has popup initially collapsed', function() {
                expect($form.find('div.bootstrap-timepicker-widget.dropdown-menu.open').length).toBe(0);
            });

            it('opens popup when time icon clicked', function() {
                $form.find('span.input-group-addon').focus().click()
                expect($('body > div.bootstrap-timepicker-widget.dropdown-menu.open').length).toBe(1);
            });
        });


        describe('with initial value', function() {
            beforeEach(function() {
                form = new UI.Form({
                    model: formModelWithInitialTime,
                    fields: [timePickerControlDefinitionBasic]
                });
                $form = form.render().$el;
                $('body').append($form);
            });

            it('puts a correct initial time value', function() {
                expect(_.isEqual($form.find('#timePicker0').val(), '14:05')).toBe(true);
            });
        });

        describe('using inc/dec arrows on timepicker', function() {
            beforeEach(function() {
                form = new UI.Form({
                    model: formModelCleanSlate,
                    fields: [timePickerControlDefinitionBasic]
                });
                $form = form.render().$el;
                $('body').append($form);
                form.model.set('timePicker0', '14:05');
            });

            it('allows hour increment', function() {
                clickOnSpanTag();
                useArrowToIncrementTime('Hour');
                expect(_.isEqual($form.find('#timePicker0').val(), '15:05')).toBe(true);
                expect(_.isEqual(getTimepickerHour().val(), '15')).toBe(true);
            });

            it('allows hour decrement', function() {
                clickOnSpanTag();
                useArrowToDecrementTime('Hour');
                expect(_.isEqual($form.find('#timePicker0').val(), '13:05')).toBe(true);
                expect(_.isEqual(getTimepickerHour().val(), '13')).toBe(true);
            });

            it('allows minute increment', function() {
                clickOnSpanTag();
                useArrowToIncrementTime('Minute');
                expect(_.isEqual($form.find('#timePicker0').val(), '14:10')).toBe(true);
                expect(_.isEqual(getTimepickerMinute().val(), '10')).toBe(true);
            });

            it('allows minute decrement', function() {
                clickOnSpanTag();
                useArrowToDecrementTime('Minute');
                expect(_.isEqual($form.find('#timePicker0').val(), '14:00')).toBe(true);
                expect(_.isEqual(getTimepickerMinute().val(), '00')).toBe(true);
            });

        });

        describe('with extra options', function() {
            beforeEach(function() {
                form = new UI.Form({
                    model: formModelCleanSlate,
                    fields: [timePickerControlDefinitionWithMoreOptions]
                });
                $form = form.render().$el;
                $('body').append($form);
                form.model.set('timePicker1', '02:05');
            });

            it('allows time assignment in meridian', function() {
                expect(_.isEqual($form.find('#timePicker1').val(), '2:05')).toBe(true);
            });

            it('allows hour increment with meridian', function() {
                clickOnSpanTag();
                useArrowToIncrementTime('Hour');
                expect(_.isEqual($form.find('#timePicker1').val(), '3:05')).toBe(true);
                expect(_.isEqual(getTimepickerHour().val(), '3')).toBe(true);
            });

            it('allows hour decrement with meridian', function() {
                clickOnSpanTag();
                useArrowToDecrementTime('Hour');
                expect(_.isEqual($form.find('#timePicker1').val(), '1:05')).toBe(true);
                expect(_.isEqual(getTimepickerHour().val(), '1')).toBe(true);
            });

            it('allows minute increment with step', function() {
                clickOnSpanTag();
                useArrowToIncrementTime('Minute');
                expect(_.isEqual($form.find('#timePicker1').val(), '2:06')).toBe(true);
                expect(_.isEqual(getTimepickerMinute().val(), '06')).toBe(true);
            });

            it('allows minute decrement with step', function() {
                clickOnSpanTag();
                useArrowToDecrementTime('Minute');
                expect(_.isEqual($form.find('#timePicker1').val(), '2:04')).toBe(true);
                expect(_.isEqual(getTimepickerMinute().val(), '04')).toBe(true);
            });
        });


        describe('with extra classes', function() {

            beforeEach(function() {
                form = new UI.Form({
                    model: formModelCleanSlate,
                    fields: [timePickerControlDefinitionWithExtraClasses]
                });
                $form = form.render().$el;
                $('body').append($form);
            });

            it('has correct classes', function() {
                expect($form.find('div')).toHaveClass('special-class-1');
                expect($form.find('div')).toHaveClass('special-class-2');
            });

            it('input does not have the same classes', function() {
                expect($form.find('#timePicker2')).not.toHaveClass('special-class-1');
                expect($form.find('#timePicker2')).not.toHaveClass('special-class-2');
            });
        });


        describe('disabled', function() {
            beforeEach(function() {
                form = new UI.Form({
                    model: formModelCleanSlate,
                    fields: [timePickerControlDefinitionDiabled]
                });
                $form = form.render().$el;
                $('body').append($form);
            });

            it('has correct attribute', function() {
                expect($form.find('#timePicker3')).toBeDisabled();
            });
        });

        describe('required', function() {
            beforeEach(function() {
                form = new UI.Form({
                    model: formModelCleanSlate,
                    fields: [timePickerControlDefinitionRequired]
                });
                $form = form.render().$el;
                $('body').append($form);
            });

            it('has correct attribute', function() {
                expect($form.find('#timePicker4')).toHaveAttr('required', 'required');
            });
        });

        describe('readonly', function() {
            beforeEach(function() {
                form = new UI.Form({
                    model: formModelCleanSlate,
                    fields: [timePickerControlDefinitionReadonly]
                });
                $form = form.render().$el;
                $('body').append($form);
            });

            it('contains correct attribute', function() {
                expect($form.find('#timePicker5')).toHaveAttr('readonly', 'readonly');
            });
        });

        describe('with help message', function() {
            beforeEach(function() {
                form = new UI.Form({
                    model: formModelCleanSlate,
                    fields: [timePickerControlDefinitionHelpMessage]
                });
                $form = form.render().$el;
                $('body').append($form);
            });

            it('help message is in a span with proper class', function() {
                expect($form.find('span:last')).toHaveClass('help-block');
            });

            it('has help message', function() {
                expect($form.find('span:last.help-block')).toHaveText('This is a help message.');
            });
        });

        describe('basic with sr-only label', function() {
            beforeEach(function() {
                form = new UI.Form({
                    model: formModelCleanSlate,
                    // model: formModelWithInitialTime,
                    fields: [timePickerControlDefinitionBasicSrOnlyLabel]
                });

                $form = form.render().$el;
                $('body').append($form);
            });

            it('contains correct label with sr-only class', function() {
                expect($form.find('label')).toHaveText('timepicker sr-only label');
                expect($form.find('label').attr('for')).toBe('timePicker0');
                expect($form.find('label')).toHaveClass('sr-only');
            });
        });
        describe("with error", function() { //exclude this because it is not complete
            beforeEach(function() {
                form = new UI.Form({
                    model: formModelCleanSlate,
                    fields: [timePickerControlDefinitionBasic]
                });
                $form = form.render().$el;
                $("body").append($form);
            });
            it("contains error", function() {
                form.model.errorModel.set('timePicker0', 'Example error');
                expect($form.find('span.error')).toExist();
                expect($form.find('span.error')).toHaveText('Example error');
            });
            it("error is removed", function() {
                form.model.errorModel.set('timePicker0', 'Example error');
                expect($form.find('span.error')).toHaveText('Example error');
                clickOnSpanTag();
                useArrowToIncrementTime('Hour');
                expect($form.find('span.error')).not.toExist();
            });
        });
        describe("using trigger to dynamically change attributes", function() {
            beforeEach(function() {
                form = new UI.Form({
                    model: formModelCleanSlate,
                    fields: [timePickerControlDefinitionBasic]
                });
                $form = form.render().$el;
                $("body").append($form);
            });
            it("hidden", function() {
                $form.find('.timePicker0').trigger("control:hidden", true);
                expect($form.find('.timePicker0')).toHaveClass('hidden');
                $form.find('.timePicker0').trigger("control:hidden", false);
                expect($form.find('.timePicker0')).not.toHaveClass('hidden');

            });
            it("title", function() {
                $form.find('.timePicker0').trigger("control:title", 'newTitle');
                expect($form.find('#timePicker0')).toHaveAttr('title', 'newTitle');
                $form.find('.timePicker0').trigger("control:title", '');
                expect($form.find('#timePicker0')).not.toHaveText('newTitle');
            });
        });
    });
});