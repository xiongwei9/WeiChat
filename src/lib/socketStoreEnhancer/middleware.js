import * as actionTypes from './actionTypes';
import * as actions from './actions';

const middleware = (store, socket) => {
    const originalDispatch = store.dispatch;
    store.dispatch = (action) => {
        switch (action.type) {
            case actionTypes.SOCKET_ADD_FRIEND:
                /* 发出添加请求 */
                // let { fromUid, uid, msg } = action;
                socket.emit('ADD_FRIEND', {
                    fromUid: action.fromUid,
                    uid: action.uid,
                    msg: action.msg,
                });
                break;
            case actionTypes.SOCKET_ACCEPT_ADD:
                /* 发出接收添加的消息 */
                socket.emit('ACCEPT_FRIEND', {
                    fromUid: action.fromUid,
                    uid: action.uid,
                });
                store.dispatch({
                    type: actionTypes.STORE_ADD_FRIEND,
                    fromUid: action.fromUid,
                    fromName: action.fromName,
                    fromDescs: action.fromDescs,
                    uid: action.uid,
                });
                break;
            case actionTypes.SOCKET_LOGIN:
                /* 登录成功，立即在WebSocket注册session */
                // let { uid, name } = action;
                socket.emit('LOGIN', {
                    uid: action.uid,
                    name: action.name,
                });
                break;
            default:
                originalDispatch(action);
        }
        console.log(`SEND: ${action.type.toString()}`);
        console.log(store.getState());
    };
};

export default middleware;