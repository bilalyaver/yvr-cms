import meow from 'meow';
import meowHelp from 'cli-meow-help';

const flags = {
	version: {
		type: `boolean`,
		alias: `v`,
		desc: `Print CLI version`
	},
	newProject: {
		type: `boolean`,
		alias: `p`,
		desc: `Create a new project`,
		example: 'p <projectName>'
	},
	updateClient: {
		type: `boolean`,
		alias: `u`,
		desc: `Update client files`,
		example: 'u'
	},
};

const commands = {
	help: { desc: `Print help info` }
};

const helpText = meowHelp({
	name: `yvr`,
	flags,
	commands
});

const options = {
	inferType: true,
	description: false,
	hardRejection: false,
	flags
};

export default meow(helpText, options);
