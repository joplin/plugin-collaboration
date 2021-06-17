import { Note } from "../utils/types";
import { bridge } from "../utils/DataApiUtils/bridge";
import { FOUND, SEARCHING } from "../utils/DataApiUtils/clipperPortStatus";
import { push } from 'connected-react-router';

export const SET_API_STATUS = 'SET_API_STATUS';
export const SET_NOTE = 'SET_NOTE';
export const CONFIG_USER = 'CONFIG_USER';
export const SET_HOST_JOINED = 'SET_HOST_JOINED';
export const RESET_STATE = 'RESET_STATE';

export interface UserConfig {
  username: string,
  isHost: boolean,
  noteId?: string,
  roomId: string,
  token?: string
}

export enum MessageType {
  LOADING = 'LOADING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
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

function setApiStatus(apiStatus: ApiStatus | null): Action {
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

function setNoteDetails(note: Note): Action {
  return {
    type: SET_NOTE,
    payload: {
      note
    }
  }
}

function setHostJoined(hostJoined: boolean): Action {
  return {
    type: SET_HOST_JOINED,
    payload: {
      hostJoined
    }
  }
}

function resetState() {
  return {
    type: RESET_STATE,
    payload: null
  }
}

function configureUserDetails(userConfig: UserConfig) {
  return (dispatch: any) => {
    dispatch(setApiStatus(null));

    if (userConfig.isHost) {
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
            messageType: MessageType.ERROR,
            message: err.message,
          }));
        });
    }
    else {
      dispatch(setUserDetails(userConfig));
      dispatch(push('/collab'));
    }
  };
}

function handleHostStatusChange(hostJoined: boolean) {
  return (dispatch: any, getState: any) => {
    dispatch(setHostJoined(hostJoined));

    const state = getState();
    if (!state.isHost) {
      if (hostJoined) {
        dispatch(setApiStatus({
          messageType: MessageType.SUCCESS,
          message: 'Host online!',
        }));
      }
      else {
        dispatch(setApiStatus({
          messageType: MessageType.LOADING,
          message: 'Host offline, Waiting for the host...',
        }));
      }
    }
  };
}

export { setUserDetails, setApiStatus, setNoteDetails, resetState, configureUserDetails, handleHostStatusChange }
