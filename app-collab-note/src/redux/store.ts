
import { applyMiddleware, createStore } from 'redux';
import reducer from './reducer';
import { createLogger } from 'redux-logger';


const store = createStore(
    reducer,
    applyMiddleware(createLogger())
);

export default store;