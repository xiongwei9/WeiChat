const sharedSession = require('express-socket.io-session');
const fs = require('fs');
const path = require('path');

const mysql = require('../lib/mysql');

const getMsgHistory = (socket, uid) => {
    const sql = `
        select from_uid as fromUid, uid
        from chat_msg
        group by from_uid, uid
        having from_uid='${uid}' or uid='${uid}';
    `;
    mysql.queryPromise(sql)
    .then((res) => {
        const set = new Set(res.map(v => v.uid === uid ? v.fromUid : v.uid));
        const arr = [];
        for (let id of set) {
            arr.push(mysql.queryPromise(`
                select from_uid as fromUid, uid, msg, msgType, sendTime as time
                from chat_msg
                where (from_uid='${id}' and uid='${uid}') or (uid='${id}' and from_uid='${uid}')
                order by sendTime desc
                limit 10;
            `));
        }
        return Promise.all(arr);
    })
    .then((res) => {
        const message = [];
        for (let perFriend of res) {
            let messageItem = {
                uid: perFriend[0].uid === uid ? perFriend[0].fromUid : perFriend[0].uid,
                name: '',
                list: [],
            };
            for (let i = perFriend.length - 1; i >= 0; i--) {
                messageItem.list.push({
                    mid: perFriend[i].fromUid === uid ? 0 : 1,
                    data: perFriend[i].msg,
                    type: perFriend[i].msgType,
                    time: perFriend[i].time * 1000,
                });
            }
            message.push(messageItem);
        }
        socket.emit('MESSAGE_LIST', message);
    })
    .catch((err) => {
        console.log('SELECT CHAT_MSG ERROR');
        console.log(err);
    });
};

const socketApi = (io, session) => {
    let socketMap = new Map();

    io.use(sharedSession(session, {
        autoSave: true,
    }));
    /* 建立WebSocket连接 */
    io.on('connection', socket => {

        /* 登录认证，同步session与WebSocket */
        socket.on('LOGIN', (auth) => {
            socketMap.set(auth.uid, socket);
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
            getMsgHistory(socket, auth.uid);

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
            const socketTarget = socketMap.get(uid);
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
            const socketTarget = socketMap.get(fromUid);

            if (!socketTarget) {
                /* 目标用户不在线 */
                return;
            }
            
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
            const socketTarget = socketMap.get(uid);

            if (socketTarget) {
                /* 目标用户在线 */
                socketTarget.emit('CHAT_MSG', {
                    ...data,
                });
            }
            
            const sql = `
                insert into chat_msg (from_uid, uid, msg, sendTime)
                values('${fromUid}', '${uid}', '${msg}', ${parseInt(new Date().getTime() / 1000)});
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

        /* 发送文件／图片 */
        socket.on('CHAT_FILE', (data) => {
            const { fromUid, uid, fileData, fileName, fileType } = data;
            const socketTarget = socketMap.get(uid);

            if (socketTarget) {
                socketTarget.emit('CHAT_FILE', {
                    ...data,
                });
            }

            const fileRealData = fileData.replace(new RegExp(`^data:${fileType};base64,`), '');
            const filePath = path.resolve(__dirname, './temp', `${fileName}`);
            const buf = Buffer.from(fileRealData, 'base64');
            fs.writeFile(filePath, buf, (err) => {
                if (err) {
                    console.log(`write file ${filePath} err`);
                    console.log(err);
                    return;
                }
                console.log(`write to ${filePath} success`);
            });
        });

        /* 断开WebSocket连接 */
        socket.on('disconnect', (reason) => {
            const auth = socket.handshake.session.auth
            if (auth && auth.uid) {
                socketMap.delete(auth.uid);
                console.log(`DISCONNECT: ${auth.uid} - ${reason}`);
            }
        });
    });
};

module.exports = socketApi;