/**
 * Created by daizhipeng on 2016/8/26.
 */

var mongoose = require('mongoose');
var redisClient = require('../../config/redis');
var ErrCodes = require('./../data/ErrorCodesDta');
var CommonUtil = require('./../util/CommonUtil');
var RegExpUtil = require('./../util/RegExpUtil');
var PromiseUtil = require('./../util/PromiseUtil');

//redis key
const REDISKEY_TOKEN = 'node:nightnews:login:token:'
const REDISKEY_UID = 'node:nightnews:login:uid:'

//mongoose model
var UserData = mongoose.model('UserData');
var IncUserid = mongoose.model('IncUserid');

var CommonCtrl = require('./CommonCtrl');

function UserDataCtrl() {
    CommonCtrl.call(this);

}
UserDataCtrl.prototype = new CommonCtrl();

UserDataCtrl.prototype.register = function (req, res, next) {
    /*{
     "uid" : "2",
     "nick" : "tom",
     "account" : "tom@163.com",
     "pwd" : "md5pwd",
     "phone" : "1380013800",
     "head" : "1",
     "wechat" : "",
     "qq" : ""
     }
     */
    var reqBody = req.body;
    if (!reqBody.account) {
        CommonCtrl.prototype.doErr.call(this, res, ErrCodes.err_unameEmpty);
    }
    else if (!RegExpUtil.isEmail(reqBody.account)) {
        CommonCtrl.prototype.doErr.call(this, res, ErrCodes.err_unameIllegal);
    }
    else if (!reqBody.pwd) {
        CommonCtrl.prototype.doErr.call(this, res, ErrCodes.err_pwdEmpty);
    }
    else {
        var promise = UserData.findOne({account: reqBody.account}).exec();
        promise
            .then(function (data, reject) {
                if (data) {
                    return PromiseUtil.createErrRet(ErrCodes.err_unameExist);
                }
                else {
                    if (reqBody.phone) {
                        return UserData.findOne({phone: reqBody.phone}).exec();
                    }
                    else {
                        return;
                    }
                }
            })
            .then(function (data) {
                if (data) {
                    return PromiseUtil.createErrRet(ErrCodes.err_phoneExist);
                }
                else {
                    if (reqBody.qq) {
                        return UserData.findOne({qq: reqBody.qq}).exec();
                    }
                    else {
                        return;
                    }
                }
            })
            .then(function (data) {
                if (data) {
                    return PromiseUtil.createErrRet(ErrCodes.err_qqExist);
                }
                else {
                    if (reqBody.wechat) {
                        return UserData.findOne({wechat: reqBody.wechat}).exec();
                    }
                    else {
                        return;
                    }
                }
            })
            .then(function (data) {
                if (data) {
                    return PromiseUtil.createErrRet(ErrCodes.err_wechatExist);
                }
                else {
                    return IncUserid.findOneAndUpdate({name: "user"}, {$inc: {'id': 1}}).exec();
                }

            })
            .then(function (data) {
                if (data && data.id != -1) {
                    var userdata = new UserData();
                    userdata.uid = String(data.id);
                    userdata.account = reqBody.account;
                    userdata.pwd = reqBody.pwd;
                    userdata.nick = reqBody.nick || "";
                    userdata.phone = reqBody.phone || "";
                    userdata.head = reqBody.head || "";
                    userdata.wechat = reqBody.wechat || "";
                    userdata.qq = reqBody.qq || "";

                    return userdata.save();
                }
                else {
                    return PromiseUtil.createErrRet(ErrCodes.err_internal);
                }
            })
            .then(function () {
                CommonCtrl.prototype.doSuccess.call(this, res);
                return;
            })
            .catch(function (err) {
                var retErr = ErrCodes.err_internal;
                if (err)
                    CommonCtrl.prototype.doErr.call(this, res, err);
                return;
            });


    }

};

UserDataCtrl.prototype.login = function (req, res, next) {
    var reqBody = req.body;
    if (!reqBody.account) {
        CommonCtrl.prototype.doErr.call(this, res, ErrCodes.err_unameEmpty);
    }
    else if (!reqBody.pwd) {
        CommonCtrl.prototype.doErr.call(this, res, ErrCodes.err_pwdEmpty);
    }
    else {
        if (reqBody.type == 1) {
            //email
            var reqAccount = reqBody.account;
            if (!RegExpUtil.isEmail(reqAccount)) {
                CommonCtrl.prototype.doErr.call(this, res, ErrCodes.err_unameTypeErr);
            }
            else {
                var reqPwd = reqBody.pwd;
                var reqAccount = reqBody.account;
                var reqDevice = reqBody.device;
                var tToken = null;
                var tUid = null;

                var promise = UserData.findOne({account: reqAccount}).exec();
                promise
                    .then(function (user) {
                        if (!user) {
                            return PromiseUtil.createErrRet(ErrCodes.err_unameNotExist);
                        }
                        else {
                            var pwd = user.pwd;
                            var bVerify = loginVerify(reqAccount, reqPwd, pwd);
                            if (!bVerify) {
                                return PromiseUtil.createErrRet(ErrCodes.err_pwdErr);
                            }
                            else {
                                tToken = CommonUtil.tool.md5(CommonUtil.md5Salt + reqDevice + CommonUtil.tool.timestamp());
                                tUid = user.uid;
                                return loginProcess(tUid, reqDevice, tToken);
                            }
                        }
                    })
                    .then(function (data) {
                        if (data[0] != 'OK') {
                            return PromiseUtil.createErrRet(ErrCodes.err_internal);
                        }
                        else {
                            var retObj = {};
                            retObj.token = tToken;
                            retObj.uid = tUid;
                            retObj.type = 1;
                            retObj.account = reqAccount;
                            CommonCtrl.prototype.doSuccess.call(this, res, retObj);

                        }
                    })
                    .catch(function (err) {
                        var retErr = ErrCodes.err_internal;
                        if (err)
                            retErr = err;
                        CommonCtrl.prototype.doErr.call(this, res, retErr);
                        return;
                    });
            }
        }
        else if (reqBody.type == 2) {
            //phone
            var reqAccount = reqBody.account;
            if (!RegExpUtil.isPhone(reqAccount)) {
                CommonCtrl.prototype.doErr.call(this, res, ErrCodes.err_unameTypeErr);
            }
            else {
                var reqPwd = reqBody.pwd;
                var reqAccount = reqBody.phone;
                var reqDevice = reqBody.device;
                var tToken = null;
                var tUid = null;
                var promise = UserData.findOne({phone: reqAccount}).exec();
                promise
                    .then(function (user) {
                        if (!user) {
                            return PromiseUtil.createErrRet(ErrCodes.err_unameNotExist);
                        }
                        else {
                            var pwd = user.pwd;
                            var bVerify = loginVerify(reqAccount, reqPwd, pwd);
                            if (!bVerify) {
                                return PromiseUtil.createErrRet(ErrCodes.err_pwdErr);
                            }
                            else {
                                tToken = CommonUtil.tool.md5(CommonUtil.md5Salt + reqDevice + CommonUtil.tool.timestamp());
                                tUid = user.uid;
                                return loginProcess(tUid, reqDevice, tToken);
                            }
                        }
                    })
                    .then(function (err, data) {
                        if (data[0] != 'OK') {
                            return PromiseUtil.createErrRet(ErrCodes.err_internal);
                        }
                        else {
                            var retObj = {};
                            retObj.token = tToken;
                            retObj.uid = tUid;
                            retObj.type = 2;
                            retObj.account = reqAccount;
                            CommonCtrl.prototype.doSuccess.call(this, res, retObj);
                        }
                    })
                    .catch(function (err) {
                        var retErr = ErrCodes.err_internal;
                        if (err)
                            retErr = err;
                        CommonCtrl.prototype.doErr.call(this, res, retErr);
                        return;
                    })
            }
        }
        else {
            CommonCtrl.prototype.doErr.call(this, res, ErrCodes.err_unameTypeErr);
        }
    }
};

function loginVerify(reqAccount, reqPwd, pwd) {
    if (reqAccount && reqPwd && pwd) {
        var calPwd = CommonUtil.tool.md5(reqAccount + pwd)
        if (calPwd == reqPwd) {
            return true;
        }
    }
    return false;
}

function loginProcess(uid, device, token) {
    var sendObj = {};
    sendObj.uid = uid;
    sendObj.token = token;
    var redisObj = {};
    redisObj.uid = uid;
    redisObj.device = device;

    return redisClient.getAsync(REDISKEY_UID + uid)
        .then(function (data) {
            if (data) {
                return redisClient.delAsync(data);
            }
        })
        .then(function (data) {
            return redisClient.multi()
                .set(REDISKEY_UID + uid, REDISKEY_TOKEN + token)
                .expire(REDISKEY_UID + uid, 60)
                .execAsync();
        })
        .then(function (data) {
            return redisClient.multi()
                .hmset(REDISKEY_TOKEN + token, redisObj)
                .expire(REDISKEY_TOKEN + token, 60)
                .execAsync();
        })



}


module.exports = UserDataCtrl;



