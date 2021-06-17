import configureStore, { initialState } from "./configStore";

const store = configureStore(initialState);

export type GetStateType = typeof store.getState;
export type DispatchType = typeof store.dispatch;

export default store;
