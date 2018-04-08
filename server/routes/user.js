const express = require('express');
const router = express.Router();

const mysql = require('../lib/mysql');

router.post('/searchUser', (req, res) => {
    const { uid } = req.body;
    const sql = `
        select uid, name, descs from user
        where uid like '%${uid}%';
    `;
    mysql.queryPromise(sql).then((data) => {
        return res.send({
            ret: 0,
            data,
        });
    }).catch((err) => {
        res.send({
            ret: -400,
            msg: err.toString(),
        });
    });
});

module.exports = router;