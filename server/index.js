const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const authApi = require('./routes/auth');

const app = express();

// 配置cookie解析器和session
app.use(cookieParser());
app.use(session({
    secret: 'come on! chat together',
    name: 'chat-sid',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: false,
        secure: false,
        maxAge: null,
    },
}));
app.use((req, res, next) => {
    console.log(`request: ${req.sessionID}`);
    next();
});

// 解析请求体
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// 配置静态资源路由
app.use(express.static(path.resolve(__dirname, '../dist')));
app.use('/static', express.static('./public'));

// 配置API接口路由
app.use('/api', authApi);

// 启动服务器
const server = app.listen(8081, () => {
    const host = server.address().address;
    const port = server.address().port;

    console.log(`Listening on http://${host}:${port}`);
});