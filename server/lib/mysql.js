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
        connection.query(sql, (err, rows) => {
            callback(err, rows);
            connection.release();
        });
    });
};

exports.query = query;