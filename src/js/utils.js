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
	if (s1 == state.NOTAPPLICABLE) {
		return s2
	}
	if (s2 == state.NOTAPPLICABLE) {
		return s1
	}
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
	let kvPair = null;
	const keyValuePair = kvStr => {
		const kvPair = kvStr.split('=').map( val => val.trim() );
		return { key: kvPair[0], value: kvPair[1] };
	};
	text
		.split( /\n/ )
		//.map( line => line.replace( /^\s+|\r/g, "" ) )
		.map( line => line.replace( /\r/g, "" ) )		// empty line
		.map( line => line.replace( /\s*[#;].*$/g, "" ) )	// EOF comments
		.forEach( line =>  {
			if (line.match(/^\s*[#;]/)) {
				return false;
			}
			if (line.match(/^\s+/)) {
				if (currentKey && kvPair) {
					// line continuation
					data[currentKey][kvPair.key] += " " + line.trim()
					return true
				} else {
					return false
				}
			}
			line = line.trim();
			if (line.length) {
				if (/^\[/.test(line)) {
					currentKey = line.replace(/\[|\]/g,'');
					data[currentKey] = {};
				} else if ( currentKey.length ) {
					kvPair = keyValuePair(line);
					data[currentKey][kvPair.key] = kvPair.value;
				}
			}
		}, {currentKey: ''} );
	return data
}

function fancySizeMB(size) {
	if (size < 0) {
		var sign = "- "
		size = - size
	} else {
		var sign = ""
	}
	if (size<1024) {
		var unit = 'm'
		var _size = size
	} else if (size<1048576) {
		var unit = 'g'
		var _size = size / 1024
	} else {
		var unit = 't'
		var _size = size / 1048576
	}
	if (_size>=100) {
		_size = Math.round(_size)
	} else if (_size>=10) {
		_size = Math.round(_size*10)/10
	} else {
		_size = Math.round(_size*100)/100
	}
	return sign + _size + unit
}

export {
	state,
	mergeStates,
	parseIni,
	splitPath,
	fancySizeMB
}
