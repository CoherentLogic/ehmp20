define([
    'app/applets/orders/writeback/common/requiredFields/requiredFieldsUtils'
], function(RequiredFieldsUtils) {
    'use strict';

    var changeAssignment = function(form) {
        form.model.unset('person');
        form.model.unset('facility');
        form.model.unset('team');
        form.model.unset('roles');

        form.ui.personContainer.trigger('control:hidden', true);
        form.ui.facilityContainer.trigger('control:hidden', true);
        form.ui.teamContainer.trigger('control:hidden', true);
        form.ui.rolesContainer.trigger('control:hidden', true);

        form.ui.personField.trigger('control:hidden', true);
        form.ui.facilityField.trigger('control:hidden', true);
        form.ui.teamField.trigger('control:hidden', true);
        form.ui.rolesField.trigger('control:hidden', true);

        form.ui.personField.trigger('control:required', false);
        form.ui.facilityField.trigger('control:required', false);
        form.ui.teamField.trigger('control:required', false);
        form.ui.rolesField.trigger('control:required', false);

        form.ui.personField.trigger('control:picklist:set', []);
        form.ui.facilityField.trigger('control:picklist:set', []);
        form.ui.teamField.trigger('control:picklist:set', []);
        form.ui.rolesField.trigger('control:picklist:set', []);

        var assign = form.model.get('assignment');
        var additionalRequiredFields = [];
        if (assign === 'opt_person') {
            retrieveFacilityPicklist(form);

            form.ui.personField.trigger('control:required', true);
            form.ui.facilityField.trigger('control:required', true);

            additionalRequiredFields.push('person');
            additionalRequiredFields.push('facility');

            form.ui.facilityContainer.trigger('control:hidden', false);

            form.ui.facilityField.trigger('control:hidden', false);
        } else if (assign === 'opt_myteams') {
            retrieveTeamsForAUserPicklist(form);

            form.ui.teamField.trigger('control:required', true);
            form.ui.rolesField.trigger('control:required', true);

            additionalRequiredFields.push('team');
            additionalRequiredFields.push('roles');

            form.ui.teamContainer.trigger('control:hidden', false);
            form.ui.teamField.trigger('control:hidden', false);
        } else if (assign === 'opt_anyteam') {
            retrieveFacilityPicklist(form);

            form.ui.facilityField.trigger('control:required', true);
            form.ui.teamField.trigger('control:required', true);
            form.ui.rolesField.trigger('control:required', true);

            form.ui.facilityContainer.trigger('control:hidden', false);
            form.ui.facilityField.trigger('control:hidden', false);

            additionalRequiredFields.push('facility');
            additionalRequiredFields.push('team');
            additionalRequiredFields.push('roles');
        } else if (assign === 'opt_patientteams') {
            retrieveTeamsForAPatient(form);

            form.ui.teamField.trigger('control:required', true);
            form.ui.rolesField.trigger('control:required', true);

            additionalRequiredFields.push('team');
            additionalRequiredFields.push('roles');

            form.ui.teamContainer.trigger('control:hidden', false);
            form.ui.teamField.trigger('control:hidden', false);
        }
        RequiredFieldsUtils.requireFields(form, additionalRequiredFields);
        form.adjustButtonProperties();
    };

    var retrieveFacilityPicklist = function(form) {
        form.ui.facilityField.trigger('control:disabled', true);

        var facilities = new ADK.UIResources.Picklist.Team_Management.Facilities();

        form.listenToOnce(facilities, 'read:success', function(collection, response) {
            if (response && response.data) {
                var items = _.sortBy(response.data, 'vistaName');
                form.ui.facilityField.trigger('control:picklist:set', [items]);
                form.ui.facilityField.trigger('control:disabled', false);

                var assignment = form.model.get('assignment');
                if (form.model.has('pendingFacility')) {
                    form.model.set('facility', form.model.get('pendingFacility'));
                    form.model.unset('pendingFacility');
                } else {
                    if (assignment === 'opt_person') {
                        var userFacilityName = ADK.UserService.getUserSession().attributes.facility;
                        if (userFacilityName) {
                            var matchingFacility = _.find(items, function(item) {
                                if (item.vistaName) {
                                    return (item.vistaName.indexOf(userFacilityName) > -1);
                                }
                                return false;
                            });
                            if (matchingFacility && matchingFacility.facilityID) {
                                form.model.set('facility', matchingFacility.facilityID);
                            }
                        }
                    }
                }
            }
        });

        facilities.fetch();
    };

    function cloneArray(a) {
        var rv = [];
        _.each(a, function(item) {
            rv.push(item);
        });
        return rv;
    }

    function cleanupAfterTeamListLoad(form) {
        form.ui.teamField.trigger('control:disabled', false);

        if (form.model.has('pendingTeam')) {
            form.model.set('team', form.model.get('pendingTeam'));
            form.model.unset('pendingTeam');
        }
    }

    var handleFacilityChange = function(form) {
        form.ui.personField.trigger('control:disabled', true);
        form.model.unset('person');

        var setFacility = form.model.get('facility');
        var setAssignment = form.model.get('assignment');

        form.ui.teamField.trigger('control:disabled', true);
        form.model.unset('team');

        if (_.isEmpty(setFacility)) {
            form.ui.personField.trigger('control:hidden', true);
            form.ui.personField.trigger('control:picklist:set', []);
            form.ui.personContainer.trigger('control:hidden', true);

            form.ui.teamField.trigger('control:hidden', true);
            form.ui.teamField.trigger('control:picklist:set', []);
            form.ui.teamContainer.trigger('control:hidden', true);
        } else if (setAssignment === 'opt_person') {
            form.ui.personContainer.trigger('control:hidden', false);
            form.ui.personField.trigger('control:hidden', false);

            var people = new ADK.UIResources.Picklist.Team_Management.PeopleAtAFacility();

            form.listenToOnce(people, 'read:success', function(collection, response) {
                if (response && response.data) {
                    var items = _.sortBy(response.data, 'name');
                    form.ui.personField.trigger('control:picklist:set', [items]);
                    form.ui.personField.trigger('control:disabled', false);

                    if (form.model.has('pendingPerson')) {
                        form.model.set('person', form.model.get('pendingPerson'));
                        form.model.unset('pendingPerson');
                    }
                }
            });

            people.fetch({facilityID: setFacility});
        } else if (setAssignment === 'opt_anyteam') {
            form.ui.teamContainer.trigger('control:hidden', false);
            form.ui.teamField.trigger('control:hidden', false);

            var teams = new ADK.UIResources.Picklist.Team_Management.Teams.ForAFacility();

            form.listenToOnce(teams, 'read:success', function(collection, response) {
                if (response && response.data) {
                    var items = _.sortBy(response.data, 'teamName');
                    var groups = [{
                        group: 'All Teams',
                        pickList: items
                    }];

                    form.model.set('storedTeamsList', items);
                    form.ui.teamField.trigger('control:picklist:set', [groups]);

                    cleanupAfterTeamListLoad(form);
                }
            });

            form.listenToOnce(teams, 'read:error', function() {
                cleanupAfterTeamListLoad(form);
            });

            teams.fetch({
                facilityID: setFacility
            });
        }
    };

    var retrieveTeamsForAUserPicklist = function(form) {
        form.ui.teamField.trigger('control:disabled', true);

        var site = ADK.UserService.getUserSession().get('site');
        var user = ADK.UserService.getUserSession().get('duz')[site];

        var teams = new ADK.UIResources.Picklist.Team_Management.Teams.ForAUser();

        form.listenToOnce(teams, 'read:success', function(collection, response) {
            if (response && response.data) {
                var items = _.sortBy(response.data, 'teamName');
                var groups = [{
                    group: 'My Teams',
                    pickList: items
                }];
                var teamsListToStore = cloneArray(items);

                form.model.set('storedTeamsList', teamsListToStore);
                form.ui.teamField.trigger('control:picklist:set', [groups]);

                var patientAssociatedTeams = new ADK.UIResources.Picklist.Team_Management.Teams.PatientRelatedForAUser();

                form.listenToOnce(patientAssociatedTeams, 'read:success', function(collection, response) {
                    if (response && response.data && (response.data.length > 0)) {
                        var items = _.sortBy(response.data, 'teamName');
                        groups.unshift({
                            group: 'My Teams Associated with Patient',
                            pickList: items
                        });
                        _.each(items, function(item) {
                            teamsListToStore.push(item);
                        });

                        form.model.set('storedTeamsList', teamsListToStore);
                        form.ui.teamField.trigger('control:picklist:set', [groups]);
                    }

                    cleanupAfterTeamListLoad(form);
                });

                form.listenToOnce(patientAssociatedTeams, 'read:error', function() {
                    cleanupAfterTeamListLoad(form);
                });

                var patientID = ADK.PatientRecordService.getCurrentPatient().get('icn');

                patientAssociatedTeams.fetch({
                    staffIEN: user,
                    patientID: patientID
                });
            }
        });

        teams.fetch({
            staffIEN: user
        });
    };

    var retrieveTeamsForAPatient = function(form) {
        form.ui.teamField.trigger('control:disabled', true);

        var site = ADK.UserService.getUserSession().get('site');
        var user = ADK.UserService.getUserSession().get('duz')[site];

         var patientAssociatedTeams = new ADK.UIResources.Picklist.Team_Management.Teams.ForAPatient();

         form.listenToOnce(patientAssociatedTeams, 'read:success', function(collection, response) {
             if (response && response.data && (response.data.length > 0)) {
                 var items = _.sortBy(response.data, 'teamName');
                 var groups = [{
                     group: 'Teams Associated with Patient',
                     pickList: items
                 }];

                 form.model.set('storedTeamsList', items);
                 form.ui.teamField.trigger('control:picklist:set', [groups]);
             }
             cleanupAfterTeamListLoad(form);
         });

        form.listenToOnce(patientAssociatedTeams, 'read:error', function() {
            cleanupAfterTeamListLoad(form);
        });

        var patientID = ADK.PatientRecordService.getCurrentPatient().get('icn');

        patientAssociatedTeams.fetch({
            patientID: patientID
        });
    };

    var handleTeamChange = function(form) {
        form.ui.rolesField.trigger('control:disabled', true);
        form.model.unset('roles');

        var team = form.model.get('team');
        if (_.isEmpty(team)) {
            form.ui.rolesField.trigger('control:hidden', true);
            form.ui.rolesField.trigger('control:picklist:set', []);
            form.ui.rolesContainer.trigger('control:hidden', true);
        } else {
            form.ui.rolesContainer.trigger('control:hidden', false);
            form.ui.rolesField.trigger('control:hidden', false);

            var roles = new ADK.UIResources.Picklist.Team_Management.Roles.ForATeam();

            form.listenToOnce(roles, 'read:success', function(collection, response) {
                if (response && response.data) {
                    var items = _.sortBy(response.data, 'name');
                    form.model.set('storedRolesList', items);
                    form.ui.rolesField.trigger('control:picklist:set', [items]);
                    form.ui.rolesField.trigger('control:disabled', false);

                    if (form.model.has('pendingRoles') && _.isArray(form.model.get('pendingRoles'))) {
                        form.model.set('roles', form.model.get('pendingRoles'));
                        form.model.unset('pendingRoles');
                    }
                }
            });

            roles.fetch({
                teamID: team
            });
        }
    };

    return {
        changeAssignment: changeAssignment,
        retrieveFacilityPicklist: retrieveFacilityPicklist,
        handleFacilityChange: handleFacilityChange,
        retrieveTeamsForAUserPicklist: retrieveTeamsForAUserPicklist,
        handleTeamChange: handleTeamChange
    };
});
