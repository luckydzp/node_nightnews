/**
 * Created by daizhipeng on 2016/8/25.
 */

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

module.exports = function () {
    var app = express();

// view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

// routes
    require('../app/routes/ApiAuthRt.js')(app);
    require('../app/routes/ApiMainRt.js')(app);


    // 处理所有未知的请求
    app.use(function(req, res, next){
        res.status(404);
        try {
            return res.json('Not Found');
        } catch(e) {
            console.error('404 set header after sent');
        }
    });

    // 统一处理出错的情况
    app.use(function(err, req, res, next){
        if(!err) {return next()}
        res.status(500);
        try {
            return res.json(err || 'server error');
        } catch(e) {
            console.error('500 set header after sent');
        }
    });


    return app;
}



