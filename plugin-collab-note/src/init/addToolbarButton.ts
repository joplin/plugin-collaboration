import joplin from 'api';
import { ToolbarButtonLocation } from 'api/types';
import {
  PLUGIN_TOOLBAR_BUTTON_ID,
  OPEN_COLLAB_NOTE_COMMAND
} from './constants';

async function addToolbarButton() {
  await joplin.views.toolbarButtons.create(
    PLUGIN_TOOLBAR_BUTTON_ID,
    OPEN_COLLAB_NOTE_COMMAND,
    ToolbarButtonLocation.EditorToolbar
  );
}

export default addToolbarButton;