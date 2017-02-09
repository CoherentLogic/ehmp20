/* ========================================================================
 * Extends Bootstrap accessibility library provided by PayPal and eBay Software Foundation
 * ======================================================================== */

(function($) {
    "use strict";

    // GENERAL UTILITY FUNCTIONS
    // ===============================

    var uniqueId = function(prefix) {
        return (prefix || 'ui-id') + '-' + Math.floor((Math.random() * 1000) + 1);
    };

    var removeMultiValAttributes = function(el, attr, val) {
        var describedby = (el.attr(attr) || "").split(/\s+/),
            index = $.inArray(val, describedby);
        if (index !== -1) {
            describedby.splice(index, 1);
        }
        describedby = $.trim(describedby.join(" "));
        if (describedby) {
            el.attr(attr, describedby);
        } else {
            el.removeAttr(attr);
        }
    };

    var initAT = function(view, $) {

        // Alert Extension
        // ===============================

        view.$('.alert').attr('role', 'alert');
        if (!view.$('.close [aria-hidden=true]').length)
            view.$('close').removeAttr('aria-hidden').wrapInner('<span aria-hidden="true"></span>').append('<span class="sr-only">Close</span>');

        // DROPDOWN Extension
        // ===============================

        var toggle = '[data-toggle=dropdown]',
            par, firstItem, focusDelay = 200,
            menus = view.$(toggle).parent().find('ul').attr('role', 'menu'),
            lis = menus.find('li').attr('role', 'presentation');

        lis.find('a').attr({
            'role': 'menuitem',
            'tabIndex': '-1'
        });
        view.$(toggle).attr({
            'aria-haspopup': 'true',
            'aria-expanded': 'false'
        });

        view.$(toggle).parent().on('shown.bs.dropdown', function(e) {
            par = $(this);
            var toggle = par.find('[data-toggle=dropdown]');
            toggle.attr('aria-expanded', 'true');

            setTimeout(function() {
                firstItem = $('.dropdown-menu [role=menuitem]:visible', par)[0];
                try {
                    firstItem.focus();
                } catch (ex) {}
            }, focusDelay);
        });

        view.$(toggle).parent().on('hidden.bs.dropdown', function(e) {
            par = $(this);
            var toggle = par.find('[data-toggle=dropdown]');
            toggle.attr('aria-expanded', 'false');
        });

        // Tab Extension
        // ===============================

        var tablist = view.$('.nav-tabs, .nav-pills'),
            tabs = tablist.find('[data-toggle="tab"], [data-toggle="pill"]');
        lis = tablist.children('li');

        tablist.attr('role', 'tablist');
        lis.attr('role', 'presentation');
        tabs.attr('role', 'tab');

        tabs.each(function(index) {
            var tabpanel = $($(this).attr('href')),
                tab = $(this),
                tabid = tab.attr('id') || uniqueId('ui-tab');

            tab.attr('id', tabid);

            if (tab.parent().hasClass('active')) {
                tab.attr({
                    'tabIndex': '0',
                    'aria-selected': 'true',
                    'aria-controls': tab.attr('href').substr(1)
                });
                tabpanel.attr({
                    'role': 'tabpanel',
                    'tabIndex': '0',
                    'aria-hidden': 'false',
                    'aria-labelledby': tabid
                });
            } else {
                tab.attr({
                    'tabIndex': '-1',
                    'aria-selected': 'false',
                    'aria-controls': tab.attr('href').substr(1)
                });
                tabpanel.attr({
                    'role': 'tabpanel',
                    'tabIndex': '-1',
                    'aria-hidden': 'true',
                    'aria-labelledby': tabid
                });
            }
        });

        var tabactivate = $.fn.tab.Constructor.prototype.activate;

        var colltabs = view.$('[data-toggle="collapse"]');
        colltabs.attr({
            'role': 'tab',
            'aria-selected': 'false',
            'aria-expanded': 'false'
        });
        colltabs.each(function(index) {
            var colltab = $(this),
                collpanel = (colltab.attr('data-target')) ? $(colltab.attr('data-target')) : $(colltab.attr('href')),
                parent = colltab.attr('data-parent'),
                collparent = parent && $(parent),
                collid = colltab.attr('id') || uniqueId('ui-collapse');

            $(collparent).find('div:not(.collapse,.panel-body), h4').attr('role', 'presentation');

            colltab.attr('id', collid);
            if (collparent) {
                collparent.attr({
                    'role': 'tablist',
                    'aria-multiselectable': 'true'
                });
                if (collpanel.hasClass('in')) {
                    colltab.attr({
                        'aria-controls': colltab.attr('href').substr(1),
                        'aria-selected': 'true',
                        'aria-expanded': 'true',
                        'tabindex': '0'
                    });
                    collpanel.attr({
                        'role': 'tabpanel',
                        'tabindex': '0',
                        'aria-labelledby': collid,
                        'aria-hidden': 'false'
                    });
                } else {
                    colltab.attr({
                        'aria-controls': colltab.attr('href').substr(1),
                        'tabindex': '-1'
                    });
                    collpanel.attr({
                        'role': 'tabpanel',
                        'tabindex': '-1',
                        'aria-labelledby': collid,
                        'aria-hidden': 'true'
                    });
                }
            }
        });

        var collToggle = $.fn.collapse.Constructor.prototype.toggle;

        // Carousel Extension
        // ===============================

        view.$('.carousel').each(function(index) {
            var This = $(this),
                prev = This.find('[data-slide="prev"]'),
                next = This.find('[data-slide="next"]'),
                options = This.find('.item'),
                listbox = options.parent();

            This.attr({
                'data-interval': 'false',
                'data-wrap': 'false'
            });
            listbox.attr('role', 'listbox');
            options.attr('role', 'option');

            // var spanPrev = document.createElement('span');
            // spanPrev.setAttribute('class', 'sr-only');
            // spanPrev.innerHTML = 'Previous';

            // var spanNext = document.createElement('span');
            // spanNext.setAttribute('class', 'sr-only');
            // spanNext.innerHTML = 'Next';

            // prev.attr('role', 'button');
            // next.attr('role', 'button');

            // prev.append(spanPrev);
            // next.append(spanNext);

            options.each(function() {
                var item = $(this);
                if (item.hasClass('active')) {
                    item.attr({
                        'aria-selected': 'true'//,
                        //'tabindex': '0'
                    });
                } else {
                    item.attr({
                        'aria-selected': 'false'//,
                        //'tabindex': '-1'
                    });
                }
            });
        });

    };


    var Original = Backbone.Marionette.View,
        ModifiedView = Original.extend({
            // override the constructor, and call the original
            constructor: function() {
                this.listenTo(this, 'before:attach', function() {
                    initAT(this._parentLayoutView && this._parentLayoutView() ? this._parentLayoutView() : this, $);
                });

                Original.prototype.constructor.apply(this, arguments);
            }
        });
    Backbone.Marionette.View = ModifiedView;

})(jQuery);