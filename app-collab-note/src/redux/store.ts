import configureStore, { initialState } from './configStore';

const store = configureStore(initialState, process.env.NODE_ENV === 'development');

export type GetStateType = typeof store.getState;
export type DispatchType = typeof store.dispatch;

export default store;
