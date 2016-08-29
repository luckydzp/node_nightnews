/**
 * Created by sky on 2016/8/27 0027.
 */

/**
 * 静态方法
 * @constructor
 */
function RegExpUtil() {

};

/**
 * 判断邮箱格式是否合法
 * @param email
 * @returns {boolean|*}
 */
RegExpUtil.isEmail = function (email) {
    email=email.replace(/^\s+|\s+$/g,"").toLowerCase();//去除前后空格并转小写
    var reg = /^[a-z0-9](\w|\.|-)*@([a-z0-9]+-?[a-z0-9]+\.){1,3}[a-z]{2,4}$/i;


    var isok = reg.test(email);

    return isok;
};

/**
 * 判断手机号格式是否合法
 * @param phone
 * @returns {boolean|*}
 */
RegExpUtil.isPhone = function (phone) {
    var reg = /^[1][3-8]\d{9}$/;

    var isok = reg.test(phone);

    return isok;
};

/**
 * 判断是否全为数字组成
 * @param str
 * @returns {boolean|*}
 */
RegExpUtil.isOnlyDigital = function (str) {
    var reg = /\d+/;

    var isok = reg.test(str);

    return isok;
};

/**
 * 判断是否全由数字和字母组成
 * @param str
 * @returns {boolean|*}
 */
RegExpUtil.isDigitalAndLetter = function (str) {
    var reg = /[0-9a-zA-Z]+/;

    var isok = reg.test(str);

    return isok;
};


module.exports = RegExpUtil;


