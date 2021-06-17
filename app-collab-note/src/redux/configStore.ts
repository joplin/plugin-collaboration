import { createBrowserHistory } from 'history';
import { applyMiddleware, compose, createStore } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import createRootReducer from './reducer';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

export const history = createBrowserHistory();

export const initialState = {
  app: {
    isHost: false,
    hostJoined: false,
    username: null,
    apiStatus: null,
    noteId: null,
    roomId: null,
    note: null,
  }
};

export default function configureStore(preloadedState = initialState): any {
  const store = createStore(
    createRootReducer(history),
    preloadedState,
    compose(
      applyMiddleware(
        routerMiddleware(history),
        createLogger(),
        thunk,
      ),
    ),
  );

  return store;
}
