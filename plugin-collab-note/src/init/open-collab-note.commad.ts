import joplin from "api";
import {
  OPEN_COLLAB_NOTE_COMMAND,
  PLUGIN_ICON,
  COLLAB_WEB_APP_URL_ID
} from "./constants";

const opener = require('opener');

function isValidUrl(url: string): boolean {
  const urlRegex = /^((http(s)?):\/\/)([wW]{3}\.)?[a-zA-Z0-9\-.]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?(\/)?$/g;
  const result = url.match(urlRegex);
  return result !== null || url.startsWith('http://localhost:');
};

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

      if(isValidUrl(webAppURL)) {
        const token: string = await joplin.settings.globalValue('api.token');
        const note: { id: string } = await joplin.workspace.selectedNote();
        console.log('Collboration plugin:',{ WebAppURL: webAppURL, token, note });
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
