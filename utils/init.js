import welcome from 'cli-welcome';
import unhandled from 'cli-handle-unhandled';
import getVersion from '../helpers/getVersion.js';


export default ({ clear = true }) => {
	unhandled();
	welcome({
		title: `NodeJS Headless CMS`,
		tagLine: `by Bilal Yaver`,
		description: "Nodejs Headless CMS with Mongoose, Express, Next.js and MongoDB",
		version: getVersion(),
		bgColor: '#36BB09',
		color: '#000000',
		bold: true,
		clear
	});
};