const db = require('./db');
const moment = require('moment');
const express = require('express');
const router = express.Router();
// 监听浏览器的POST addMsg请求
router.post('/addMsg', (req, res) => {
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
router.get('/delete', function (req, res) {
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
router.get('/getMsgById', (req, res) => {
    let id = req.query.id;
    db('select * from users where id=?', id, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send(result[0]);
    })
})
//修改数据
router.post('/updataMsg', (req, res) => {
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
module.exports = router;