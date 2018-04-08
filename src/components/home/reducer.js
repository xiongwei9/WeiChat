import {
    FRAG_MESSAGE, FRAG_CONTACT, FRAG_MINE
} from './actionTypes';

// const initState = {
//     fragment: FRAG_MESSAGE,
//     message: [{
//         uid: 'liyl',
//         name: '李云龙',
//         list: [{
//             mid: 0,
//             data: '你好啊，我是李云龙！',
//             time: 1,
//         }, {
//             mid: 1,
//             data: '你好，很高兴认识你',
//             time: 2,
//         }],
//     }, {
//         uid: 'eryz',
//         name: '二营长',
//         list: [{
//             mid: 1,
//             data: '报告二营长',
//             time: 3,
//         }, {
//             mid: 0,
//             data: '说',
//             time: 4,
//         }, {
//             mid: 0,
//             data: '有没有办法干他一炮',
//             time: 5,
//         }],
//     }],
//     contact: [{
//         uid: 'liyl',
//         name: '李云龙',
//         imgUrl: '',
//         desc: '想办法干他一炮',
//     }, {
//         uid: 'eryz',
//         name: '二营长',
//         imgUrl: '',
//         desc: '哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈',
//     }, {
//         uid: 'SuperBaby',
//         name: '超尼玛币',
//         imgUrl: '',
//         desc: '我是谁？我在哪里？我要干尼玛？'
//     }],
//     mine: {
//         uid: 'xiongwei',
//         name: 'xiongwei.zhu',
//         imgUrl: '',
//         desc: 'Hello, world',
//     },
// };

const initState = {
    fragment: FRAG_MESSAGE,
    message: [],
    contact: [],
    mine: {},
};

const reducer = (state = initState, action) => {
    switch (action.type) {
        case FRAG_MESSAGE:
            return {
                ...state,
                fragment: FRAG_MESSAGE,
            };
        case FRAG_CONTACT:
            return {
                ...state,
                fragment: FRAG_CONTACT,
            };
        case FRAG_MINE:
            return {
                ...state,
                fragment: FRAG_MINE,
            };
        default:
            return state;
    }
};

export default reducer;