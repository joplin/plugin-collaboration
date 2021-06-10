import { connectRouter } from "connected-react-router";
import { combineReducers } from "redux";
import { Action, CONFIG_USER, SET_API_STATUS, SET_NOTE, UserConfig } from "./actions";
import { History } from 'history';

function reducer(state: any, action: Action) {
    switch(action.type) {
        case CONFIG_USER:{
            const config = action.payload as UserConfig;
            const newState = { ...state}
            if(config.isHost) {
                const { isHost, username, token, noteId } = config;
                Object.assign(newState, { isHost, username, authToken: token, noteId, roomId: noteId });
            }
            else {
                const { isHost, username, roomId } = config;
                Object.assign(newState, { isHost, username, roomId })
            }
            return newState;
        }
        case SET_NOTE:
            const { note } = action.payload;
            if(!!note) {
                const newState = { ...state, note };
                return newState;
            }
            break;
        case SET_API_STATUS:{
            const { apiStatus } = action.payload;
            const newState = { ...state, apiStatus};
            return newState;
        }
    }

    return state;
}

const createRootReducer = (history: History) => combineReducers({
    router: connectRouter(history),
    reducer,   
});

export default createRootReducer;