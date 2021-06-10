import { createBrowserHistory } from 'history';
import { applyMiddleware, compose, createStore } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import createRootReducer from './reducer';
import { createLogger } from 'redux-logger';

export const history = createBrowserHistory();

export default function configureStore(preloadedState: any) {
  const store = createStore(
    createRootReducer(history), // root reducer with router state
    preloadedState,
    compose(
      applyMiddleware(
        routerMiddleware(history),
        createLogger(),
      ),
    ),
  );

  return store;
}