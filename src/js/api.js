import React from "react"	// for alerts.push({body: (<implicit React.createElement>), ...})

function encodeQueryData(data) {
	const ret = []
	for (let d in data) {
		ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]))
	}
	return ret.join('&')
}

function addQueryData(path, data) {
	var post = encodeQueryData(data)
	if (!post) {
		return path
	}
	if (path.indexOf("?") < 0) {
		path += "?"
	} else {
		path += "&"
	}
	return path + post
}

function parseApiResponse(data, ok) {
	var alerts = []
	var date = new Date()
	console.log("parse api response", data)
	function fmt(log) {
		if (!Array.isArray(log)) {
			log = [log]
		}
		return log.map((e, i) => (
			<div key={i}>{e}</div>
		))
	}
	if (data.status !== undefined) {
		if ("nodes" in data) {
			for (var node in data.nodes) {
				var _data = data.nodes[node]
				if (_data.status) {
					alerts.push({
						"date": date,
						"level": "error",
						"color": "secondary",
						"body": (<div><strong>{node}</strong><br/><div>{fmt(_data.error)}</div></div>)
					})
				}
				if (_data.info) {
					alerts.push({
						"date": date,
						"level": "success",
						"color": "primary",
						"body": (<div><strong>{node}</strong><br/><div>{fmt(_data.info)}</div></div>)
					})
				}
			}
		} else {
			if (data.error) {
				alerts.push({
					"date": date,
					"level": "error",
					"color": "secondary",
					"body": (<div>{fmt(data.error)}</div>)
				})
			}
		}
	}
	if (data.info) {
		alerts.push({
			"date": date,
			"level": "success",
			"color": "primary",
			"body": (<div>{fmt(data.info)}</div>)
		})
	}
	if (ok && (data.status == 0) && (alerts.length == 0)) {
		alerts.push({
			"date": date,
			"level": "success",
			"color": "primary",
			"body": (<div>{ok}</div>)
		})
	}
	return alerts
}

function addAuthorizationHeader(headers, auth) {
	if (!auth || !auth.authChoice) {
		return headers
	}
	if (auth.authChoice == "basic") {
		headers['Authorization'] = "Basic " + Buffer.from(auth.username + ":" + auth.password).toString('base64')
	} else if (auth.authChoice == "openid") {
		headers["Authorization"] = "Bearer " + auth.access_token
	}
	return headers
}

//
// API calls
//
function apiNodeAction(node, action, options, callback, user) {
	var headers = {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
		'o-node': node
	}
	headers = addAuthorizationHeader(headers, user)
	if (!options) {
		options = {}
	}
	fetch('/node_action', {
		headers: headers,
		method: "POST",
		body: JSON.stringify({
			sync: false,
			action: action,
			options: options
		})
	})
	.then(res => res.json())
	.then(data => {
		if (callback) { callback(data) }
	})
	.catch(console.log)
}

function apiInstanceAction(node, path, action, options, callback, user) {
	var headers = {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
		'o-node': node
	}
	headers = addAuthorizationHeader(headers, user)
	fetch('/object_action', {
		headers: headers,
		method: "POST",
		body: JSON.stringify({
			path: path,
			action: action,
			options: options,
			sync: false,
		})
	})
	.then(res => res.json())
	.then(data => {
		if (callback) { callback(data) }
	})
	.catch(console.log)
}

function apiNodeSetMonitor(global_expect, callback, user) {
	var headers = {
		'Accept': 'application/json',
		'Content-Type': 'application/json'
	}
	headers = addAuthorizationHeader(headers, user)
	fetch('/node_monitor', {
		headers: headers,
		method: "POST",
		body: JSON.stringify({
			global_expect: global_expect
		})
	})
	.then(res => res.json())
	.then(data => {
		if (callback) { callback(data) }
	})
	.catch(console.log)
}

function apiObjSetMonitor(path, global_expect, callback, user) {
	var headers = {
		'Accept': 'application/json',
		'Content-Type': 'application/json'
	}
	headers = addAuthorizationHeader(headers, user)
	fetch('/object_monitor', {
		headers: headers,
		method: "POST",
		body: JSON.stringify({
			path: path,
			global_expect: global_expect
		})
	})
	.then(res => res.json())
	.then(data => {
		if (callback) { callback(data) }
	})
	.catch(console.log)
}

function apiObjGetConfig(options, callback, user) {
	var headers = {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
		'o-node': 'ANY'
	}
	headers = addAuthorizationHeader(headers, user)
	var request = {
		"headers": headers,
		"method": "GET",
	}
	var path = addQueryData("/object_config", options)
	fetch(path, request)
	.then(res => res.json())
	.then(data => {
		// {nodes: {n1: {...}} => {...}
		// because the user ask for only one cf data
		var cf = null
		for (var node in data.nodes) {
			cf = data.nodes[node]
			break
		}
		if (callback) { callback(cf) }
	})
	.catch(console.log)
}

function apiReq(method, node, path, options, callback, user) {
	var headers = {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
		'o-node': node,
	}
	headers = addAuthorizationHeader(headers, user)
	var request = {
		"headers": headers,
		"method": method,
	}
	if (method == "GET") {
		path = addQueryData(path, options)
	} else {
		request["body"] = JSON.stringify(options)
        }
	fetch(path, request)
	.then(res => res.json())
	.then(data => {
		if (callback) { callback(data) }
	})
	.catch(console.log)
}

function apiReqNode(method, node, path, options, callback, user) {
	apiReq(method, node, path, options, (data) => {
		// {nodes: {n1: {...}} => {...}
		// because the user ask for only one cf data
		var _data = null
		for (var node in data.nodes) {
			_data = data.nodes[node]
			break
		}
		if (callback) { callback(_data) }
	}, user)
}

function apiPostNode(node, path, options, callback, user) {
	return apiReqNode("POST", node, path, options, callback, user)
}

function apiGetNode(node, path, options, callback, user) {
	return apiReqNode("GET", node, path, options, callback, user)
}

function apiReqAny(method, path, options, callback, user) {
	apiReqNode(method, "ANY", path, options, callback, user)
}

function apiPostAny(path, options, callback, user) {
	return apiReqNode("POST", "ANY", path, options, callback, user)
}

function apiGetAny(path, options, callback, user) {
	return apiReqNode("GET", "ANY", path, options, callback, user)
}

function apiFetchLogs(path, options, callback, user) {
	var headers = {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
		'o-node': '*'
	}
	headers = addAuthorizationHeader(headers, user)
	var request = {
		"headers": headers,
		"method": "GET",
	}
	path = addQueryData(path, options)
        fetch(path, request)
        .then(res => res.json())
        .then(data => {
                // {nodes: {n1: {...}} => {...}
                // because the user ask for only one cf data
                var _data = []
                for (var node in data.nodes) {
                        _data = _data.concat(data.nodes[node])
                }
		_data.sort((a, b) => a.t - b.t)
                if (callback) { callback(_data) }
        })
        .catch(console.log)
}

function apiObjCreate(data, callback, user) {
	var headers = {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
		'o-node': 'ANY'
	}
	headers = addAuthorizationHeader(headers, user)
	fetch('/create', {
		headers: headers,
		method: "POST",
		body: JSON.stringify(data)
	})
	.then(res => res.json())
	.then(data => {
		console.log(data)
		if (callback) { callback(data) }
	})
	.catch(console.log)
}


export {
	addQueryData,
	addAuthorizationHeader,
	parseApiResponse,
	apiNodeAction,
	apiInstanceAction,
	apiNodeSetMonitor,
	apiObjSetMonitor,
	apiObjGetConfig,
	apiObjCreate,
	apiReq,
	apiReqAny,
	apiGetAny,
	apiPostAny,
	apiGetNode,
	apiPostNode,
	apiReqNode,
	apiFetchLogs,
}
