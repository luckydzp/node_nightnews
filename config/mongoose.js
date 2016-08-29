/**
 * Created by daizhipeng on 2016/8/26.
 */
var mongoose = require('mongoose');
var config = require('./config');

module.exports = function(){
    mongoose.Promise = require('bluebird');
    var db = mongoose.connect(config.mongodb);


    // 导入 model
    require('../app/models/IncUserIdModel.js');
    require('../app/models/UserDataModel.js');



    return db;
};