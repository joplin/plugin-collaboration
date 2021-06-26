import React, { Component, createRef, RefObject } from 'react';

import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/markdown/markdown';

import './Editor.css';
import { connect } from 'react-redux';
import { AppState } from 'redux/types';

interface Props {
  onEditorMount: (editor: CodeMirror.Editor) => void;
  isReadOnly: boolean;
  editorConfig?: CodeMirror.EditorConfiguration;
  containerStyle?: React.CSSProperties;
}

interface State {
  editorParentRef: RefObject<any>;
}


class Editor extends Component<Props, State> {
  editor: CodeMirror.Editor | null = null;
  constructor(props: Props) {
    super(props);
    this.state = {
      editorParentRef: createRef()
    };
  }

  componentDidMount() {
    const { editorParentRef } = this.state;
    if (editorParentRef.current) {
      const { editorConfig, onEditorMount, isReadOnly } = this.props;
  
      const config = Object.assign({}, {
        mode: 'markdown',
        lineWrapping: true,
        lineNumbers: false,
        indentWithTabs: true,
        indentUnit: 4,
        spellcheck: true,
        theme: 'material',
      }, editorConfig);

      this.editor = CodeMirror(editorParentRef.current, config);
      this.editor.setOption('readOnly', isReadOnly);
      this.editor.setSize('100%', '100%');
      onEditorMount(this.editor);
    }
  }

  componentDidUpdate() {
    const { isReadOnly } = this.props;
    this.editor?.setOption('readOnly', isReadOnly);
  }

  render() {
    const { containerStyle } = this.props;
    const { editorParentRef } = this.state;
    return <div ref={editorParentRef} style={containerStyle}/>;
  }
}

const mapStateToProps = (state: { app: AppState }) => {
  const { isHost, hostJoined } = state.app;
  return {
    isReadOnly: (!isHost && !hostJoined)
  };
};

export default connect(mapStateToProps)(Editor);
