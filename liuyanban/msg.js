const db = require('./db');
const express = require('express');
const router = express.Router();
// 监听浏览器的get/message.html请求
router.get('/message.html', (req, res) => {
    // 1.通过db去数据库获取所有的留言
    let sql = 'select l.*,u.picture from users l join resUser u on l.username = u.nickname'
    db(sql, null, (err, result) => {
        if (err) throw err;
        res.render(__dirname + '/message.html', {
            arr: result,
            isLogin: req.session.isLogin,
            userInfo: req.session.userInfo
        });
    });
});
module.exports = router;