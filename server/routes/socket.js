const sharedSession = require('express-socket.io-session');

const mysql = require('../lib/mysql');

const findSocket = (socketList, id) => {
    for (let item of socketList) {
        if (item.handshake.session.auth.uid === id) {
            return item;
        }
    }
    return null;
}

const socketApi = (io, session) => {
    let socketList = [];

    io.use(sharedSession(session, {
        autoSave: true,
    }));
    /* 建立WebSocket连接 */
    io.on('connection', socket => {

        /* 登录认证，同步session与WebSocket */
        socket.on('LOGIN', (auth) => {
            socketList.push(socket);
            socket.handshake.session.auth = auth;
            socket.handshake.session.save();
            console.log(`LOGIN: ${JSON.stringify(auth)}`);
        });
        socket.on('LOGOUT', (auth) => {
            if (socket.handshake.session.auth) {
                console.log(JSON.stringify(socket.handshake.session));
            }
        });

        /* 添加好友请求 */
        socket.on('ADD_FRIEND', (data) => {
            const { fromUid, uid } = data;
            const socketTarget = findSocket(socketList, uid);
            if (!socketTarget) {
                /* 要添加的用户不在线 */
                return;
            }
            mysql.queryPromise(`select * from friend where uid='${fromUid}' and friend_id='${uid}'`)
            .then((res) => {
                if (res) {  
                    /* 已添加好友 */
                    throw `${fromUid} & ${uid} are already friends...`;
                }
                return mysql.queryPromise(`select name, descs from user where uid = '${fromUid}'`);
            })
            .then((res) => {
                const fromName = res.name;
                const fromDescs = res.descs;
                socketTarget.emit('ADD_FRIEND', {
                    fromUid,
                    fromName,
                    fromDescs,
                    uid,
                });
                console.log(`ADD_FRIEND: ${socket.handshake.session.auth.uid} req ${uid}`);
            })
            .catch(e => {
                console.log('ADD_FRIEND ERROR');
                console.log(e);
            });
        });

        /* 接受好友添加的请求 */
        socket.on('ACCEPT_FRIEND', (data) => {
            const { fromUid, uid } = data;
            const sql = `
                insert into friend(uid, friend_uid)
                values
                  ('${uid}', '${fromUid}'),
                  ('${fromUid}', '${uid}');
            `;
            const socketTarget = findSocket(socketList, fromUid);
            
            mysql.queryPromise(sql)
            .then((res) => {
                return mysql.queryPromise(`select name, descs from user where uid = '${uid}'`);
            })
            .then((res) => {
                socketTarget.emit('ACCEPT_FRIEND', {
                    uid,
                    name: res.name,
                    descs: res.descs,
                    fromUid,
                });
                console.log('ACCEPT_FRIEND: ok');
            })
            .catch((e) => {
                console.log('ADD_FRIEND ERROR');
                console.log(e);
            });
        });

        /* 发送聊天消息 */
        socket.on('CHAT_MSG', (data) => {
            // const { fromUid, uid, msg } = data;
            const socketTarget = findSocket(socketList, uid);
            socketTarget.emit('CHAT_MSG', {
                ...data,
            });
            
            const sql = `
                insert into chat_msg (from_uid, uid, msg, sendTime)
                values('${data.fromUid}', '${data.uid}', '${data.msg}', ${new Date().getTime()});
            `;
            mysql.queryPromise(sql)
            .then((res) => {
                console.log(`CHAT_MSG: ${data.fromUid} -> ${data.uid}: ${data.msg}`);
            })
            .catch((err) => {
                console.log(`CHAT_MSG: ERROR`);
                console.log(err);
            });
        });

        /* 断开WebSocket连接 */
        socket.on('disconnect', (reason) => {
            const index = socketList.indexOf(socket);
            if (index < 0) {
                return;
            }
            socketList.splice(index, 1);
            console.log(`DISCONNECT: ${socket.handshake.session.auth.uid} - ${reason}`);
        });
    });
};

module.exports = socketApi;