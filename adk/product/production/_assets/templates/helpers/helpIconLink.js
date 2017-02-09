define([
    'handlebars',
    'main/Utils',
    'hbs!_assets/templates/helpIconLink'
], function(Handlebars, utils, helpIconTemplate) {
    function helpIconLink(key, iconColor, options) {
        'use strict';

        if (arguments.length < 2)
            throw new Error("Handlerbars Helper 'helpIconLink' needs one parameter");

        var context = {
            key: key,
            tooltip: utils.helpUtils.getTooltip(key),
            tooltip_placement: utils.helpUtils.getTooltipPlacement(key),
            url: utils.helpUtils.getUrl(key)
        };

        if(options)
            context.iconColor = iconColor;

        return helpIconTemplate(context);
    }

    Handlebars.registerHelper('helpIconLink', helpIconLink);
    return helpIconLink;
});