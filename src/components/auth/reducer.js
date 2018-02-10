import {
    LOGIN_START, LOGIN_SUCCESS, LOGIN_FAIL
} from './actionTypes';

const initState = {
    logined: false,
    id: '',
    name: '',
};

const reducer = (state = initState, action) => {
    switch (action.type) {
        case LOGIN_START:
            return {
                ...state,
                logined: false,
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                logined: true,
                id: action.id,
                name: action.name,
            };
        case LOGIN_FAIL:
            return {
                ...state,
                logined: false,
            };
        default:
            return state;
    }
};

export default reducer;