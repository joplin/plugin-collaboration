import joplin from 'api';
import { SettingItem, SettingItemType } from 'api/types';
import {
  SETTINGS_SECTION_ID,
  PLUGIN_ICON,
  COLLAB_WEB_APP_URL_ID
} from './constants';

async function addSettingsToConfigScreen(): Promise<void> {
  await joplin.settings.registerSection(SETTINGS_SECTION_ID, {
    name: 'collab note',
    label: 'Collab Note Plugin',
    description: 'Provide the Collab note web app URL to directly configure and open the note in the web app',
    iconName: PLUGIN_ICON
  });

  const options: Record<string, SettingItem> = {};
  options[COLLAB_WEB_APP_URL_ID] = {
    value: '',
    type: SettingItemType.String,
    section: SETTINGS_SECTION_ID,
    public: true,
    label: 'Web App URL',
    description: 'ex: http://localhost:3000 or http://joplin-collab-note.app'
  };
  await joplin.settings.registerSettings(options);
}

export default addSettingsToConfigScreen;
