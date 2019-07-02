'use strict';

//
// Utility functions
//
const state = {
	OPTIMAL: {
		name: "optimal",
		color: "success"
	},
	WARNING: {
		name: "warning",
		color: "warning"
	},
	DANGER: {
		name: "danger",
		color: "danger"
	},
	NOTAPPLICABLE: {
		name: "n/a",
		color: "secondary"
	}
}

function mergeStates(s1, s2) {
	if ((s1 == state.DANGER) || (s2 == state.DANGER)) {
		return state.DANGER
	}
	if ((s1 == state.WARNING) || (s2 == state.WARNING)) {
		return state.WARNING
	}
	return state.OPTIMAL
}

function splitPath(path) {
	var a = path.split("/")
	var d = {}
	if (path == "cluster") {
		d.namespace = ""
		d.kind = "ccfg"
		d.name = path
	} else if (a.length == 1) {
		d.namespace = ""
		d.kind = "svc"
		d.name = path
	} else if (a.length == 2) {
		d.namespace = ""
		d.kind = a[0]
		d.name = a[1]
	} else if (a.length == 3) {
		d.namespace = a[0]
		d.kind = a[1]
		d.name = a[2]
	}
	return d
}

function parseIni(text) {
	let data = {};
	let currentKey = null;
	const keyValuePair = kvStr => {
		const kvPair = kvStr.split('=').map( val => val.trim() );
		return { key: kvPair[0], value: kvPair[1] };
	};
	text
		.split( /\n/ )
		.map( line => line.replace( /^\s+|\r/g, "" ) )
		.forEach( line =>  {
			line = line.trim();
			if (line.startsWith('#') || line.startsWith(';')) {
				return false;
			}
			if (line.length) {
				if (/^\[/.test(line)) {
					currentKey = line.replace(/\[|\]/g,'');
					data[currentKey] = {};
				} else if ( currentKey.length ) {
					const kvPair = keyValuePair(line);
					data[currentKey][kvPair.key] = kvPair.value;
				}
			}
		}, {currentKey: ''} );
	return data
}

export { state, mergeStates, parseIni, splitPath };
