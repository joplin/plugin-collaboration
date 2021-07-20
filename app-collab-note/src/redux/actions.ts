import { push } from 'connected-react-router';

import { Note, Resource } from 'utils/types';
import { bridge } from 'utils/DataApiUtils/bridge';
import { FOUND, SEARCHING } from 'utils/DataApiUtils/clipperPortStatus';
import { DispatchType, GetStateType } from './store';
import { ApiStatus, MessageType, UserConfig, Action } from './types';

export const SET_API_STATUS = 'SET_API_STATUS';
export const SET_NOTE = 'SET_NOTE';
export const CONFIG_USER = 'CONFIG_USER';
export const SET_HOST_JOINED = 'SET_HOST_JOINED';
export const RESET_STATE = 'RESET_STATE';
export const ADD_RESOURCES = 'ADD_RESOURCES';
export const SET_NOTE_CONTENT = 'SET_NOTE_CONTENT';
export const NOTE_SAVED = 'NOTE_SAVED';

function setApiStatus(apiStatus: ApiStatus | null): Action {
  return {
    type: SET_API_STATUS,
    payload: {
      apiStatus
    }
  };
}

function setUserDetails(userConfig: UserConfig): Action {
  return {
    type: CONFIG_USER,
    payload: userConfig
  };
}

function setNoteDetails(note: Note): Action {
  return {
    type: SET_NOTE,
    payload: {
      note
    }
  };
}

function setNoteContent(content: string): Action {
  return {
    type: SET_NOTE_CONTENT,
    payload: {
      content
    }
  };
}

function noteSaved(): Action {
  return {
    type: NOTE_SAVED,
  };
}

function addResources(resources: Resource[]): Action {
  return {
    type: ADD_RESOURCES,
    payload: {
      resources
    }
  };
}

function setHostJoined(hostJoined: boolean): Action {
  return {
    type: SET_HOST_JOINED,
    payload: {
      hostJoined
    }
  };
}

function resetState(): Action {
  return {
    type: RESET_STATE,
  };
}

function loadNote() {
  return async (dispatch: DispatchType, getState: GetStateType): Promise<void> => {
    const { noteId } = getState().app;
    if(noteId) {
      dispatch(setApiStatus({
        messageType: MessageType.LOADING,
        message: 'Trying to load the note...',
      }));
  
      try { 
        const note = await bridge.getNote(noteId, ['id', 'title', 'body']).catch(() => {
          throw new Error('Failed to load the note!');
        });
        dispatch(setApiStatus({
          messageType: MessageType.LOADING,
          message: 'Note loaded successfully! Fetching note resources...',
        }));
        const resources = await bridge.getNoteResourceList(noteId).catch(() => {
          throw new Error('Failed to fetch note resources!');
        });
        dispatch(setNoteDetails(note));
        dispatch(addResources(resources));
        dispatch(setApiStatus({
          messageType: MessageType.SUCCESS,
          message: 'Note fetched successfully!',
        }));
      }
      catch (err) {
        dispatch(setApiStatus({
          messageType: MessageType.ERROR,
          message: err.message,
        }));
      }
    }
    else {
      dispatch(setApiStatus({
        messageType: MessageType.ERROR,
        message: 'Cannot fetch note from Joplin',
      }));
    }
  };
}

function configureUserDetails(userConfig: UserConfig) {
  return (dispatch: DispatchType): void => {
    dispatch(setApiStatus(null));

    if (userConfig.isHost) {
      const { token, noteId } = userConfig;

      dispatch(setApiStatus({
        messageType: MessageType.LOADING,
        status: SEARCHING,
        message: 'Searching for Joplin Data API',
      }));

      bridge.init(token)
        .then(() => {
          dispatch(setApiStatus({
            messageType: MessageType.SUCCESS,
            status: FOUND,
            message: 'Found Joplin Data API',
          }));

          return bridge.getNote(noteId, ['id', 'title', 'body'])
            .catch(() => {
              throw new Error('Note not found!');
            });
        })
        .then(note => {
          dispatch(setApiStatus({
            messageType: MessageType.LOADING,
            status: FOUND,
            message: 'Found Note! Fetching note resources...',
          }));

          dispatch(setNoteDetails(note));
          dispatch(setUserDetails(userConfig));
          return bridge.getNoteResourceList(noteId);
        })
        .then((resources: Resource[]) => {
          dispatch(setApiStatus({
            messageType: MessageType.SUCCESS,
            status: FOUND,
            message: 'Successfully fetched note contents! Happy Collaboration!!',
          }));
          dispatch(addResources(resources));
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
  return (dispatch: DispatchType, getState: GetStateType): void => {
    dispatch(setHostJoined(hostJoined));

    const state = getState();
    if (!state.app.isHost) {
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

function saveNote() {
  return (dispatch: DispatchType, getState: GetStateType): void => {
    const appState = getState().app;
    dispatch(setApiStatus({
      messageType: MessageType.LOADING,
      message: 'Trying to save the note...',
    }));

    bridge.updateNoteContent(appState.note)
      .then(() => {
        dispatch(setApiStatus({
          messageType: MessageType.SUCCESS,
          message: 'Note saved successfully!',
        }));
        dispatch(noteSaved());
      })
      .catch(err => {
        dispatch(setApiStatus({
          messageType: MessageType.ERROR,
          message: err.message,
        }));
      });
  };
}

export {
  setUserDetails,
  setApiStatus,
  setNoteDetails,
  setNoteContent,
  addResources,
  resetState,
  configureUserDetails,
  handleHostStatusChange,
  setHostJoined,
  saveNote,
  loadNote,
};
