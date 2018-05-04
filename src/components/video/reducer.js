import { actionTypes as socketActionTypes } from '../../lib/socketStoreEnhancer/';

import { actions as socketActions } from '../../lib/socketStoreEnhancer/';

const initState = {
    icecandidate: [],
};

const reducer = (state = initState, action) => {
    switch (action.type) {
        case socketActionTypes.STORE_VIDEO_DUEL: {
            // let { fromUid, uid } = action;
            // if (!('offer' in action || 'answer' in action)) {
            //     fromUid = action.uid;
            //     uid = action.fromUid;
            // }
            const { fromUid, uid } = action;
            const objName = 'offer' in action ? 'offer' : 'answer';

            return {
                ...state,
                fromUid,
                uid,
                [objName]: action[objName],
            };
        }
        case socketActionTypes.STORE_ICECANDIDATE: {
            const { fromUid, uid, data } = action;
            return {
                ...state,
                icecandidate: [
                    ...(state.icecandidate),
                    data,
                ],
            };
        }
        default: {
            return state;
        }
    }
};

export default reducer;