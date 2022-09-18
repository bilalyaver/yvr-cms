import welcome from 'cli-welcome';

import unhandled from 'cli-handle-unhandled';



export default ({ clear = true }) => {
	unhandled();
	welcome({
		title: `nodejs-mongoose-crud`,
		tagLine: `by Bilal Yaver`,
		description: "Nodejs Boilerplate",
		version: '0.0.4',
		bgColor: '#36BB09',
		color: '#000000',
		bold: true,
		clear
	});
};
