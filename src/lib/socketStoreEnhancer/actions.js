import {
    SOCKET_LOGIN,  SOCKET_LOGOUT, SOCKET_ADD_FRIEND, SOCKET_ACCEPT_ADD,
} from './actionTypes';

const socketLogin = (uid, name) => ({
    type: SOCKET_LOGIN,
    uid,
    name,
});

const addFriend = ({fromUid, uid, msg}) => ({
    type: SOCKET_ADD_FRIEND,
    uid,
    fromUid,
    msg,
});

const acceptFriend = ({fromUid, uid}) => ({
    type: SOCKET_ACCEPT_ADD,
    fromUid,
    uid,
});

export { socketLogin, addFriend, acceptFriend };