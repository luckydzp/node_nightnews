/**
 * Created by daizhipeng on 2016/8/26.
 */
var url = require('url');

var UserDataController = require('../controllers/UserDataCtrl.js');

module.exports = function (app) {
    app.route('/api')
        .post(function (req, res, next) {
            var argObj = url.parse(req.url, true).query;

            switch (argObj.protocol) {
                case '1000': {
                    var ctrl = new UserDataController();
                    ctrl.register(req, res, next);
                }
                    break;
                case '1010': {
                    var ctrl = new UserDataController();
                    ctrl.login(req, res, next);
                }
                    break;
                default:
                    next("protocol id error");

            }
        });
};