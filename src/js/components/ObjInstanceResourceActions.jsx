import React from "react";
import { useStateValue } from '../state.js';
import { apiInstanceAction } from "../api.js";

function ObjInstanceResourceActionsSection(props) {
	if (props.section == "divider") {
		return (
			<div className="dropdown-divider"></div>
		)
	}
	return (
		<div className={props.section["class"]}>
			{props.section.actions.map((action, i) => (
				<ObjInstanceResourceAction rid={props.rid} node={props.node} path={props.path} action={action} />
			))}
		</div>
	)
}

function ObjInstanceResourceAction(props) {
	const [{}, dispatch] = useStateValue();
	function handleClick(e) {
		e.stopPropagation()
		var action = e.target.getAttribute("value")
		apiInstanceAction(props.node, props.path, action, {"rid": props.rid}, (data) => dispatch({type: "parseApiResponse", data: data}))
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

function ObjInstanceResourceActions(props) {
	const [{cstat}, dispatch] = useStateValue();
	const rdata = cstat.monitor.nodes[props.node].services.status[props.path].resources[props.rid]
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
					"value": "enable",
					"text": "Enable",
					"disable": disable_enable()
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
		if (rdata.disable) {
			return false
		}
		return true
	}
	function disable_disable() {
		if (rdata.disable) {
			return true
		}
		return false
	}
	function disable_start() {
		if (rdata.status == "n/a") {
			return true
		}
		if (rdata.status == "up") {
			return true
		}
		return false
	}
	function disable_stop() {
		if (rdata.status == "n/a") {
			return true
		}
		if (rdata.status == "stdby down") {
			return true
		}
		if (rdata.status == "down") {
			return true
		}
		return false
	}
	function disable_provision() {
		if (rdata.provisioned && rdata.provisioned.state) {
			return true
		}
		return false
	}
	function disable_unprovision() {
		if (rdata.provisioned && rdata.provisioned.state) {
			return false
		}
		return true
	}

	function handleClick(e) {
		e.stopPropagation()
	}

	return (
		<div className="dropdown position-static">
			<button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onClick={handleClick}>{props.text}</button>
			<div className="dropdown-menu">
				{actions.map((section, i) => (
					<ObjInstanceResourceActionsSection key={i} rid={props.rid} node={props.node} path={props.path} section={section} />
				))}
			</div>
		</div>
	)
}

export {
	ObjInstanceResourceActions
}
