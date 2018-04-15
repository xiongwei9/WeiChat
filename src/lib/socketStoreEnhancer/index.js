import io from 'socket.io-client';

import enhancer from './enhancer';
import middleware from './middleware';
import * as actionTypes from './actionTypes';
import * as actions from './actions';

const socketStoreEnhancer = (createStore) => (reducer, preloadedState, enhancers) => {
    const store = createStore(reducer, preloadedState, enhancers);
    const socket = io();
    enhancer(store, socket);
    middleware(store, socket);
    return store;
};

export { socketStoreEnhancer, actions, actionTypes };