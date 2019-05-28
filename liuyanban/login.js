const db = require('./db');
const express = require('express');
// 引入multer
const multer = require('multer');
const router = express.Router();
// 显示注册用户页面
router.get('/register.html', (req, res) => {
    res.sendFile(__dirname + '/register.html');
})
// 配置multer,上传文件使用
const myupload = multer({
    dest: __dirname + '/myup'
})
// 接受用户注册的信息
router.post('/regUser', myupload.single('picture'), (req, res) => {
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
router.post('/checkUser', (req, res) => {
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

module.exports = router;