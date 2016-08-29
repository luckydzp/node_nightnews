/**
 * Created by sky on 2016/8/27 0027.
 */
/**
 * Created by daizhipeng on 2016/8/26.
 */
var url = require('url');
var ProtocolIds = require('../data/ProtocolIdsDta')

module.exports = function (app) {
    app.route('/api')
        .post(function (req, res, next) {
            var argObj = url.parse(req.url, true).query;
            var protocoid = argObj.protocol;
            if (!protocoid) {
                next("protocol format error");
                return;
            }

            if (!ProtocolIds.hasOwnProperty(protocoid)){
                next("protocol id not found");
                return;
            }

            if (ProtocolIds[protocoid])
            {
                //TODO RSA解密
            }

            next();

        });
};