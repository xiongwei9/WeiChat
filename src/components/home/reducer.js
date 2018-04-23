import {
    FRAG_MESSAGE, FRAG_CONTACT, FRAG_MINE
} from './actionTypes';

import { actionTypes as socketActionTypes } from '../../lib/socketStoreEnhancer';

const ROLE = {
    ME: 0,
    FRIEND: 1,
};
/******************** state demo ********************
const initState = {
    fragment: FRAG_MESSAGE,
    message: [{
        uid: 'liyl',
        name: '李云龙',
        list: [{
            mid: 0,
            data: '你好啊，我是李云龙！',
            time: 1,
        }, {
            mid: 1,
            data: '你好，很高兴认识你',
            time: 2,
        }],
    }],
    contact: [{
        uid: 'liyl',
        name: '李云龙',
        imgUrl: '',
        desc: '想办法干他一炮',
    }],
    // delete mine
    mine: {
        uid: 'xiongwei',
        name: 'xiongwei.zhu',
        imgUrl: '',
        desc: 'Hello, world',
    },
};
****************************************/

const initState = {
    fragment: FRAG_MESSAGE,
    message: [{
        uid: 'liyl',
        name: '李云龙',
        list: [{
            mid: 0,
            data: '你好啊，我是李云龙！',
            time: 1,
        }, {
            mid: 1,
            data: '你好，很高兴认识你',
            time: 2,
        }],
    }],
    contact: [],
    mine: {},
};

const reducer = (state = initState, action) => {
    switch (action.type) {
        case FRAG_MESSAGE: {
            return {
                ...state,
                fragment: FRAG_MESSAGE,
            };
        }
        case FRAG_CONTACT: {
            return {
                ...state,
                fragment: FRAG_CONTACT,
            };
        }
        case FRAG_MINE: {
            return {
                ...state,
                fragment: FRAG_MINE,
            };
        }
        case socketActionTypes.STORE_ADD_FRIEND: {
            return {
                ...state,
                contact: [
                    ...state.contact, 
                    {
                        uid: action.fromUid,
                        name: action.fromName,
                        imgUrl: '',
                        descs: action.fromDescs,
                    },
                ],
            };
        }
        case socketActionTypes.STORE_ADD_MSG: {
            let index = -1;
            let message = null;
            for (let i = 0; i < state.message.length; i++) {
                if (state.message[i].uid === action.fromUid) {
                    index = i;
                    break;
                }
            }
            if (index < 0) {
                let name = '';
                for (let cnt of state.contact) {
                    if (cnt.uid === action.fromUid) {
                        name = cnt.name;
                        break;
                    }
                }
                message = {
                    uid: action.fromUid,
                    name,
                    list: [],
                };
            } else {
                message = state.message.splice(index, 1)[0];
                message = { ...message };  // 改引用，否则不刷新
            }
            message.list.push({
                mid: action.mid === 'F' ? ROLE.FRIEND : ROLE.ME,
                data: action.msg,
                time: new Date().getTime(),
            });

            const newMessage = [ message, ...state.message ];
            return {
                ...state,
                message: newMessage,
            };
        }
        case socketActionTypes.STORE_FRIEND_LIST: {
            return {
                ...state,
                contact: action.list,
            };
        }
        case socketActionTypes.STORE_MSG_LIST: {
            const message = action.message;
            for (let msg of message) {
                for (let cnt of state.contact) {
                    if (msg.uid === cnt.uid) {
                        msg.name = cnt.name;
                        break;
                    }
                }
            }
            return {
                ...state,
                message,
            };
        }
        default:
            return state;
    }
};

export default reducer;