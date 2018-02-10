const path = require('path');
const express = require('express');
const app = express();

app.get('/api/login', function (req, res) {
    res.send(JSON.stringify({status: 200, message: 'password wrong!'}));
});

app.use('/', express.static(path.resolve(__dirname, '../dist')));

const server = app.listen(8081, () => {
    const host = server.address().address;
    const port = server.address().port;

    console.log(`Listening on http://${host}:${port}`);
});