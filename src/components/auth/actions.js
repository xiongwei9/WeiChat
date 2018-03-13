import {
    LOGIN_REQUEST, LOGIN_START, LOGIN_SUCCESS, LOGIN_FAIL 
} from './actionTypes';

import { view as Modal } from '../modal/';

const loginStart = () => ({
    type: LOGIN_START,
});

const loginSuccess = (authInfo) => ({
    type: LOGIN_SUCCESS,
    uid: authInfo.uid,
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
        method: 'post',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `uid=${username}&password=${password}`,
    }).then((res) => {
        if (res.status !== 200) {
            dispatch(loginFail(res.statusText));
            return;
        }
        return res.json();
    }).then((data) => {
        if (data.ret !== 0) {
            dispatch(loginFail(data.msg));
            return;
        }
        dispatch(loginSuccess(data));
    }).catch((error) => {
        dispatch(loginFail(error));
    });
};

export { loginRequest };