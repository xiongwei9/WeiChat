import * as actionTypes from './actionTypes';

const enhancer = (store, socket) => {
    /* 监听-被添加 */
    socket.on('ADD_FRIEND', res => {
        const { fromUid, fromName, fromDescs, uid } = res;
        store.dispatch({
            type: actionTypes.SOCKET_ACCEPT_ADD,
            fromUid,
            fromName,
            fromDescs,
            uid,
        });
    });

    /* 监听-被接收添加事件 */
    socket.on('ACCEPT_FRIEND', res => {
        const { uid, name, descs, fromUid } = res;
        store.dispatch({
            type: actionTypes.STORE_ADD_FRIEND,
            fromUid: uid,
            fromName: name,
            fromDescs: descs,
        });
    });

    /* 监听-文本聊天消息 */
    socket.on('CHAT_MSG', res => {
        const { fromUid, uid, msg } = res;
        store.dispatch({
            type: actionTypes.STORE_ADD_MSG,
            ...res,
        });
    });
};

export default enhancer;