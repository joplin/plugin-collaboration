import { createBrowserHistory } from 'history';
import { applyMiddleware, compose, createStore, Store } from 'redux';
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
    resources: [],
    isNoteSaved: true,
  }
};

export default function configureStore(preloadedState = initialState, isDevMode: boolean): Store<any, any> {

  const middleware = [
    routerMiddleware(history),
    thunk,
  ];

  if(isDevMode) {
    middleware.push(createLogger());
  }

  const store = createStore(
    createRootReducer(history),
    preloadedState,
    compose(
      applyMiddleware(...middleware),
    ),
  );

  return store;
}
