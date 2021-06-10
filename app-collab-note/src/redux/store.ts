import configureStore from "./configStore";

const initialState = {
    isHost: false,
    username: null,
    apiStatus: null,
    noteId: null,
    roomId: null,
    note: null,
}

const store = configureStore(initialState);

export type GetStateType = typeof store.getState;
export type DispatchType = typeof store.dispatch;

export default store;