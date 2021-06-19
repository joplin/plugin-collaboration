import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import CodeMirror from 'codemirror';

import { yUtils } from 'utils/WebRTCUtils/y-utils';
import Editor from 'components/Editor';
import { Note } from 'utils/types';
import { Redirect } from 'react-router';
import { handleHostStatusChange } from 'redux/actions';
import SessionEvents from 'utils/WebRTCUtils/sessionEvents';

interface Props {
  isHost: boolean;
  roomId: string;
  note: Note;
  username: string;
  hostJoined: boolean;
  setHostJoined: (hostJoined: boolean) => void;
}

const Container = styled.div`
	display: flex;
  width: 100%;
	height: 80vh;
  margin-right: auto;
  margin-left: auto;
  padding: 10px 15px;
  @media (max-width: 740px) {
    width: 100%;
  }
  @media (min-width: 576px) {
    max-width: 540px;
  }

  @media (min-width: 768px) {
    max-width: 720px;
  }

  @media (min-width: 992px) {
    max-width: 960px;
  }

  @media (min-width: 1200px) {
    max-width: 1140px;
  }
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.06), 0 2px 5px 0 rgba(0, 0, 0, 0.2);
`;

class CollabNote extends Component<Props> {
  editor: CodeMirror.Editor | undefined;

  constructor(props: Props) {
    super(props);
    const { isHost, roomId, username, setHostJoined } = props;
    yUtils().init(roomId, isHost, username);
    if(!isHost) {
      setHostJoined(yUtils().didHostJoin());
      yUtils().on(SessionEvents.HostJoined, this.handleHostJoined);
      yUtils().on(SessionEvents.HostLeft, this.handleHostLeft);
    }
  }

  handleHostJoined = () => {
    const { hostJoined, setHostJoined } = this.props;
    if(hostJoined) return;
    setHostJoined(true);
    this.editor?.setOption('readOnly', false);
  }

  handleHostLeft = () => {
    const { hostJoined, setHostJoined } = this.props;
    if(!hostJoined) return;
    setHostJoined(false);
    this.editor?.setOption('readOnly', true);
    
    // This will clean the data shared by the host, when host leaves.
    this.editor?.clearHistory();
    this.editor?.setValue('');
  }

  onEditorMount = (editor: CodeMirror.Editor) => {
    const { isHost, note } = this.props;
    yUtils().setEditor(editor);
    editor.focus();
    if (isHost) {
      editor.setValue(note.body);
    }
    this.editor = editor;
  };

  componentWillUnmount() {
    yUtils().destroy();
  }

  render() {
    if (!this.props.roomId || !this.props.username) {
      return <Redirect to={'/'} />;
    }
    const containerStyle = {
      width: '100%',
      border: '1px solid black',
      cursor: 'text',
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
  const { isHost, roomId, note, username, hostJoined } = state.app;
  return {
    isHost,
    roomId,
    note,
    username,
    hostJoined
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setHostJoined: (hostJoined: boolean) => { 
      dispatch(handleHostStatusChange(hostJoined)); 
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CollabNote);
