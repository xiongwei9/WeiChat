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
});

const chatFile = (data) => ({
    type: actionTypes.SOCKET_CHAT_FILE,
    // fromUid,
    // uid,
    // fileData,
    ...data
});

const videoReq = (data) => ({
    type: actionTypes.SOCKET_VIDEO_REQ,
    ...data,
});

const videoRes = (data) => ({
    type: actionTypes.SOCKET_VIDEO_RES,
    ...data,
});

const videoDuel = (data) => ({
    type: actionTypes.STORE_VIDEO_DUEL,
    ...data,
});

const iceCandidateExchange = (data) => ({
    type: actionTypes.SOCKET_ICECANDIDATE,
    ...data,
});

export { socketLogin, addFriend, acceptFriend, chatMsg, chatFile, videoReq, videoRes, videoDuel, iceCandidateExchange };