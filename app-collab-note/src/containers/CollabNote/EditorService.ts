let _editor: CodeMirror.Editor | null = null;

export function setEditor(editor: CodeMirror.Editor | null): void {
  _editor = editor;
}

export function selectedText(): string {
  if(!_editor) return '';
  const selections = _editor.getSelections();
  return selections.length ? selections[0] : '';
}

export function replaceSelection(value: string): any {
  if(!_editor) return;

  return _editor.replaceSelection(value);
}

export function textBold(): void {
  if(!_editor) return;

  wrapSelectionWithStrings('**', '**', 'strong text');
  _editor.focus();
}

export function textItalic(): void {
  if(!_editor) return;

  wrapSelectionWithStrings('*', '*', 'emphasised text');
  _editor.focus();
}

export function textCode(): void {
  if(!_editor) return;

  const selections = _editor.getSelections();

  // This bases the selection wrapping only around the first element
  if (selections.length > 0) {
    const string = selections[0];

    // Look for newlines
    const match = string.match(/\r?\n/);

    if (match && match.length > 0) {
      wrapSelectionWithStrings(`\`\`\`${match[0]}`, `${match[0]}\`\`\``);
    } else {
      wrapSelectionWithStrings('`', '`', '');
    }
  }
}
export function textLink(): void {
  if(!_editor) return;

  const url = window.prompt('Insert Hyperlink');
  _editor.focus();
  if (url) wrapSelectionWithStrings('[', `](${url})`);
}

export function setReadonly(value: boolean): void {
  if(!_editor) return;
  _editor.setOption('readOnly', value);
}

export function setValue(value: string): void {
  if(!_editor) return;
  _editor.setValue(value);
}

export function reset(): void {
  if(!_editor) return;
  _editor.clearHistory();
  _editor.setValue('');
}

function wrapSelections(string1: string, string2: string): void {
  if(!_editor) return;

  const selectedStrings = _editor.getSelections();

  // Batches the insert operations, if this wasn't done the inserts
  // could potentially overwrite one another
  _editor.operation(() => {
    for (let i = 0; i < selectedStrings.length; i++) {
      const selected = selectedStrings[i];

      // Remove white space on either side of selection
      const start = selected.search(/[^\s]/);
      const end = selected.search(/[^\s](?=[\s]*$)/);
      const core = selected.substr(start, end - start + 1);

      // If selection can be toggled do that
      if (core.startsWith(string1) && core.endsWith(string2)) {
        const inside = core.substr(string1.length, core.length - string1.length - string2.length);
        selectedStrings[i] = selected.substr(0, start) + inside + selected.substr(end + 1);
      } else {
        selectedStrings[i] = selected.substr(0, start) + string1 + core + string2 + selected.substr(end + 1);
      }
    }
    _editor?.replaceSelections(selectedStrings, 'around');
  });
}

function wrapSelectionWithStrings(string1: string, string2 = '', defaultText = ''): void {
  if (!_editor) return;
  if (_editor.somethingSelected()) {
    wrapSelections(string1, string2);
  } else {
    wrapSelections(string1 + defaultText, string2);

    // Now select the default text so the user can replace it
    const selections = _editor.listSelections();
    const newSelections = [];
    for (let i = 0; i < selections.length; i++) {
      const s = selections[i];
      const anchor = { line: s.anchor.line, ch: s.anchor.ch + string1.length };
      const head = { line: s.head.line, ch: s.head.ch - string2.length };
      newSelections.push({ anchor: anchor, head: head });
    }
    _editor.setSelections(newSelections);
  }
}
