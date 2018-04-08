import io from 'socket.io-client';

import socketListener from './socketListener';

// const socket = io('http://localhost:8081');
const socket = io();
socketListener(socket);

const createSocketMiddleware = (extraArgument) => {
    return ({dispatch, getState}) => next => action => {
        if (action.type == 'socket') {
            return socket.emit(action.msgType, action.msg);
        }
        return next(action);
    }
};

export default createSocketMiddleware();