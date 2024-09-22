#!/usr/bin/env node

/**
 * nodejs-mongoose-crud
 * later
 *
 * @author Bilal Yaver <thejs.app>
 */

import init from './utils/init.js';
import cli from './utils/cli.js';
import log from './utils/log.js';

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;
const unknownFlags = Object.keys(cli.unknownFlags || {});

import newProject from './utils/newProject.js';
import updateClient from './utils/updateClient.js';

import { execSync } from 'child_process';

(async () => {
	init({ clear });
	input.includes(`help`) && cli.showHelp(0);

	// Geçersiz bayrakları kontrol et
	if (unknownFlags.length > 0) {
		log.error(`Unknown flag(s): ${unknownFlags.join(', ')}`);
		cli.showHelp(1); // Yardım bilgisini göster ve çık
		return;
	}

	debug && log.error(flags);

	if (flags.newProject) {
		await newProject();
		return;
	}

	if (flags.updateClient) {
		log.info("Client files updated");
		await updateClient();
		return;
	}

	// Geliştirme ortamında çalıştırma
	if (input.includes('dev')) {
		log.success("Starting development server...");
		execSync('cross-env NODE_ENV=development nodemon app.js', { stdio: 'inherit' });
		return;
	}

	// Üretim ortamında çalıştırma
	if (input.includes('start')) {
		try {
			log.success("Starting production server...");
			execSync('cross-env NODE_ENV=production node app.js', { stdio: 'pipe' });
		} catch (error) {
			log.error(`Stderr: ${error.stderr.toString()}`);
			if(error.stderr.toString().includes('.next')) {
				log.info("First build the client using `yvr build`");
			}
		}
		return;
	}

	// Client build işlemi
	if (input.includes('build')) {
		log.success("Building client...");
		execSync('next build ./client', { stdio: 'inherit' });
		return;
	}

})();