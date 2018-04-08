const express = require('express');
const router = express.Router();

const mysql = require('../lib/mysql');

router.post('/register', (req, res) => {
    const { uid, name, password, desc } = req.body;
    const sqlUid = `
        select uid from user
        where uid = '${uid}';
    `;
    mysql.queryPromise(sqlUid).then((data) => {
        if (data.length > 0) {
            res.send(JSON.stringify({
                ret: 400,
                msg: `此账号已存在`,
            }));
            return null;
        }

        const sql = `
            insert into user (uid, name, password, descs)
            values('${uid}', '${name}', '${password}', '${desc}');
        `;
        return mysql.queryPromise(sql);
    }).then((data) => {
        if (!data) {
            return;
        }
        res.send(JSON.stringify({
            ret: 0,
            msg: `注册成功`,
        }));
    }).catch((err) => {
        res.send(JSON.stringify({
            ret: -500,
            msg: err.toString(),
        }));
    });
});

router.post('/login', (req, res) => {
    const { uid, password } = req.body;
    const sql = `
        select uid, name from user
        where uid = '${uid}' and password = '${password}';
    `;
    mysql.queryPromise(sql).then((data) => {
        if (data.length <= 0) {
            res.send(JSON.stringify({
                ret: 404,
                msg: `用户名或密码有误`,
            }));
            return;
        }

        req.session.uid = uid;
        req.session.socketId = req.cookies.io;
        res.cookie('uid', uid);
        res.cookie('name', data[0].name);
        res.send(JSON.stringify({
            ret: 0,
            msg: `登录成功`,
        }));
    }).catch((err) => {
        console.log(err);
        res.send(JSON.stringify({
            ret: -500,
            msg: err.toString(),
        }));
    });
});

router.post('/logout', (req, res) => {
    const uid = req.session.uid;
    if (uid) {
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
            }
            console.log(`logout - ${uid}`);
        });
    }
    res.clearCookie('chat-sid');
    res.clearCookie('uid');
    res.clearCookie('name');
    res.send(JSON.stringify({
        ret: 0,
        msg: '退出登录',
    }));
});

module.exports = router;