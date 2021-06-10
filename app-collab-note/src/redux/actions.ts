import { DispatchType, GetStateType } from "./store";
import { Note } from "../utils/types";
import { bridge } from "../utils/DataApiUtils/bridge";
import { FOUND, SEARCHING } from "../utils/DataApiUtils/clipperPortStatus";
import { push } from 'connected-react-router';

export const SET_API_STATUS = 'SET_API_STATUS';
export const SET_NOTE = 'SET_NOTE';
export const CONFIG_USER = 'CONFIG_USER';

export interface UserConfig { 
    username: string,
    isHost: boolean,
    noteId?: string,
    roomId: string,
    token?: string 
}

export enum MessageType {
    LOADING,
    ERROR,
    SUCCESS,
}

export interface ApiStatus {
    messageType: MessageType,
    status?: string,
    message: string,
}

export interface Action {
    type: string,
    payload: any
}

function setApiStatus(apiStatus: ApiStatus): Action {
    return {
        type: SET_API_STATUS,
        payload: {
            apiStatus
        }
    }
}

function setUserDetails(userConfig: UserConfig): Action {
    return {
        type: CONFIG_USER,
        payload: userConfig
    }
}

function setNoteDetails(note: Note) {
    return {
        type: SET_NOTE,
        payload: {
            note
        }
    }
}

const configureUserDetails = (userConfig: UserConfig) => (dispatch: DispatchType, getState: GetStateType) => {
    if(userConfig.isHost) {
        const { token, noteId } = userConfig;

        dispatch(setApiStatus({
            messageType: MessageType.LOADING,
            status: SEARCHING,
            message: 'Searching for Joplin Data API',
        }));

        bridge().init(token)
        .then(() => {
            dispatch(setApiStatus({
                messageType: MessageType.SUCCESS,
                status: FOUND,
                message: 'Found Joplin Data API',
            }));

            return bridge().getNote(noteId, ['id', 'title', 'body'])
            .catch(err => {
                throw new Error('Note not found!');
            });
        })
        .then(note => {
            dispatch(setApiStatus({
                messageType: MessageType.SUCCESS,
                status: FOUND,
                message: 'Found Note! Happy Collaboration!!',
            }));

            dispatch(setNoteDetails(note));
            dispatch(setUserDetails(userConfig));
            dispatch(push('/collab'));
        })
        .catch(err => {
            dispatch(setApiStatus({
                messageType: MessageType.SUCCESS,
                message: err.message,
            }));
        });
    }
    else {
        dispatch(setUserDetails(userConfig));
        dispatch(push('/collab'));
    }
};

export { setUserDetails as configUser, setApiStatus, setNoteDetails }