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

// cli commands and flags
import createModel from './utils/createModel.js';
import checkPackage from './utils/checkPackage.js';
import newProject from './utils/newProject.js';
import getAllRouters from './helpers/getAllRouters.js';

(async () => {
	init({ clear });
	input.includes(`help`) && cli.showHelp(0);
	
	debug && log.error(flags);

	if (flags.newProject) {
		await newProject();
		return
	}

	

	if (flags.getAllRouters) {
		getAllRouters();
		return
	}
		
	

	const checkPackageResult = checkPackage();

	if (!checkPackageResult.isThere) {
		log.warning(checkPackageResult.message);
		log.info(checkPackageResult.command);
		return
	}
	

	if (flags.createModel) {
		createModel(input);
	}
})();
