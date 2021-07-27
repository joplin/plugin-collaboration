import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import CodeMirror from 'codemirror';

import { yUtils } from 'utils/WebRTCUtils/y-utils';
import Editor from 'components/Editor';
import { Note, Resource } from 'utils/types';
import { Redirect } from 'react-router';
import { addResources, handleHostStatusChange, resetState, setNoteContent } from 'redux/actions';
import SessionEvents from 'utils/WebRTCUtils/sessionEvents';
import Preview from 'components/Preview';
import { AppState } from 'redux/types';
import Toolbar from 'components/Toolbar';
import Titlebar from 'components/Titlebar';

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
  resetState: () => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 98%;
  margin-right: auto;
  margin-left: auto;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.06), 0 2px 5px 0 rgba(0, 0, 0, 0.2);
  p { 
    word-wrap: break-word;
  }
`;

const ViewContainer = styled.div`
  display: flex;
  height: 80vh;
  padding: 10px 0;
  >div {
    width: 0%;
    flex-grow: 1;
    padding-left: 10px;
    border-right: 1px solid rgba(0, 0, 0, 0.06);

    :last-child {
      border-right: none;
      padding-right: 10px;
    }
  }
`;

const PreviewContainer = styled.div`
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

  componentDidUpdate(prevProps: Props) {
    const { note } = this.props;
    if (prevProps.note?.body !== note?.body) {
      this.editor?.setValue(note?.body || '');
    }
  }

  componentWillUnmount() {
    yUtils().destroy();
    this.props.resetState();
  }

  render() {
    if (!this.props.roomId || !this.props.username) {
      return <Redirect to={'/'} />;
    }
    return (
      <Container>
        <Titlebar />
        <Toolbar />
        <ViewContainer>
          <Editor onEditorMount={this.onEditorMount} />
          <PreviewContainer>
            <Preview />
          </PreviewContainer>
        </ViewContainer>
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

const mapDispatchToProps = (dispatch: any) => {
  return {
    setHostJoined: (hostJoined: boolean) => {
      dispatch(handleHostStatusChange(hostJoined));
    },
    setNoteContent: (content: string) => {
      dispatch(setNoteContent(content));
    },
    addResources: (resources: Resource[]) => {
      dispatch(addResources(resources));
    },
    resetState: () => {
      dispatch(resetState());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CollabNote);
