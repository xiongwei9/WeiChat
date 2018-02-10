import {
    LOGIN_REQUEST, LOGIN_START, LOGIN_SUCCESS, LOGIN_FAIL 
} from './actionTypes';

import { view as Modal } from '../modal/';

const loginStart = () => ({
    type: LOGIN_START,
});

const loginSuccess = (authInfo) => ({
    type: LOGIN_SUCCESS,
    id: authInfo.id,
    name: authInfo.name,
});

const loginFail = (message) => {
    Modal.Toast.info(`登录失败（${message}）`);
    return {
        type: LOGIN_FAIL,
    };
};

const loginRequest = (username, password) => (dispatch) => {
    dispatch(loginStart());

    fetch('/api/login', {
        method: 'get'
    }).then((res) => {
        if (res.status !== 200) {
            dispatch(loginFail(res.statusText));
            return;
        }
        res.json().then((data) => {
            if (data.status !== 200) {
                dispatch(loginFail(data.message));
                return;
            }
            dispatch(loginSuccess(data));
        });
    }).catch((error) => {
        Modal.Toast.info(`登录失败（${error}）`);
    });
};

export { loginRequest };