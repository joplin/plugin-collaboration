import React, { Component, createRef, RefObject } from "react";

import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/markdown/markdown";

import "./Editor.css";

interface Props {
  onEditorMount: (editor: CodeMirror.Editor) => void;
  editorConfig?: CodeMirror.EditorConfiguration;
  containerStyle: React.CSSProperties;
}

interface State {
  editorParentRef: RefObject<any>;
}


class Editor extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      editorParentRef: createRef()
    }
  }

  componentDidMount() {
    const { editorParentRef } = this.state;
    if (editorParentRef.current) {
      const { editorConfig, onEditorMount } = this.props;
  
      const config = Object.assign({}, {
        mode: "markdown",
        lineWrapping: true,
        lineNumbers: false,
        indentWithTabs: true,
        indentUnit: 4,
        spellcheck: true,
        theme: 'material'
      }, editorConfig);
      const editor = CodeMirror(editorParentRef.current, config);
      editor.setSize('100%', '100%');
      onEditorMount(editor);
    }
  }

  render() {
    const { containerStyle } = this.props;
    const { editorParentRef } = this.state;
    return <div ref={editorParentRef} style={containerStyle}/>;
  }
}

export default Editor;
