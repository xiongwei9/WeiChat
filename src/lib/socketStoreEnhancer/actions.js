import * as actionTypes from './actionTypes';

export const socketLogin = (uid, name) => ({
    type: actionTypes.SOCKET_LOGIN,
    uid,
    name,
});

export const addFriend = ({fromUid, uid, msg}) => ({
    type: actionTypes.SOCKET_ADD_FRIEND,
    uid,
    fromUid,
    msg,
});

export const acceptFriend = ({fromUid, uid}) => ({
    type: actionTypes.SOCKET_ACCEPT_ADD,
    fromUid,
    uid,
});

export const chatMsg = ({fromUid, uid, msg}) => ({
    type: actionTypes.SOCKET_CHAT_MSG,
    fromUid,
    uid,
    msg,
});

export const chatFile = (data) => ({
    type: actionTypes.SOCKET_CHAT_FILE,
    // fromUid,
    // uid,
    // fileData,
    ...data
});

export const videoReq = (data) => ({
    type: actionTypes.SOCKET_VIDEO_REQ,
    ...data,
});

export const videoRes = (data) => ({
    type: actionTypes.SOCKET_VIDEO_RES,
    ...data,
});

export const videoDuel = (data) => ({
    type: actionTypes.STORE_VIDEO_DUEL,
    ...data,
});

export const iceCandidateExchange = (data) => ({
    type: actionTypes.SOCKET_ICECANDIDATE,
    ...data,
});

export const videoCall = (data) => ({
    type: actionTypes.SOCKET_VIDEO_CALL,
    ...data,
});

export const videoAccept = (data) => ({
    type: actionTypes.SOCKET_VIDEO_ACCEPT,
    ...data,
});