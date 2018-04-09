import {
    SOCKET_ADD_FRIEND, SOCKET_ACCEPT_ADD,
} from './actionTypes';

const addFriend = ({fromUid, uid, msg}) => ({
    type: SOCKET_ADD_FRIEND,
    uid,
    fromUid,
    msg,
});

export { addFriend };