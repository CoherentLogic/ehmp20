'use strict';

module.exports.getResourceConfig = function() {
    return [{
        name: 'favorites-get',
        path: '',
        get: callGet,
        requiredPermissions: [],
        isPatientCentric: false,
        subsystems: ['pjds', 'favoriteOrderable']
    },{
        name: 'favorites-add',
        path: '',
        post: callAdd,
        requiredPermissions: [],
        isPatientCentric: false,
        subsystems: ['pjds', 'favoriteOrderable']
    },{
        name: 'favorites-delete',
        path: '',
        delete: callDelete,
        requiredPermissions: [],
        isPatientCentric: false,
        subsystems: ['pjds', 'favoriteOrderable']
    }];
};

function callGet(req, res) {
    req.app.subsystems.favoriteOrderable.getFavorites(req, res);
}

function callAdd(req, res) {
    req.app.subsystems.favoriteOrderable.addFavorites(req, res);
}

function callDelete(req, res) {
    req.app.subsystems.favoriteOrderable.deleteFavorites(req, res);
}
