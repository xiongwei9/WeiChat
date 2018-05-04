// import createHistory from 'history/createBrowserHistory';

import * as actionTypes from './actionTypes';

// const history = createHistory();
// window.his = history;

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
            mid: 'F',  // 标记发送方，'F'为朋友方发送
        });
    });

    /* 监听-朋友列表 */
    socket.on('FRIEND_LIST', res => {
        store.dispatch({
            type: actionTypes.STORE_FRIEND_LIST,
            list: res,
        });
    });

    /* 监听-聊天历史 */
    socket.on('MESSAGE_LIST', res => {
        store.dispatch({
            type: actionTypes.STORE_MSG_LIST,
            message: res,
        });
    });

    /* 监听-文件传送成功回调 */
    socket.on('CHAT_FILE_SUCCESS', res => {
        store.dispatch({
            type: actionTypes.STORE_ADD_MSG,
            fromUid: res.uid,
            uid: res.fromUid,
            msg: res.msg,
            msgType: res.msgType,
        });
    });

    /* 监听-文件传送 */
    socket.on('CHAT_FILE', res => {
        store.dispatch({
            type: actionTypes.STORE_ADD_MSG,
            ...res,
            mid: 'F',  // 标记发送方，'F'为朋友方发送
        });
    });

    /* 监听-视频通话请求 */
    socket.on('VIDEO_REQ', res => {
        // history.push('/video/xx', {});
        store.dispatch({
            type: actionTypes.STORE_VIDEO_DUEL,
            ...res,
        });
    });

    /* 监听-视频通话回应 */
    socket.on('VIDEO_RES', res => {
        store.dispatch({
            type: actionTypes.STORE_VIDEO_DUEL,
            ...res,
        });
    });

    /* 监听-ICECANDIDATE数据 */
    socket.on('ICE_CANDIDATE', res => {
        store.dispatch({
            type: actionTypes.STORE_ICECANDIDATE,
            ...res,
        });
    });
};

export default enhancer;