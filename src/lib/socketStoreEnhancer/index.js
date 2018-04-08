import io from 'socket.io-client';

const socketListener = (store) => {
    const socket = io();
    socket.on('add-friend', res => {
        console.log(res);
        store.dispatch({
            type: 'ADD-FRIENT',
        });
    });
};

const socketStoreEnhancer = (createStore) => (reducer, preloadedState, enhancer) => {
    const store = createStore(reducer, preloadedState, enhancer);
    // socketListener(store);
    return store;
};

export default socketStoreEnhancer;