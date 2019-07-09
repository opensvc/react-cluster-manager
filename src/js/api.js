import React from "react";
import { useStateValue } from './state.js';

function parseApiResponse(data, ok) {
	var alerts = []
	var date = new Date()
	console.log("parse api response", data)
	if (data.status) {
		if ("nodes" in data) {
			for (var node in data.nodes) {
				var _data = data.nodes[node]
				if (_data.status) {
					alerts.push({
						"date": date,
						"level": "danger",
						"body": (<div><strong>{node}</strong><br/><div>{_data.error}</div></div>)
					})
				}
				if (_data.info) {
					alerts.push({
						"date": date,
						"level": "dark",
						"body": (<div><strong>{node}</strong><br/><div>{_data.info}</div></div>)
					})
				}
			}
		} else {
			alerts.push({
				"date": date,
				"level": "danger",
				"body": (<div>{data.error}</div>)
			})
		}
	}
	if (data.info) {
		alerts.push({
			"date": date,
			"level": "dark",
			"body": (<div>{data.info}</div>)
		})
	}
	if (ok && (data.status == 0) && (alerts.length == 0)) {
		alerts.push({
			"date": date,
			"level": "dark",
			"body": (<div>{ok}</div>)
		})
	}
	return alerts
}

//
// API calls
//
function apiWhoAmI(callback) {
	fetch('/whoami', {
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		method: "GET",
	})
	.then(res => res.json())
	.then(data => {
		if (callback) { callback(data) }
	})
	.catch(console.log)
}

function apiNodeAction(node, action, options, callback) {
	if (!options) {
		options = {}
	}
	fetch('/node_action', {
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'o-node': node
		},
		method: "POST",
		body: JSON.stringify({
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

function apiInstanceAction(node, path, action, options, callback) {
	fetch('/service_action', {
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'o-node': node
		},
		method: "POST",
		body: JSON.stringify({
			path: path,
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

function apiNodeSetMonitor(global_expect, callback) {
	fetch('/set_node_monitor', {
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
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

function apiObjSetMonitor(path, global_expect, callback) {
	fetch('/set_service_monitor', {
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
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

function apiObjGetConfig(options, callback) {
	fetch('/get_service_config', {
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'o-node': 'ANY'
		},
		method: "POST",
		body: JSON.stringify(options)
	})
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

function apiPostAny(path, options, callback) {
	fetch(path, {
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'o-node': 'ANY'
		},
		method: "POST",
		body: JSON.stringify(options)
	})
	.then(res => res.json())
	.then(data => {
		// {nodes: {n1: {...}} => {...}
		// because the user ask for only one cf data
		var _data = null
		for (var node in data.nodes) {
			_data = data.nodes[node]
			break
		}
		if (callback) { callback(_data) }
	})
	.catch(console.log)
}

function apiObjCreate(data, callback) {
	fetch('/create', {
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'o-node': 'ANY'
		},
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
	parseApiResponse,
	apiWhoAmI,
	apiNodeAction,
	apiInstanceAction,
	apiNodeSetMonitor,
	apiObjSetMonitor,
	apiObjGetConfig,
	apiObjCreate,
	apiPostAny
}
