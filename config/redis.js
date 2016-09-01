/**
 * Created by daizhipeng on 2016/8/29.
 */
var redis = require('redis');
var config = require('./config');

var bluebird = require("bluebird");
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);


 var redisClient = redis.createClient(config.redisAuth.port, config.redisAuth.host, config.redisAuth.opt);
//错误监听
redisClient.on("error", function (err) {
    console.log("Redis Error " + err);
});

module.exports = redisClient;