import { CodemirrorBinding } from 'y-codemirror';
import { WebrtcProvider } from 'y-webrtc';
import * as Y from 'yjs';

class YUtils {
    observers_ = new Map();

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
    init(id, isHost, username) {
        if(this.isInitialized) this.destroy();

        this.isInitialized = true;
        this.yDoc = new Y.Doc();
        this.yUndoManager = new Y.UndoManager(this.yText);

        this.isHost = isHost;
        this.username = username;

        if(isHost) {
            this.yText.setAttribute('HostJoined', true);
        }

        /**
         * @todo
         * Need to pass singaling sever URL to the WebrtcProvider Constructor
         * By default it uses the dev signaling servers of Yjs
         */
        this.provider = new WebrtcProvider(id, this.yDoc);
    }    

    get yText() {
        return this.yDoc?.getText('codemirror');
    }

    setEditor(editor) {
        if(!this.isInitialized) return;
        this.binding = new CodemirrorBinding(this.yText, editor, this.provider.awareness, { yUndoManager: this.yUndoManager });
        this.setUsername(this.username);
    }

    setUsername(username) {
        if(this.binding)
            this.binding.awareness.setLocalStateField('user', { name: username })
    }

    addObserver(name, callback) {
        if(name in this.observers_) throw new Error('Duplicate observer name');
        if(!this.isInitialized) throw new Error('Session not intialized');

        this.observers_.set(name, callback)

        this.yText.observe(callback);
    }

    removeObserver(name) {
        if(name in this.observers_) {
            const callback = this.observers_.get(name);
            this.yText.unobserve(callback);
        }
    }

    destroy() {
        if(this.isHost && this.yDoc) this.yText.setAttribute('HostJoined', false);
        this.observers_.clear();
        this.yDoc?.destroy();
        this.yUndoManager?.destroy();
        this.provider?.destroy();
        this.binding?.destroy();
    }

}

const yUtils_ = new YUtils();

const yUtils = () => {
    return yUtils_;
}

export { yUtils };