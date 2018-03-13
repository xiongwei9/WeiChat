import { createStore, combineReducers, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';

import { reducer as authReducer } from './components/auth/';
import { reducer as homeReducer } from './components/home/';

const initState = {};
const reducer = combineReducers({
    auth: authReducer,
    home: homeReducer,
});

const middlewares = [ReduxThunk];

export default createStore(reducer, initState, applyMiddleware(...middlewares));