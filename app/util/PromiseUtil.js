/**
 * Created by sky on 2016/8/28 0028.
 */

function PromiseUtil() {

}

PromiseUtil.createErrRet = function (errObj) {
    var retPromise = new Promise(function (resolve, reject) {
        reject(errObj);
    });

    return retPromise;
};

module.exports = PromiseUtil;

