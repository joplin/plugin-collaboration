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
import {default as Toolbar, ToolbarItemProps} from 'components/Toolbar';
import Titlebar from 'components/Titlebar';
import { faBold, faCheckSquare, faCode, faEllipsisH, faHeading, faItalic, faLink, faListOl, faListUl } from '@fortawesome/free-solid-svg-icons';
import * as EditorService from './EditorService';

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
  height: calc(100vh - 175px);
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
    EditorService.setReadonly(false);
  };

  handleHostLeft = () => {
    const { hostJoined, setHostJoined } = this.props;
    if (!hostJoined) return;
    
    setHostJoined(false);
    EditorService.setReadonly(true);
    // This will clean the data shared by the host, when the host leaves.
    EditorService.reset();
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
    EditorService.setEditor(editor);
  };

  handleEditorContentChange = (editorInstance: CodeMirror.Editor) => {
    this.props.setNoteContent(editorInstance.getValue());
  };

  componentDidUpdate(prevProps: Props) {
    const { note } = this.props;
    if (prevProps.note?.body !== note?.body) {
      EditorService.setValue(note?.body || '');
    }
  }

  componentWillUnmount() {
    yUtils().destroy();
    EditorService.setEditor(null);
    this.props.resetState();
  }

  render() {
    const { hostJoined, isHost, roomId, username } = this.props;

    if (!roomId || !username) {
      return <Redirect to={'/'} />;
    }

    const toolbarOptions: ToolbarItemProps[] = [
      {
        icon: faBold,
        action: () => { EditorService.textBold(); },
        label: 'Bold',
        text: '',
        onlyHost: false
      },
      {
        icon: faItalic,
        action: () => { EditorService.textItalic(); },
        label: 'Italic',
        text: '',
        onlyHost: false
      },
      {
        icon: faCode,
        action: () => { EditorService.textCode(); },
        label: 'Code',
        text: '',
        onlyHost: false
      },
      {
        icon: faLink,
        action: () => { EditorService.textLink(); },
        label: 'Link',
        text: '',
        onlyHost: false
      },
      {
        icon: faListOl,
        action: () => { EditorService.textNumberedList(); },
        label: 'Numbered List',
        text: '',
        onlyHost: false
      },
      {
        icon: faListUl,
        action: () => { EditorService.textBulletedList(); },
        label: 'Bulleted List',
        text: '',
        onlyHost: false
      },
      {
        icon: faCheckSquare,
        action: () => { EditorService.textCheckbox(); },
        label: 'Checkbox',
        text: '',
        onlyHost: false
      },
      {
        icon: faHeading,
        action: () => { EditorService.textHeading(); },
        label: 'Heading',
        text: '',
        onlyHost: false
      },
      {
        icon: faEllipsisH,
        action: () => { EditorService.textHorizontalRule(); },
        label: 'Horizontal Rule',
        text: '',
        onlyHost: false
      },
    ];

    return (
      <Container>
        <Titlebar disabled={!(isHost || hostJoined)} />
        <Toolbar
          toolbarItems={(hostJoined || isHost) ? toolbarOptions : []}
          toolbarRoutine={() => { EditorService.focusEditor(); }}
        />
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
