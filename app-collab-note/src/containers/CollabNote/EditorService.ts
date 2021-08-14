// Copied from Joplin Desktop - CodeMirror

let _editor: CodeMirror.Editor | null = null;

export function setEditor(editor: CodeMirror.Editor | null): void {
  _editor = editor;
}

export function focusEditor(): void {
  if(!_editor) return;

  _editor.focus();
}

export function selectedText(): string {
  if (!_editor) return '';
  const selections = _editor.getSelections();
  return selections.length ? selections[0] : '';
}

export function replaceSelection(value: string): any {
  if (!_editor) return;

  return _editor.replaceSelection(value);
}

export function textBold(): void {
  if (!_editor) return;

  wrapSelectionWithStrings('**', '**', 'strong text');
}

export function textItalic(): void {
  if (!_editor) return;

  wrapSelectionWithStrings('*', '*', 'emphasised text');
}

export function textCode(): void {
  if (!_editor) return;

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
  if (!_editor) return;

  const url = window.prompt('Insert Hyperlink');
  if (url) wrapSelectionWithStrings('[', `](${url})`);
}

export function textNumberedList(): void {
  let bulletNumber = olLineNumber(getCurrentLine());
  if (!bulletNumber) bulletNumber = olLineNumber(getPreviousLine());
  if (!bulletNumber) bulletNumber = 0;
  addListItem(`${bulletNumber + 1}. `, 'List item');
}

export function textBulletedList(): void {
  addListItem('- ', 'List item');
}

export function textCheckbox(): void {
  addListItem('- [ ] ', 'List item');
}

export function textHeading(): void {
  addListItem('## ', '');
}

export function textHorizontalRule(): void {
  addListItem('* * *');
}

export function setReadonly(value: boolean): void {
  if (!_editor) return;
  _editor.setOption('readOnly', value);
}

export function setValue(value: string): void {
  if (!_editor) return;
  _editor.setValue(value);
}

export function reset(): void {
  if (!_editor) return;
  _editor.clearHistory();
  _editor.setValue('');
}

function addListItem(string1: string, defaultText = ''): void {
  if (_editor) {
    if (_editor.somethingSelected()) {
      wrapSelectionsByLine(string1);
    } else if (_editor.getCursor('anchor').ch !== 0) {
      insertAtCursor(`\n${string1}`);
    } else {
      wrapSelectionWithStrings(string1, '', defaultText);
    }
  }
}

function wrapSelections(string1: string, string2: string): void {
  if (!_editor) return;

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

function modifyListLines(lines: string[], num: number, listSymbol: string): string[] {
  const isNotNumbered = num === 1;
  for (let j = 0; j < lines.length; j++) {
    const line = lines[j];
    if (!line && j === lines.length - 1) continue;
    // Only add the list token if it's not already there
    // if it is, remove it
    if (num) {
      const lineNum = olLineNumber(line);
      if (!lineNum && isNotNumbered) {
        lines[j] = `${num.toString()}. ${line}`;
        num++;
      } else {
        const listToken = extractListToken(line);
        lines[j] = line.substr(listToken.length, line.length - listToken.length);
      }
    } else {
      if (!line.startsWith(listSymbol)) {
        lines[j] = listSymbol + line;
      } else {
        lines[j] = line.substr(listSymbol.length, line.length - listSymbol.length);
      }
    }
  }
  return lines;
}

function wrapSelectionsByLine(string1: string) {
  if (!_editor) return;

  const selectedStrings = _editor.getSelections();

  // Batches the insert operations, if _editor wasn't done the inserts
  // could potentially overwrite one another
  _editor.operation(() => {
    for (let i = 0; i < selectedStrings.length; i++) {
      const selected = selectedStrings[i];

      const num = olLineNumber(string1);

      const lines = selected.split(/\r?\n/);
      //  Save the newline character to restore it later
      const newLines = selected.match(/\r?\n/);
      modifyListLines(lines, num, string1);
      const newLine = newLines !== null ? newLines[0] : '\n';
      selectedStrings[i] = lines.join(newLine);
    }
    _editor?.replaceSelections(selectedStrings, 'around');
  });
}

function insertAtCursor(text: string) {
  if (!_editor) return;
  // This is also the method to get all cursors
  const ranges = _editor.listSelections();
  // Batches the insert operations, if this wasn't done the inserts
  // could potentially overwrite one another
  _editor.operation(() => {
    for (let i = 0; i < ranges.length; i++) {
      // anchor is where the selection starts, and head is where it ends
      // this changes based on how the uses makes a selection
      const { anchor, head } = ranges[i];
      // We want the selection that comes first in the document
      let range = anchor;
      if (head.line < anchor.line || (head.line === anchor.line && head.ch < anchor.ch)) {
        range = head;
      }
      _editor?.replaceRange(text, range);
    }
  });
}

function getCurrentLine(): string {
  if (!_editor) return '';
  const curs = _editor.getCursor('anchor');
  return _editor.getLine(curs.line);
}

function getPreviousLine(): string {
  if (!_editor) return '';
  const curs = _editor.getCursor('anchor');
  if (curs.line > 0) { return _editor.getLine(curs.line - 1); }
  return '';
}

const listRegex = /^(\s*)([*+-] \[[x ]\]\s|[*+-]\s|(\d+)([.)]\s))(\s*)/;

function olLineNumber(line: string): number {
  const match = line.match(listRegex);
  return match ? Number(match[3]) : 0;
}

function extractListToken(line: string): string {
  const match = line.match(listRegex);
  return match ? match[2] : '';
}
