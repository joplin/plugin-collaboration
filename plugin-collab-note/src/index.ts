import joplin from 'api';
import addSettingsToConfigScreen from './init/addSettingsToConfigScreen';
import addToolbarButton from './init/addToolbarButton';
import { registerOpenCollabNoteCommand } from './init/open-collab-note.commad';

joplin.plugins.register({
	onStart: async function() {
		console.info('Collaboration plugin started!');
    await addSettingsToConfigScreen();
    await registerOpenCollabNoteCommand();
    await addToolbarButton();
	},
});
