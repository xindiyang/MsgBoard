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
// 引入multer
const multer = require('multer');
// 创建服务器
const app = express();
// 开启服务器
app.listen(8000, () => console.log('服务器已经开启'));
// 配置
// 配置multer,上传文件使用
const myupload = multer({
    dest: __dirname + '/myup'
})
// 指定后缀名为html的模板文件，使用template来处理
app.engine('html', template);
// 通过express中间件，来指定静态资源文件去哪里读取
app.use('/assets/', express.static(__dirname + '/assets/'));
app.use('/myup/', express.static(__dirname + '/myup/'));
// 指定POST请求体的处理方式
app.use(bodyParser.urlencoded({
    extended: false
}));
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
*/
// 监听浏览器的get/message.html请求
app.get('/message.html', (req, res) => { 
    
    // 1.通过db去数据库获取所有的留言
    let sql = 'select l.*,u.picture from users l join resUser u on l.username = u.nickname'
    db(sql, null, (err, result) => {
    //    console.log(result);
        if (err) throw err;
        res.render(__dirname + '/message.html', {
            arr: result,
            isLogin: req.session.isLogin,
            userInfo: req.session.userInfo
        });
    });
});
// 显示注册用户页面
app.get('/register.html', (req, res) => {
    res.sendFile(__dirname + '/register.html');
})
// 接受用户注册的信息
app.post('/regUser', myupload.single('picture'), (req, res) => {
    console.log(req)
    let sql = 'insert into resUser set ?';
    // req.body.picture = req.file.path;
    req.body.picture = req.file.filename;
    console.log(req.body)
    db(sql, req.body, (err, result) => {
        if (err) throw err;
        if (result.affectedRows > 0) {
            // 注册成功
            res.send('ok');
        } else {
            // 注册失败
            res.send('fail');
        }
    })
});
// 判断登录是否成功
app.post('/checkUser', (req, res) => {
    let zhanghao = req.body.zhanghao;
    let pwd = req.body.pwd;
    let sql = 'select *from resUser where zhanghao=? and pwd = ?';
    db(sql, [zhanghao, pwd], (err, result) => {
        if (err) throw err;
        if (result.length !== 0) {
            // 登录成功
            // 使用session记录用户的登录状态
            req.session.isLogin = true;
            req.session.userInfo = result[0]; // 登录用户的对象
            // console.log(result);
            res.send('ok');
        } else {
            // 登录失败
            res.send('fail');
        }
    });
})
// 监听浏览器的POST addMsg请求
app.post('/addMsg', (req, res) => {
    req.body.username = req.session.userInfo.nickname;
    req.body.time = moment().format('YYYY-MM-DD HH:ss:mm');
    db('insert into users set ?', req.body, (err, result) => {
        if (err) throw err;
        if (result.affectedRows > 0) {
            // console.log(result);
            req.body.picture = req.session.userInfo.picture;
            res.send(req.body);
        } else {
            res.send('fail');
        }
    })
});
// 监听浏览器删除数据，找到对应的id
app.get('/delete', function (req, res) {
    // get用query来获取我们需要的值
    console.log(req.query.id);
    db('delete from users where id=?', req.query.id, (err, result) => {
        if (err) throw err;
        if (result.affectedRows > 0) {
            res.send("<script>alert('删除成功');location.href = '/message.html'</script>");
        } else {
            res.send("<script>alert('删除失败');location.href = '/message.html'</script>");
        }
    })
});
/* 
   监听浏览器修改数据 
     1.根据id查询到我们需要修改的某一条信息
     2.获取从浏览器post的新的数据
     3.通过数据库的修改再重新更新数据
*/
//根据id获取对应数据
app.get('/getMsgById', (req, res) => {
    let id = req.query.id;
    db('select * from users where id=?', id, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send(result[0]);
    })
})
//修改数据
app.post('/updataMsg', (req, res) => {
    let id = req.body.id;
    req.body.time = moment().format('YYYY年MM月DD日 HH时SS分MM秒');
    db('update users set ? where id= ?', [req.body, id], (err, result) => {
        if (err) throw err;
        if (result.affectedRows > 0) {
            res.send('ok')
        } else {
            res.send('fail')
        }
    })
})