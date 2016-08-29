/**
 * Created by sky on 2016/8/27 0027.
 */
/**
 * Created by daizhipeng on 2016/8/26.
 */
var ErrCodes = require('../data/ErrorCodesDta');

function CommonCtr() {
};

CommonCtr.prototype.doErr = function (res, err) {
    var resObj = {};

    if (!err)
        err = ErrCodes.err_common;

    resObj.errCode = err[0];
    resObj.errMsg = err[1];

    return res.json(resObj);
};

CommonCtr.prototype.doSuccess = function (res, sendObj) {
    var resObj = {};
    if (sendObj){
        resObj = sendObj;
    }
    resObj.errCode = ErrCodes.ret_ok[0];
    resObj.errMsg = ErrCodes.ret_ok[1];

    return res.json(resObj);

}


module.exports = CommonCtr;


