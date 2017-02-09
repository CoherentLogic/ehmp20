/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, jqm, describe, it, expect, beforeEach, spyOn */

'use strict';

// Jasmine Unit Testing Suite
define(['backbone', 'jasminejquery', 'moment', 'app/applets/problems/writeback/validationUtils'],
    function (Backbone, Jasmine, moment, ValidationUtil) {
        describe('Test on-set date form validation for problem writeback', function() {

            it('should invalidate future on-set date (MM/DD/YYYY)', function() {

                var formModel = new Backbone.Model();
                formModel.errorModel = new Backbone.Model();

                var errorModel = ValidationUtil.validateMeasuredDateAndTime(formModel, '12/1/2019' );
                expect(formModel.errorModel.get('onset-date')).toBe('Onset Date must be in the past.');
            });

            it('should validate past on-set date (MM/DD/YYYY)', function() {

                var formModel = new Backbone.Model();
                formModel.errorModel = new Backbone.Model();

                var errorModel = ValidationUtil.validateMeasuredDateAndTime(formModel, '12/1/2014' );
                expect(formModel.errorModel.get('onset-date')).toBe(undefined);
            }); 

            it('should invalidate future fuzzy on-set date (MM/YYYY)', function() {

                var formModel = new Backbone.Model();
                formModel.errorModel = new Backbone.Model();

                var errorModel = ValidationUtil.validateMeasuredDateAndTime(formModel, '12/2019' );
                expect(formModel.errorModel.get('onset-date')).toBe('Onset Date must be in the past.');
            });

            it('should validate past fuzzy on-set date (MM/YYYY)', function() {

                var formModel = new Backbone.Model();
                formModel.errorModel = new Backbone.Model();

                var errorModel = ValidationUtil.validateMeasuredDateAndTime(formModel, '12/2014' );
                expect(formModel.errorModel.get('onset-date')).toBe(undefined);
            }); 

            it('should invalidate future fuzzy on-set date (YYYY)', function() {

                var formModel = new Backbone.Model();
                formModel.errorModel = new Backbone.Model();

                var errorModel = ValidationUtil.validateMeasuredDateAndTime(formModel, '2019' );
                expect(formModel.errorModel.get('onset-date')).toBe('Onset Date must be in the past.');
            });         

            it('should validate past fuzzy on-set date (YYYY)', function() {

                var formModel = new Backbone.Model();
                formModel.errorModel = new Backbone.Model();

                var errorModel = ValidationUtil.validateMeasuredDateAndTime(formModel, '2014' );
                expect(formModel.errorModel.get('onset-date')).toBe(undefined);
            });                        
        });

        describe('Test overall form validation function', function(){
            it('Should test invalid form entry', function(){
                var nextYearDate = moment().add(1, 'year').format('MM/DD/YYYY');
                var model = new Backbone.Model({'onset-date': nextYearDate});
                model.errorModel = new Backbone.Model();
                expect(ValidationUtil.validateModel(model)).toEqual('Validation errors. Please fix.');
            });

            it('Should test valid form entry', function(){
                var model = new Backbone.Model({'onset-date': moment().format('MM/DD/YYYY')});
                model.errorModel = new Backbone.Model();
                ValidationUtil.validateModel(model);
                expect(model.errorModel.toJSON()).toEqual({});
            });
        });
});