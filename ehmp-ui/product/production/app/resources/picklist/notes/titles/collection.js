define([], function() {
    'use strict';

    var RECENT_NOTE_TITLES = 'Recent Note Titles';
    var ALL_NOTE_TITLES = 'All Notes';

    var NoteTitle = ADK.Resources.Picklist.Model.extend({
        idAttribute: 'titleId',
        label: function() {
            return this.get('name');
        },
        value: function() {
            return this.get('titleId');
        },
        defaults: {
            ien: '',
            name: '',
            titleId: ''
        },
        parse: function(item) {
            if (item.localTitle) {
                item.name = item.localTitle;
            }
            if (item.documentDefUid) {
                item.ien = item.documentDefUid;
                item.titleId = item.documentDefUid + '---' + item.localTitle.replace(/\s/g, '_') + '---last';
            } else {
                item.titleId = 'urn:va:doc-def:' + ADK.UserService.getUserSession().get('site') + ':' + item.ien + '---' + item.name.replace(/\s/g, '_') + '---all';
            }
            return item;
        }
    });

    var NoteTitleGroup = ADK.Resources.Picklist.Group.extend({
        groupLabel: 'noteGroupLabel',
        picklist: 'noteGroup',
        Collection: ADK.Resources.Picklist.Collection.extend({
            model: NoteTitle
        }),
        defaults: {
            noteGroup: [],
            noteGroupLabel: ''
        }
    });

    var NoteTitles = ADK.Resources.Picklist.Collection.extend({
        type: 'progress-notes-titles',
        model: NoteTitleGroup,
        allTitlesFetchComplete: true,
        comparator: function(model) {
            return model.get('noteGroupLabel') === RECENT_NOTE_TITLES ? -1 : 1;
        },

        fetch: function(options) {
            options = _.extend({ parse: true }, options, { remove: false });
            var self = this,
                success = options.success,
                error = options.error,
                collection = this,
                deferred = $.Deferred(),
                allTitles,
                recentTitles,
                successCount = 0,
                errorCount = 0,
                allTitlesFetchComplete = true,
                fetchMethods = [
                    'fetchAll',
                    'fetchRecent'
                ];

            options.success = function(resp) {
                var method = successCount === 0 ? (options.reset ? 'reset' : 'set') : 'set';
                collection[method](resp, options);
                if (resp.status === 202) {
                    allTitlesFetchComplete = false;
                }
                successCount++;
                if (successCount === fetchMethods.length) {
                    // success on all fetches
                    if (success) {
                        success.call(self, collection, {}, options);
                    }
                    self.trigger('read:success', self, {}, options);
                    deferred.resolve(self);
                }
                if (successCount + errorCount === fetchMethods.length) {
                    self.sort();
                    if(allTitlesFetchComplete) {
                        self.trigger('read:complete', self, {}, options);
                    } else {
                        self.trigger('read:incomplete', self, {}, options);
                    }
                }
            };
            options.error = function(resp) {
                errorCount++;
                allTitlesFetchComplete = false;
                if (errorCount === 1) { // trigger failure on first error
                    // error on one or both fetches
                    if (error) {
                        error.call(self, collection, {}, options);
                    }
                    self.trigger('read:error', self, {}, options);
                    deferred.reject(resp);
                }
                if (successCount + errorCount === fetchMethods.length) {
                    self.trigger('read:incomplete', self, {}, options);
                }
            };
            _.each(fetchMethods, function(fetchMethod) {
                self[fetchMethod](options);
            });
            return deferred.promise();
        },
        methodMap: {
            'readAll': 'read',
            'readRecent': 'read'
        },
        getUrl: function(method, options) {
            var url,
                opts = _.extend({ 'params': this.params }, options),
                standardParams = {
                    pid: this.patient.get('pid'),
                    resourceId: this.get('uid')
                },
                params = _.extend({}, standardParams, _.isFunction(opts.params) ? opts.params.apply(this, arguments) : opts.params),
                criteria = options.criteria || {},
                resource = null;

            if (this.patient.has("acknowledged")) {
                criteria._ack = true;
            }
            switch(method.toLowerCase()) {
                case 'readall':
                    return 'resource/write-pick-list/progress-notes-titles-asu-filtered?docStatus=UNTRANSCRIBED&actionNames=ENTRY';
                case 'readrecent':
                    resource = 'notes-titles-getUserRecentTitles';
                    url = ADK.ResourceService.buildUrl(resource, criteria);
                    url = ADK.ResourceService.replaceURLRouteParams(url, params);
                    return url.replace(/\/+/g, '/').replace(/\?$/, '');
            }

        },
        fetchAll: function(options) {
            return this.sync('readAll', this, options || {});
        },
        fetchRecent: function(options) {
            return this.sync('readRecent', this, options || {});
        },
        parse: function(resp) {
            if (resp.data) {
                if (resp.data.items) {
                    if (resp.data.items.length > 0) {
                        return [{
                            'noteGroup': resp.data.items,
                            'noteGroupLabel': RECENT_NOTE_TITLES
                        }];
                    }
                } else {
                    return [{
                        'noteGroup': resp.data,
                        'noteGroupLabel': ALL_NOTE_TITLES
                    }];
                }
            }
            return [];
        }
    });

    return NoteTitles;
});