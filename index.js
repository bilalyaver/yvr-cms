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
import path from 'path';
import { execSync } from 'child_process';
import fs from 'fs';
import { fileURLToPath } from 'url';

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

// cli commands and flags
import checkPackage from './utils/checkPackage.js';
import newProject from './utils/newProject.js';

const __filename = fileURLToPath(import.meta.url);

// Kullanıcının çalışma dizinini belirle
const targetDirectory = process.cwd();

// Dinamik olarak oluşturulacak dosyaların içeriği
const nextJsAppContent = `
import React from 'react';

const Home = () => {
    return <div>Welcome to my Next.js App!</div>;
};

export default Home;
`;

// `pages/index.js` dosyasını oluşturma işlevi
function createNextJsFiles(targetDirectory) {
    const pagesDir = path.join(targetDirectory, 'pages');
    fs.mkdirSync(pagesDir, { recursive: true });
    fs.writeFileSync(path.join(pagesDir, 'index.js'), nextJsAppContent);
}

(async () => {
	init({ clear });
	input.includes(`help`) && cli.showHelp(0);
	
	debug && log.error(flags);

	if (flags.newProject) {
		await newProject();
		return;
	}

	if(flags.test) {
		log.info("Test işlemi yapılıyor...");
		return;
	}

	const checkPackageResult = checkPackage();

	if (!checkPackageResult.isThere) {
		log.warning(checkPackageResult.message);
		log.info(checkPackageResult.command);
		return;
	}
	

	// Next.js dosyalarını dinamik olarak oluştur
	log.info("Next.js dosyaları oluşturuluyor...");
	createNextJsFiles(targetDirectory);
	log.success("Next.js dosyaları başarıyla oluşturuldu.");

	// Next.js bağımlılıklarını yükle
	log.info("Next.js bağımlılıkları yükleniyor...");
	execSync('npm install next react react-dom', { cwd: targetDirectory, stdio: 'inherit' });

	// Next.js uygulamasını başlat
	log.info("Next.js uygulaması başlatılıyor...");
	execSync('npx next dev', { cwd: targetDirectory, stdio: 'inherit' });

})();