// 引入我们自己的db模块
const db = require('./db');
// 引入时间模块
const time = require('./time')
// 引入body-parser模块
const bodyParser = require('body-parser');
// 引入模板引擎
const template = require('express-art-template');
// 引入express-session
const session = require('express-session');
// 引入moment包
const moment = require('moment');
// 引入express
const express = require('express');

// 创建服务器
const app = express();
// 开启服务器
app.listen(8000, () => console.log('服务器已经开启'));
// 配置

// 指定后缀名为html的模板文件，使用template来处理
app.engine('html', template);
// 通过express中间件，来指定静态资源文件去哪里读取
app.use('/assets/', express.static(__dirname + '/assets/'));
app.use('/myup/', express.static(__dirname + '/myup/'));
// 指定POST请求体的处理方式
app.use(bodyParser.urlencoded({
    extended: false
}));
//设置session
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'asdfasfsd',
    cookie: {
        maxAge: 3600000
    }
}));

/* 
处理浏览器的请求
引入模块
*/
const curd = require('./curd');
const msg = require('./msg');
const login = require('./login');
app.use(curd);
app.use(msg);
app.use(login);