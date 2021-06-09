import { Note } from "../utils/types";

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

export interface Action {
    type: string,
    payload: any
}

function setApiStatus(status: string): Action {
    return {
        type: SET_API_STATUS,
        payload: {
            apiStatus: status
        }
    }
}

function configUser(config: UserConfig): Action {
    return {
        type: CONFIG_USER,
        payload: config
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

export { configUser, setApiStatus, setNoteDetails }