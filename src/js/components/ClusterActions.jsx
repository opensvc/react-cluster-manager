import React from "react";
import { useStateValue } from '../state.js';
import { apiNodeSetMonitor } from "../api.js";

function ClusterActionsSection(props) {
	if (props.section == "divider") {
		return (
			<div className="dropdown-divider"></div>
		)
	}
	return (
		<div className={props.section["class"]}>
			{props.section.actions.map((action, i) => (
				<ClusterAction node={props.node} action={action} />
			))}
		</div>
	)
}

function ClusterAction(props) {
	const [{}, dispatch] = useStateValue();
	function handleClick(e) {
		var target = e.target.getAttribute("value")
		apiNodeSetMonitor(target, (data) => dispatch({type: "parseApiResponse", data: data}))
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

function ClusterActions(props) {
	const [{cstat}, dispatch] = useStateValue();
	const cdata = cstat.monitor.nodes
	var actions = [
		{
			"section": "safe",
			"class": "border-left-4 border-secondary",
			"actions": [
				{
					"value": "frozen",
					"text": "Freeze Nodes",
					"disable": disable_freeze()
				},
				{
					"value": "thawed",
					"text": "Thaw Nodes",
					"disable": disable_thaw()
				}
			]
		},
	]

	function disable_freeze() {
		for (var node in cdata) {
			if (!cdata[node].frozen) {
				return false
			}
		}
		return true
	}
	function disable_thaw() {
		for (var node in cdata) {
			if (cdata[node].frozen) {
				return false
			}
		}
		return true
	}

	return (
		<div className="dropdown position-static">
			<button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Cluster Actions</button>
			<div className="dropdown-menu">
				{actions.map((section, i) => (
					<ClusterActionsSection key={i} node={props.node} path={props.path} section={section} />
				))}
			</div>
		</div>
	)
}
export {
	ClusterActions
}
