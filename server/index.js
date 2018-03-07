const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const mysql = require('./lib/mysql');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.resolve(__dirname, '../dist')));
app.use('/static', express.static('./public'));

app.post('/api/register', (req, res) => {
    const sql = `
        insert into user (name, password, descs)
        values('${req.body.name}', '${req.body.password}', '${req.body.desc}');
    `;
    mysql.query(sql, (err, data) => {
        if (err) {
            console.log(err);
            res.send(JSON.stringify({
                status: 500,
                message: err.toString(),
            }));
            return;
        }
        console.log(data);
        res.send(JSON.stringify({
            status: 200,
            message: `注册成功`,
        }));
    });
});


const server = app.listen(8081, () => {
    const host = server.address().address;
    const port = server.address().port;

    console.log(`Listening on http://${host}:${port}`);
});