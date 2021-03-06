import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import ReduxThunk from 'redux-thunk';

import { socketStoreEnhancer } from './lib/socketStoreEnhancer/';

import { reducer as authReducer } from './components/auth/';
import { reducer as homeReducer } from './components/home/';
import { reducer as videoReducer } from './components/video/';

const initState = {};
const reducer = combineReducers({
    auth: authReducer,
    home: homeReducer,
    video: videoReducer,
});

const middlewares = [
    ReduxThunk,
];

const storeEnhancers = compose(
    applyMiddleware(...middlewares),
    socketStoreEnhancer,
);

export default createStore(reducer, initState, storeEnhancers);