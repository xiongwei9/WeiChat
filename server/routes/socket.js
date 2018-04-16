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

            // 发送好友列表
            const friendSql = `
                select friend_uid as uid, name, descs
                from user, friend
                where friend.uid='${auth.uid}' and friend.friend_uid=user.uid;
            `;
            // console.log(friendSql);
            mysql.queryPromise(friendSql)
            .then((res) => {
                if (!res) {
                    res = [];
                }
                socket.emit('FRIEND_LIST', res);
            })
            .catch((err) => {
                console.log(`SELECT friend list ERROR`);
                console.log(err);
            });
            // 发送聊天列表
            const msgSql = `
                select from_uid as uid, msg as data, sendTime as time
                from chat_msg
                where uid='${auth.uid}';
            `;
            mysql.queryPromise(msgSql)
            .then((res) => {
                socket.emit('MSG_LIST', res);
            })
            .catch((err) => {
                console.log(`SELECT chat_msg list ERROR`);
                console.log(err);
            });

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
                console.log(res);
                const fromName = res[0].name;
                const fromDescs = res[0].descs;
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
                    name: res[0].name,
                    descs: res[0].descs,
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
            const { fromUid, uid, msg } = data;
            const socketTarget = findSocket(socketList, uid);
            socketTarget.emit('CHAT_MSG', {
                ...data,
            });
            
            const sql = `
                insert into chat_msg (from_uid, uid, msg, sendTime)
                values('${fromUid}', '${uid}', '${msg}', ${new Date().getTime()});
            `;
            mysql.queryPromise(sql)
            .then((res) => {
                console.log(`CHAT_MSG: ${fromUid} -> ${uid}: ${msg}`);
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