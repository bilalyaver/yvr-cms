import meow from 'meow';
import meowHelp from 'cli-meow-help';

const flags = {
	clear: {
		type: `boolean`,
		default: true,
		alias: `c`,
		desc: `Clear the console`
	},
	noClear: {
		type: `boolean`,
		default: false,
		desc: `Don't clear the console`
	},
	debug: {
		type: `boolean`,
		default: false,
		alias: `d`,
		desc: `Print debug info`
	},
	version: {
		type: `boolean`,
		alias: `v`,
		desc: `Print CLI version`
	},
	createModel: {
		type: `boolean`,
		alias: `n`,
		desc: `Create a model`,
	},
	getAllRouters: {
		type: `boolean`,
		alias: `l`,
		desc: `List all routers`,
		example: 'l'
	},
	newProject: {
		type: `boolean`,
		alias: `p`,
		desc: `Create a new project`,
		example: 'p <projectName>'
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
