import React from "react";
import { useStateValue } from '../state.js';
import { apiNodeAction } from "../api.js";

function NodeActionsSection(props) {
	if (props.section == "divider") {
		return (
			<div className="dropdown-divider"></div>
		)
	}
	return (
		<div className={props.section["class"]}>
			{props.section.actions.map((action, i) => (
				<NodeAction node={props.node} action={action} />
			))}
		</div>
	)
}

function NodeAction(props) {
	const [{}, dispatch] = useStateValue();
	function handleClick(e) {
		var action = e.target.getAttribute("value")
		apiNodeAction(props.node, action, {}, (data) => dispatch({type: "parseApiResponse", data: data}))
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

function NodeActions(props) {
	const [{cstat}, dispatch] = useStateValue();
	const ndata = cstat.monitor.nodes[props.node]
	var actions = [
		{
			"section": "safe",
			"class": "border-left-4 border-secondary",
			"actions": [
				{
					"value": "freeze",
					"text": "Freeze",
					"disable": disable_freeze()
				},
				{
					"value": "thaw",
					"text": "Thaw",
					"disable": disable_thaw()
				}
			]
		},
		"divider",
		{
			"section": "push",
			"class": "border-left-4 border-secondary",
			"actions": [
				{
					"value": "pushasset",
					"text": "Asset",
				},
				{
					"value": "checks",
					"text": "Checks",
				},
				{
					"value": "pushdisks",
					"text": "Disks",
				},
				{
					"value": "pushpatch",
					"text": "Patches",
				},
				{
					"value": "pushpkg",
					"text": "Packages",
				},
				{
					"value": "pushstats",
					"text": "Stats",
				},
				{
					"value": "sysreport",
					"text": "Sysreport",
				}
			]
		},
		"divider",
		{
			"section": "impacting",
			"class": "border-left-4 border-warning",
			"actions": [
				{
					"value": "daemon_restart",
					"text": "Daemon Restart"
				}
			]
		},
		"divider",
		{
			"section": "dangerous",
			"class": "border-left-4 border-danger",
			"actions": [
				{
					"value": "reboot",
					"text": "Reboot",
				},
				{
					"value": "shutdown",
					"text": "Shutdown",
				}
			]
		},
	]

	function disable_freeze() {
		if (ndata.frozen) {
			return true
		}
		return false
	}
	function disable_thaw() {
		if (ndata.frozen) {
			return false
		}
		return true
	}

	return (
		<div className="dropdown position-static">
			<button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
			<div className="dropdown-menu">
				{actions.map((section, i) => (
					<NodeActionsSection key={i} node={props.node} path={props.path} section={section} />
				))}
			</div>
		</div>
	)
}
export {
	NodeActions
}
