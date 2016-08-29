/**
 * Created by daizhipeng on 2016/8/29.
 */
var redis = require('redis');
var config = require('./config');

var bluebird = require("bluebird");
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);



module.exports = redis.createClient(config.redisAuth.port, config.redisAuth.host, config.redisAuth.opt);