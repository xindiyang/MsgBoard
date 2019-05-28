// 导出db模块
// 定义函数，实现mysql查询功能
let db = (sql, params, callback) => {
    const mysql = require('mysql');
    const conn = mysql.createConnection({
        host: 'localhost',
        port: 8889,
        user: 'root',
        password: 'root',
        database:'Sunday'
        // Socket: /Applications/MAMP/tmp/mysql/mysql.sock
    });
    conn.connect();
    conn.query(sql, params, callback);
    conn.end();
}
module.exports = db;