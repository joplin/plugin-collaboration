import { connectRouter } from 'connected-react-router';
import { combineReducers, Reducer } from 'redux';
import { History } from 'history';

import {
  ADD_RESOURCES,
  CONFIG_USER,
  RESET_STATE,
  SET_API_STATUS,
  SET_HOST_JOINED,
  SET_NOTE,
  SET_NOTE_CONTENT,
} from './actions';
import { Action, AppState, UserConfig } from './types';
import { initialState } from './configStore';

export function reducer(state = initialState.app, action: Action): AppState {

  switch (action.type) {
    case CONFIG_USER: {
      const config = action.payload as UserConfig;
      const newState = { ...state };
      if (config.isHost) {
        const { isHost, username, token, noteId } = config;
        Object.assign(newState, { isHost, username, authToken: token, noteId, roomId: noteId });
      }
      else {
        const { isHost, username, roomId } = config;
        Object.assign(newState, { isHost, username, roomId });
      }
      return newState;
    }
    case SET_NOTE: {
      const { note } = action.payload;
      if (note) {
        const newState = { ...state, note };
        return newState;
      }
      break;
    }
    case SET_NOTE_CONTENT: {
      const { content } = action.payload;
      const note = state.note || { body: content };
      Object.assign(note, { body: content });
      return { ...state, note };
    }
    case SET_API_STATUS: {
      const { apiStatus } = action.payload;
      const newState = { ...state, apiStatus };
      return newState;
    }
    case SET_HOST_JOINED: {
      const { hostJoined } = action.payload;
      const newState = { ...state, hostJoined };
      return newState;
    }
    case RESET_STATE: {
      return { ...initialState.app };
    }
    case ADD_RESOURCES: {
      const { resources } = action.payload;
      return { ...state, resources };
    }
  }

  return state;
}

const createRootReducer = (history: History): Reducer<any> => combineReducers({
  router: connectRouter(history),
  app: reducer,
});

export default createRootReducer;
