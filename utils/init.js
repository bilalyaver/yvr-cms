import welcome from 'cli-welcome';
import unhandled from 'cli-handle-unhandled';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { version } = require('../package.json');

export default ({ clear = true }) => {
	unhandled();
	welcome({
		title: `NodeJS Headless CMS`,
		tagLine: `by Bilal Yaver`,
		description: "Nodejs Headless CMS with Mongoose, Express, Next.js and MongoDB",
		version: version,
		bgColor: '#36BB09',
		color: '#000000',
		bold: true,
		clear
	});
};