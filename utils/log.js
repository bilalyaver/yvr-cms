import alert from 'cli-alerts';

const info = (msg) => {
	alert({
		type: `info`,
		name: `INFO`,
		msg: msg
	})
}

const warning = (msg) => {
	alert({
		type: `warning`,
		name: `WARNING`,
		msg: msg
	})
}

const success = (msg) => {
	alert({
		type: `success`,
		name: `SUCCESS`,
		msg: msg
	})
}

const error = (msg) => {
	alert({
		type: `error`,
		name: `ERROR`,
		msg: msg
	})
}

export default {
	info,
	warning,
	success,
	error
}
