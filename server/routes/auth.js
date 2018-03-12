const express = require('express');
const router = express.Router();

const mysql = require('../lib/mysql');

router.post('/register', (req, res) => {
    const sql = `
        insert into user (name, password, descs)
        values('${req.body.name}', '${req.body.password}', '${req.body.desc}');
    `;
    mysql.query(sql, (err, data) => {
        if (err) {
            console.log(err);
            res.send(JSON.stringify({
                ret: -500,
                msg: err.toString(),
            }));
            return;
        }
        res.send(JSON.stringify({
            ret: 0,
            msg: `注册成功`,
        }));
    });
});

router.post('/login', (req, res) => {
    const sql = `
        select id from user
        where name = '${req.body.id}' and password = '${req.body.password}';
    `;
    mysql.query(sql, (err, data) => {
        if (err) {
            console.log(err);
            res.send(JSON.stringify({
                ret: -500,
                msg: err.toString(),
            }));
            return;
        }
        console.log(data);
        if (data.length <= 0) {
            res.send(JSON.stringify({
                ret: 404,
                msg: `用户名或密码有误`,
            }));
            return;
        }
        res.send(JSON.stringify({
            ret: 0,
            msg: `登录成功`,
        }));
    });
});

module.exports = router;