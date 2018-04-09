import io from 'socket.io-client';

import * as actionTypes from './actionTypes';
import * as actions from './actions';

const socket = io();

const socketListener = (store) => {
    socket.on('add-friend', res => {
        console.log(res);
        store.dispatch({
            type: actionTypes.SOCKET_ADD_FRIEND,
        });
    });
};

const socketDispatch = (store) => {
    const originalDispatch = store.dispatch;
    store.dispatch = (action) => {
        switch (action.type) {
            case actionTypes.SOCKET_ADD_FRIEND:
                const { fromUid, uid, msg } = action;
                socket.emit('ADD_FRIEND', JSON.stringify({
                    fromUid,
                    uid,
                    msg,
                }));
                break;
            default:
                originalDispatch(action);
        }
        console.log(store.getState());
    };
}

const socketStoreEnhancer = (createStore) => (reducer, preloadedState, enhancer) => {
    const store = createStore(reducer, preloadedState, enhancer);
    // const originalDispatch = store.dispatch;
    socketListener(store);
    socketDispatch(store);
    return store;
};

export default socketStoreEnhancer;