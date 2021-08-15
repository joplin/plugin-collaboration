import { Resource } from 'utils/types';
import { CodemirrorBinding } from 'y-codemirror';
import { WebrtcProvider } from 'y-webrtc';
import * as Y from 'yjs';
import SessionEvents from './sessionEvents';

enum roles{
  HOST='HOST',
  PEER='PEER',
}

interface AwarenessEventArgs {
  added: any[],
  updated: any[],
  removed: any[],
}

type callbackType = (...args: any[]) => void;

class YUtils {
  observers_ = new Map<SessionEvents, callbackType[]>();
  isInitialized: boolean;
  yDoc: Y.Doc | undefined;
  yUndoManager: Y.UndoManager | undefined;
  isHost: boolean | undefined;
  username: string | undefined;
  provider: WebrtcProvider | undefined;
  binding: CodemirrorBinding | undefined;
  hostClientId = () => { return null; };

  constructor() {
    this.isInitialized = false;
  }

  /**
   * This function is called when the webrtc session needs to be started/initialized
   * @param id
   * A unique id for the room
   * @param isHost
   * Boolean value to determine if host of the note has joined
   * @param username
   * Name for the current user which will be used in awareness of Yjs.
      * @returns void
   */
  init(id: string, isHost: boolean, username: string) {
    if (this.isInitialized) this.destroy();

    this.isInitialized = true;
    this.yDoc = new Y.Doc();
    if (this.yNoteBody) {
      this.yUndoManager = new Y.UndoManager(this.yNoteBody);
    }

    this.isHost = isHost;
    this.username = username;

    /**
     * @todo
     * Need to pass singaling sever URL to the WebrtcProvider Constructor
     * By default it uses the dev signaling servers of Yjs
     */
    this.provider = new WebrtcProvider(id, this.yDoc);
    const { awareness } = this.provider;
    if(isHost) {
      awareness.setLocalStateField('role', roles.HOST);
    }
    else {
      // If the current user is not the Host, events related to Host are emitted;
      awareness.setLocalStateField('role', roles.PEER);
      awareness.on('update', ({added, updated, removed}: AwarenessEventArgs, origin: string) => {

        if(origin === 'local') return;
        
        added?.forEach((clientId: any) => {
          const state = awareness.states.get(clientId);
          if (state?.role === roles.HOST) {
            this.emit(SessionEvents.HostJoined);
            this.hostClientId = () => { return clientId; };
          }
        });

        updated.forEach((clientId: any) => {
          const state = awareness.states.get(clientId);
          if (state?.role === roles.HOST) {
            this.emit(SessionEvents.HostJoined);
            this.hostClientId = () => { return clientId; };
          }
        });

        removed?.forEach((clientId: any) => {
          if (this.hostClientId() === clientId) {
            this.emit(SessionEvents.HostLeft);
            this.yUndoManager?.clear();
          }
        });

      });
    }

    this.resources?.observe((event, transaction) => {
      if(!transaction.local) {
        const resources = Array.from(this.resources?.values() || []);
        this.emit(SessionEvents.ResourcesChanged, [resources]);
      }
    });
  }

  get yNoteBody() {
    return this.yDoc?.getText('note-body');
  }

  get yNoteTitle() {
    return this.yDoc?.getText('note-title');
  }

  get props() {
    return this.yDoc?.getMap('session-props');
  }

  get resources(): Y.Map<Resource> | undefined {
    return this.yDoc?.getMap('resourceBlobMap');
  }

  on(event: SessionEvents, callback: callbackType) {
    const observers = this.observers_.get(event) || [];
    observers.push(callback);
    this.observers_.set(event, observers);
  }

  off(event: SessionEvents, callback: callbackType) {
    let observers = this.observers_.get(event);
    if(observers !== undefined) {
      observers = observers.filter((cb) => cb !== callback);
      if(observers.length > 0) {
        this.observers_.set(event, observers);
      }
      else {
        this.observers_.delete(event);
      }
    }
  }

  emit(event: SessionEvents, args: any = []) {
    let callbacks = this.observers_.get(event) || [];
    callbacks = [...callbacks];

    callbacks.forEach((callback: callbackType) => {
      callback(...args);
    });
  }

  didHostJoin() {
    if(!this.provider) return false;
    const { states } = this.provider.awareness;

    for(const clientState of states.values()) {
      if(clientState['role'] === roles.HOST) {
        return true;
      }
    }

    return false;
  }

  /**
   * @todo
   * Need to find some other way to sync resource files.
   * Until then commenting below code disables the resource sync without effecting rest of the collaboration.
   */
  // eslint-disable-next-line
  updateResources(resources: Resource[]) {
    // if(this.resources) {
    //   for(const i in resources) {
    //     if(this.resources.has(resources[i].id))
    //       continue;
    //     this.resources.set(resources[i].id, resources[i]);
    //   }
    //   console.log(this.resources);
    // }
  }

  setEditor(editor: CodeMirror.Editor) {
    if (!this.isInitialized || !this.yNoteBody || !this.provider) return;
    this.binding = new CodemirrorBinding(this.yNoteBody, editor, this.provider.awareness, { yUndoManager: this.yUndoManager });
    
    if(this.username)
      this.setUsername(this.username);
  }

  bindNoteTitle(textArea: HTMLInputElement) {
    if (!this.isInitialized || !this.yNoteTitle || !this.provider) return;

    const updateNoteTitle = () => {
      if(this.yNoteTitle?.length !== 0) {
        this.yNoteTitle?.delete(0, this.yNoteTitle.length);
      }
      this.yNoteTitle?.insert(0, textArea.value);
    };

    if(this.isHost && textArea.value) {
      updateNoteTitle();
    }
    else if(!textArea.value) {
      textArea.value = this.yNoteTitle.toString();
    }
    
    this.yNoteTitle.observe(() => {
      if(this.yNoteTitle?.toString())
        textArea.value = this.yNoteTitle?.toString();
    });
    textArea.addEventListener('input', updateNoteTitle);
    textArea.addEventListener('change', updateNoteTitle);
  }

  setUsername(username: string) {
    if (this.binding)
      this.binding.awareness.setLocalStateField('user', { name: username });
  }

  destroy() {
    if(!this.isHost) this.observers_.clear();
    this.isInitialized = false;
    this.yDoc?.destroy();
    this.yUndoManager?.destroy();
    this.provider?.destroy();
  }
}

const yUtils_ = new YUtils();

const yUtils = (): YUtils => {
  return yUtils_;
};

export { yUtils };
