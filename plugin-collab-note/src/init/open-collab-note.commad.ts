import joplin from "api";
import { isURL } from "validator";
import {
  OPEN_COLLAB_NOTE_COMMAND,
  PLUGIN_ICON,
  COLLAB_WEB_APP_URL_ID
} from "./constants";

const opener = require('opener');

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

      const localhostRegEx = /^http:\/\/localhost:([0-9]{4})\//g;

      if(isURL(webAppURL) || localhostRegEx.test(webAppURL)) {
        const token: string = await joplin.settings.globalValue('api.token');
        const note: { id: string } = await joplin.workspace.selectedNote();
        console.log('Collaboration plugin:',{ WebAppURL: webAppURL, token, note });
        try {
          opener(`${webAppURL}${note.id}/${token}`);
        }
        catch(error) {
          console.log(error);
        }
      }
      else {
        await joplin.views.dialogs.showMessageBox(`Error: Invalid URL! - ${webAppURL}`);
        return;
      }
    }
  });
  console.log('toolbar-button loaded');
}
