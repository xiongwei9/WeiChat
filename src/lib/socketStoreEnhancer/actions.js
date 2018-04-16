import * as actionTypes from './actionTypes';

const socketLogin = (uid, name) => ({
    type: actionTypes.SOCKET_LOGIN,
    uid,
    name,
});

const addFriend = ({fromUid, uid, msg}) => ({
    type: actionTypes.SOCKET_ADD_FRIEND,
    uid,
    fromUid,
    msg,
});

const acceptFriend = ({fromUid, uid}) => ({
    type: actionTypes.SOCKET_ACCEPT_ADD,
    fromUid,
    uid,
});

const chatMsg = ({fromUid, uid, msg}) => ({
    type: actionTypes.SOCKET_CHAT_MSG,
    fromUid,
    uid,
    msg,
})

export { socketLogin, addFriend, acceptFriend, chatMsg };