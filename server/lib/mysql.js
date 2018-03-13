const mysql = require('mysql');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'chat',
});

const query = (sql, callback) => {
    pool.getConnection((err, connection) => {
        // console.log(connection);
        connection.query(sql, (error, results) => {
            connection.release();
            callback(error, results);
        });
    });
};

// 使用Promise处理数据库操作，避免业务代码中出现回调地狱
const queryPromise = (sql) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            connection.query(sql, (error, results) => {
                // 先断开与数据库的连接
                connection.release();
                // 处理结果
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            });
        });
    });
};

// 使用Async处理数据库操作，暂不开放此方法
const queryAsync = (sql) => {};

module.exports = {
    query,
    queryPromise,
};