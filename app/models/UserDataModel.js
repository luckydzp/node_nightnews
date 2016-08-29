/**
 * Created by daizhipeng on 2016/8/26.
 */
var mongoose = require('mongoose');
/*{
    "uid" : "1",
    "nick" : "tom",
    "account" : "tom@163.com",
    "pwd" : "md5pwd",
    "phone" : "1380013800",
    "head" : "1",
    "registTime" : "1471442138",
    "wechat" : "",
    "qq" : ""
}*/
var UserDataSchema = new mongoose.Schema({
    uid:String,
    nick:String,
    account:String,//email
    pwd:String,
    phone:String,
    head:String,
    wechat:String,
    qq:String,
    // 注册时间 设置默认值
    registTime: {type: Date, default: Date.now}
});

var UserData = mongoose.model('UserData', UserDataSchema);
