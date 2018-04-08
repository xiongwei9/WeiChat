const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const authApi = require('./routes/auth');
const userApi = require('./routes/user');
const socketApi = require('./routes/socket');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// 解析请求体
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// 配置静态资源路由
app.use(express.static(path.resolve(__dirname, '../dist')));
app.use('/static', express.static('./static'));

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
    console.log(`session: ${req.sessionID} | socketID: ${req.cookies.io}`);
    next();
});

// 配置API接口路由
app.use('/api', authApi);
app.use('/api', userApi);

// socket.io监听
socketApi(io);

// 启动服务器
const server = http.listen(8081, () => {
    const host = server.address().address;
    const port = server.address().port;

    console.log(`Listening on http://${host}:${port}`);
});