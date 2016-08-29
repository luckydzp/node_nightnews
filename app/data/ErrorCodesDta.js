/**
 * Created by sky on 2016/8/27 0027.
 */
var ErrCodes = {
    //成功
    'ret_ok': [0, ''],
    'err_common': [-1, "请求失败"],

    //请求错误
    'err_internal': [-100, "服务器内部错误"],
    'err_sign': [-101, "安全验证失败"],
    'err_protocol': [-102, "不支持的协议"],
    'err_dataformat': [-103, "数据格式错误"],
    'err_token': [-104, "token验证失败"],


    //业务错误
    //账号
    'err_unameEmpty': [-10100, "用户名为空"],
    'err_unameIllegal': [-10101, "用户名格式非法"],
    'err_unameExist': [-10102, "用户名已存在"],
    'err_phoneExist': [-10103, "手机号已存在"],
    'err_qqExist': [-10104, "qq号已存在"],
    'err_wechatExist': [-10105, "微信号已存在"],
    'err_unameTypeErr': [-10106, "用户名型错误"],
    'err_unameNotExist': [-10107, "用户名不存在"],

    //密码
    'err_pwdEmpty': [-10200, "密码为空"],
    'err_pwdErr': [-10201, "密码验证失败"],
    'err_pwdUnchanged': [-10202, "密码与旧密码相同"],


}

module.exports = ErrCodes;