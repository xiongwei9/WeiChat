const express = require('express');
const app = express();

app.get('/api/login', function (req, res) {
  res.send(JSON.stringify({data: 'test success'}));
});

app.listen(8081);