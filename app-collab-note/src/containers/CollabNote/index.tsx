import React, { Component } from 'react'
import { connect } from 'react-redux';
import styled from 'styled-components';
import CodeMirror from 'codemirror';

import { yUtils } from '../../utils/WebRTCUtils/y-utils';
import Editor from '../../components/Editor';
import { Note } from '../../utils/types';

interface Props {
    isHost: boolean;
    roomId: string;
    note: Note;
    username: string;
}

interface State {
}

const Container = styled.div`
  width: 80%;
  height: 80%;
  min-height: 640px;
  min-width: 640p;
  padding: 10px 20px;
  @media (max-width: 740px) {
    width: 100%;
  }
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.06), 0 2px 5px 0 rgba(0, 0, 0, 0.2);
`;

class CollabNote extends Component<Props, State> {
    editor: CodeMirror.Editor | null;
    constructor(props: Props) {
        super(props);
        this.editor = null;
        const { isHost, roomId, username } = props;
        yUtils().init(roomId, isHost, username);
    }

    onEditorMount = (editor: CodeMirror.Editor) => {
        const { isHost, note } = this.props;
        yUtils().setEditor(editor);
        if(isHost) {
            editor.setValue(note.body);
        }
    }

    render() {
        const containerStyle = {
            width: '100%',
            height: '100%',
        };
        return (
            <Container>
                <Editor
                    onEditorMount={this.onEditorMount}
                    containerStyle={containerStyle}
                />
            </Container>
        );
    }
}

const mapStateToProps = (state: any) => {
    return {
        isHost: state.isHost,
        roomId: state.roomId,
        note: state.note,
        username: state.username,
    }
}

export default connect(mapStateToProps)(CollabNote);
