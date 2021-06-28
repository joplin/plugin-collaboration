import { addResources, setApiStatus, setNoteContent, setNoteDetails, setUserDetails, setHostJoined, resetState } from './actions';
import { MessageType } from './types';
import store from './store';
import { initialState } from './configStore';

describe('reducer', function() {
  // const { bridge } = require('utils/DataApiUtils/bridge');

  // jest.mock('utils/DataApiUtils/bridge');

  const testUser = {
    isHost: true,
    roomId: 'dummy-note-id',
    username: 'test-user',
    noteId: 'dummy-note-id',
    token: 'dummy-token',
  }
  
  const testNote = {
    id: 'dummy-note-id',
    title: 'dummy title',
    body: '# some random md text',
  };

  const testResources = [
    {
      id: 'dummy-resource-id-1',
      title: 'dummy-resource-1',
      dataURI: '//:0'
    },
    {
      id: 'dummy-resource-id-2',
      title: 'dummy-resource-2',
      dataURI: '//:0'
    },
  ];

  it('should configure a user', () => {

    store.dispatch(setUserDetails(testUser));
    const appState = store.getState().app;

    expect(appState.username).toBe(testUser.username);
    expect(appState.authToken).toBe(testUser.token);
    expect(appState.isHost).toBe(testUser.isHost);
    expect(appState.roomId).toBe(testUser.roomId);
    expect(appState.noteId).toBe(testUser.noteId);
  });

  it('should configure note details', () => {
    store.dispatch(setNoteDetails(testNote));
    const appState = store.getState().app;

    expect(appState.note).toBe(testNote);
  });

  it('should change note content', () => {
    const newContent = '# changed content';
    store.dispatch(setNoteContent(newContent));
    const appState = store.getState().app;

    expect(appState.note.body).toEqual(newContent);
  });

  it('should add resource list', () => {
    store.dispatch(addResources(testResources));
    const appState = store.getState().app;

    expect(appState.resources).toBe(testResources);
  });

  it('should set api status', () => {
    let apiStatus = { messageType: MessageType.LOADING, message: 'some random message' };
    store.dispatch(setApiStatus(apiStatus));
    let appState = store.getState().app;
    expect(appState.apiStatus).toBe(apiStatus);

    apiStatus = {messageType: MessageType.SUCCESS, message: 'some other random message'};
    store.dispatch(setApiStatus(apiStatus));
    appState = store.getState().app;
    expect(appState.apiStatus).toBe(apiStatus);
  });

  it('should set host joined', () => {
    store.dispatch(setHostJoined(true));
    let appState = store.getState().app;
    expect(appState.hostJoined).toBe(true);
    
    store.dispatch(setHostJoined(false));
    appState = store.getState().app;
    expect(appState.hostJoined).toBe(false);
  });

  it('should reset app state', () => {
    store.dispatch(resetState());
    const appState = store.getState().app;
    expect(appState).toStrictEqual(initialState.app);
  });
});
