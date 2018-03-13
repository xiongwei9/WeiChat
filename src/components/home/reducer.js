import {
    FRAG_MESSAGE, FRAG_CONTACT, FRAG_MINE
} from './actionTypes';

const initState = {
    fragment: FRAG_MESSAGE,
    message: [],
    contact: [],
    mine: {},
};

const reducer = (state = initState, action) => {
    switch (action.type) {
        case FRAG_MESSAGE:
            return {
                ...state,
                fragment: FRAG_MESSAGE,
            };
        case FRAG_CONTACT:
            return {
                ...state,
                fragment: FRAG_CONTACT,
            };
        case FRAG_MINE:
            return {
                ...state,
                fragment: FRAG_MINE,
            };
        default:
            return state;
    }
};

export default reducer;