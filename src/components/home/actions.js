import {
    FRAG_MESSAGE, FRAG_CONTACT, FRAG_MINE
} from './actionTypes';

// const fragMessage = () => ({
//     type: FRAG_MESSAGE,
// });

// const fragContact = () => ({
//     type: FRAG_CONTACT,
// });

// const fragMine = () => ({
//     type: FRAG_MINE,
// });
const fragChange = (type) => ({
    type,
});

export { fragChange };