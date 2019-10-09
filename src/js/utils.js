'use strict';

//
// Utility functions
//
const state = {
	OPTIMAL: {
		name: "optimal",
		color: "inherit"
	},
	WARNING: {
		name: "warning",
		color: "orange"
	},
	DANGER: {
		name: "danger",
		color: "red"
	},
	NOTAPPLICABLE: {
		name: "n/a",
		color: "lightgray"
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

function fmtPath(name, namespace, kind) {
	if (!namespace || (namespace == "root")) {
		if (!kind || (kind == "svc")) {
			return name
		} else {
			return [kind, name].join("/")
		}
	} else {
		return [namespace, kind, name].join("/")
	}
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
		.map( line => line.replace( /\r/g, "" ) )		// strip empty line
		.map( line => line.replace( /\s+[#;].*$/g, "" ) )	// strip EOL comments
		.forEach( line =>  {
			if (line.match(/^\s*[#;]/)) {
				return false;				// discard comment line
			}
			if (line.match(/^\s+/)) {
				if (currentKey && kvPair) {
					// line continuation
					data[currentKey][kvPair.key] += " " + line.trim()
					return true
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

function namespaceValid(namespace) {
	if (Array.isArray(namespace)) {
		for (var ns of namespace) {
			if (!namespaceValid(ns)) {
				return false
			}
		}
		return true
	}
	if (namespace === undefined) {
		return false
	}
	if (!namespace) {
		return false
	}
	if (!namespace.match(/^[a-z]+[a-z0-9_\-\.]*$/i)) {
		return false
	}
	return true
}

function nameValid(name) {
	if (Array.isArray(name)) {
		for (var n of name) {
			if (!nameValid(n)) {
				return false
			}
		}
		return true
	}
	if (name === undefined) {
		return false
	}
	if (!name) {
		return false
	}
	if (!name.match(/^[a-z]+[a-z0-9_\-\.]*$/i)) {
		return false
	}
	return true
}

function createDataHasPathKey() {
	try {
		return Object.keys(data.data)[0].match(/^[a-z]+[a-z0-9_\-\.]*\/[a-z]+\/[a-z]+[a-z0-9_\-\.]*$/i)
	} catch(e) {
		return false
	}
}

function getBool(val){
	var num = +val;
	return !isNaN(num) ? !!num : !!String(val).toLowerCase().replace(!!0,'');
}

export {
	state,
	mergeStates,
	parseIni,
	splitPath,
	fmtPath,
	fancySizeMB,
	nameValid,
	namespaceValid,
	createDataHasPathKey,
	getBool,
}
