import joplin from "api";
import validator from "validator";
import opener from "opener";

import {
  OPEN_COLLAB_NOTE_COMMAND,
  PLUGIN_ICON,
  COLLAB_WEB_APP_URL_ID
} from "./constants";

const localhostRegEx = /^http:\/\/localhost:([0-9]{4,})\//g;

function isValidURL(url: string) {
  if(!(url.startsWith('http://') || url.startsWith('https://'))) return false;
  return validator.isURL(url) || localhostRegEx.test(url);
}

export async function registerOpenCollabNoteCommand() {
  await joplin.commands.register({
    name: OPEN_COLLAB_NOTE_COMMAND,
    label: 'Open note in Collab note web app',
    iconName: PLUGIN_ICON,
    execute: async () => {
      let webAppURL: string = await joplin.settings.value(COLLAB_WEB_APP_URL_ID);

      if(!webAppURL) {
        await joplin.views.dialogs.showMessageBox(`
        Error: URL to the Collab Note web app is required!
        Please provide the URL in 'Tools>Options>Collab Note Plugin' section.
        `);
        return;
      }

      if(!webAppURL.endsWith('/')) {
        webAppURL = webAppURL + '/';
      }


      if(isValidURL(webAppURL)) {
        const token: string = await joplin.settings.globalValue('api.token');
        const note: { id: string } = await joplin.workspace.selectedNote();
        console.log('Collaboration plugin:',{ WebAppURL: webAppURL, token, note });
        opener(`${webAppURL}${note.id}/${token}`);
      }
      else {
        await joplin.views.dialogs.showMessageBox(`Error: Invalid URL! - ${webAppURL}`);
        return;
      }
    }
  });
  console.log('toolbar-button loaded');
}
