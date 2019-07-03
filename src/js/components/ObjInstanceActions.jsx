import React from "react";
import { useStateValue } from '../state.js';
import { apiInstanceAction } from "../api.js";

function ObjInstanceActionsSection(props) {
	if (props.section == "divider") {
		return (
			<div className="dropdown-divider"></div>
		)
	}
	return (
		<div className={props.section["class"]}>
			{props.section.actions.map((action, i) => (
				<ObjInstanceAction node={props.node} path={props.path} action={action} />
			))}
		</div>
	)
}

function ObjInstanceAction(props) {
	const [{}, dispatch] = useStateValue();
	function handleClick(e) {
		e.stopPropagation()
		var action = e.target.getAttribute("value")
		apiInstanceAction(props.node, props.path, action, {}, (data) => dispatch({type: "parseApiResponse", data: data}))
	}
	if (props.action.disable) {
		return (
			<a href="#dummy" className="dropdown-item disabled" value={props.action.value}>{props.action.text}</a>
		)
	} else {
		return (
			<a href="#dummy" className="dropdown-item" value={props.action.value} onClick={handleClick}>{props.action.text}</a>
		)
	}
}

function ObjInstanceActions(props) {
	const [{cstat}, dispatch] = useStateValue();
	const idata = cstat.monitor.nodes[props.node].services.status[props.path]
	var actions = [
		{
			"section": "safe",
			"class": "border-left-4 border-secondary",
			"actions": [
				{
					"value": "start",
					"text": "Start",
					"disable": disable_start()
				},
				{
					"value": "freeze",
					"text": "Freeze",
					"disable": disable_freeze()
				},
				{
					"value": "thaw",
					"text": "Thaw",
					"disable": disable_thaw()
				},
				{
					"value": "enable",
					"text": "Enable",
					"disable": disable_thaw()
				},
				{
					"value": "status",
					"text": "Refresh",
				}
			]
		},
		"divider",
		{
			"section": "impacting",
			"class": "border-left-4 border-warning",
			"actions": [
				{
					"value": "stop",
					"text": "Stop",
					"disable": disable_stop()
				},
				{
					"value": "provision",
					"text": "Provision",
					"disable": disable_provision()
				},
				{
					"value": "disable",
					"text": "Disable",
					"disable": disable_disable()
				}
			]
		},
		"divider",
		{
			"section": "dangerous",
			"class": "border-left-4 border-danger",
			"actions": [
				{
					"value": "purge",
					"text": "Purge",
				},
				{
					"value": "delete",
					"text": "Delete",
				},
				{
					"value": "unprovision",
					"text": "Unprovision",
					"disable": disable_unprovision()
				}
			]
		},
	]

	function disable_enable() {
		if (idata.disable) {
			return false
		}
		return true
	}
	function disable_disable() {
		if (idata.disable) {
			return true
		}
		return false
	}
	function disable_freeze() {
		if (idata.frozen) {
			return true
		}
		return false
	}
	function disable_thaw() {
		if (idata.frozen) {
			return false
		}
		return true
	}
	function disable_start() {
		if (idata.avail == "up") {
			return true
		}
		return false
	}
	function disable_stop() {
		if (idata.avail == "down") {
			return true
		}
		return false
	}
	function disable_provision() {
		if (idata.provisioned) {
			return true
		}
		return false
	}
	function disable_unprovision() {
		if (!idata.provisioned) {
			return true
		}
		return false
	}

	function handleClick(e) {
		e.stopPropagation()
	}

	return (
		<div className="dropdown position-static">
			<button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onClick={handleClick}>{props.text}</button>
			<div className="dropdown-menu">
				{actions.map((section, i) => (
					<ObjInstanceActionsSection key={i} node={props.node} path={props.path} section={section} />
				))}
			</div>
		</div>
	)
}

export {
	ObjInstanceActions
}
