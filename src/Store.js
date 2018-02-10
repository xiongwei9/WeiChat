import { createStore, combineReducers, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';

import { reducer as authReducer } from './components/auth/';

const initState = {};
const reducer = combineReducers({
    auth: authReducer,
});

const middlewares = [ReduxThunk];

export default createStore(reducer, initState, applyMiddleware(...middlewares));