#!/usr/bin/env node

/**
 * nodejs-mongoose-crud
 * later
 *
 * @author Bilal Yaver <whatisday.today>
 */

import init from './utils/init.js';
import cli from './utils/cli.js';
import log from './utils/log.js';


const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

// Creators
import createModel from './utils/createModel.js';

// Chekers
import checkPackage from './utils/checkPackage.js';

// Initializer
import newProject from './utils/newProject.js';

(async () => {
	init({ clear });
	input.includes(`help`) && cli.showHelp(0);
	
	debug && log.error(flags);

	if (flags.newProject) {
		console.log("newProject");
		await newProject();
		return
	}

	const checkPackageResult = checkPackage();

	if (!checkPackageResult.isThere) {
		console.log("checkPackageResult");
		log.warning(checkPackageResult.message);
		log.info(checkPackageResult.command);
		return
	}
	

	if (flags.createModel) {
		createModel(input);
	}
})();
