import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import CodeMirror from 'codemirror';

import { yUtils } from 'utils/WebRTCUtils/y-utils';
import Editor from 'components/Editor';
import { Note, Resource } from 'utils/types';
import { Redirect } from 'react-router';
import { addResources, handleHostStatusChange, setNoteContent } from 'redux/actions';
import SessionEvents from 'utils/WebRTCUtils/sessionEvents';
import { DispatchType } from 'redux/store';
import Preview from 'components/Preview';
import { AppState } from 'redux/types';

interface Props {
  isHost: boolean;
  roomId: string;
  note: Note | null;
  username: string;
  hostJoined: boolean;
  resources: Resource[];
  setHostJoined: (hostJoined: boolean) => void;
  setNoteContent: (note: string) => void;
  addResources: (resources: Resource[]) => void;
}

const Container = styled.div`
  display: flex;
  width: 98%;
  height: 80vh;
  margin-right: auto;
  margin-left: auto;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.06), 0 2px 5px 0 rgba(0, 0, 0, 0.2);

  >div {
    flex: 1;
    width: 50%;
  }

  p { 
    word-wrap: break-word;
  }
`;

const PreviewContainer = styled.div`
  margin-left: 10px;
  overflow-y: auto;
`;

class CollabNote extends Component<Props> {
  editor: CodeMirror.Editor | undefined;

  constructor(props: Props) {
    super(props);
    const { isHost, roomId, username, resources, setHostJoined } = props;
    yUtils().init(roomId, isHost, username);
    if (!isHost) {
      setHostJoined(yUtils().didHostJoin());
      yUtils().on(SessionEvents.HostJoined, this.handleHostJoined);
      yUtils().on(SessionEvents.HostLeft, this.handleHostLeft);
    }
    else {
      yUtils().updateResources(resources);
    }
    yUtils().on(SessionEvents.ResourcesChanged, this.handleResourceChanged);
  }

  handleHostJoined = () => {
    const { hostJoined, setHostJoined } = this.props;
    if (hostJoined) return;
    setHostJoined(true);
    this.editor?.setOption('readOnly', false);
  };

  handleHostLeft = () => {
    const { hostJoined, setHostJoined } = this.props;
    if (!hostJoined) return;
    setHostJoined(false);
    this.editor?.setOption('readOnly', true);

    // This will clean the data shared by the host, when host leaves.
    this.editor?.clearHistory();
    this.editor?.setValue('');
  };

  handleResourceChanged = (resources: Resource[]) => {
    this.props.addResources(resources);
  }

  onEditorMount = (editor: CodeMirror.Editor) => {
    const { isHost, note } = this.props;
    yUtils().setEditor(editor);
    editor.on('change', this.handleEditorContentChange);
    editor.focus();
    if (isHost && note) {
      editor.setValue(note.body);
    }
    this.editor = editor;
  };

  handleEditorContentChange = (editorInstance: CodeMirror.Editor) => {
    this.props.setNoteContent(editorInstance.getValue());
  };

  componentWillUnmount() {
    yUtils().destroy();
  }

  render() {
    if (!this.props.roomId || !this.props.username) {
      return <Redirect to={'/'} />;
    }
    return (
      <Container>
        <Editor onEditorMount={this.onEditorMount} />
        <PreviewContainer>
          <Preview />
        </PreviewContainer>
      </Container>
    );
  }
}

const mapStateToProps = (state: { app: AppState }) => {
  const { isHost, roomId, note, username, hostJoined, resources } = state.app;
  return {
    isHost,
    roomId: roomId || '',
    note,
    username: username || '',
    hostJoined,
    resources
  };
};

const mapDispatchToProps = (dispatch: DispatchType) => {
  return {
    setHostJoined: (hostJoined: boolean) => {
      dispatch(handleHostStatusChange(hostJoined));
    },
    setNoteContent: (content: string) => {
      dispatch(setNoteContent(content));
    },
    addResources: (resources: Resource[]) => {
      dispatch(addResources(resources));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CollabNote);
