import { CodemirrorBinding } from 'y-codemirror';
import { WebrtcProvider } from 'y-webrtc';
import * as Y from 'yjs';

class YUtils {

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
        /**
         * @todo
         * Need to pass singaling sever URL to the WebrtcProvider Constructor
         * By default it uses the dev signaling servers of Yjs
         */
        this.provider = new WebrtcProvider(id, this.yDoc);

        setTimeout(() => {
            if(isHost) {
                this.setSessionProp('HostJoined', true);
                window.addEventListener('beforeunload', (event) => {
                    event.preventDefault();
                    // required by Chrome
                    event.returnValue = '';
                    return this.setSessionProp('HostJoined', false);
                })
            }
        }, 500)
    }

    get yText() {
        return this.yDoc?.getText('note');
    }

    get props() {
        return this.yDoc?.getMap('session-props');
    }

    setEditor(editor) {
        if(!this.isInitialized) return;
        this.binding = new CodemirrorBinding(this.yText, editor, this.provider.awareness, { yUndoManager: this.yUndoManager });
        this.setUsername(this.username);
    }

    setUsername(username) {
        if(this.binding)
            this.binding.awareness.setLocalStateField('user', { name: username });
    }

    setSessionProp(key, value) {
        if(!key || !this.props) return;
        this.props.set(key, value);
    }

    getSessionProp(key) {
        if(!this.props) return null;
        return this.props.get(key);
    }

    destroy() {
        if(this.isHost && this.props) this.setSessionProp('HostJoined', false);
        this.yDoc?.destroy();
        this.yUndoManager?.destroy();
        this.provider?.destroy();
    }
}

const yUtils_ = new YUtils();

const yUtils = () => {
    return yUtils_;
}

export { yUtils };
