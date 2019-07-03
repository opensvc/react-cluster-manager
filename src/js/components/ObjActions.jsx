import React from "react";
import { useStateValue } from '../state.js';
import { apiObjSetMonitor } from "../api.js";

function ObjActionsSection(props) {
	if (props.section == "divider") {
		return (
			<div className="dropdown-divider"></div>
		)
	}
	return (
		<div className={props.section["class"]}>
			{props.section.actions.map((action, i) => (
				<ObjAction node={props.node} path={props.path} action={action} />
			))}
		</div>
	)
}

function ObjAction(props) {
	const [{}, dispatch] = useStateValue();
	function handleClick(e) {
		e.stopPropagation()
		var target = e.target.getAttribute("value")
		apiObjSetMonitor(props.path, target, (data) => dispatch({type: "parseApiResponse", data: data}))
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

function ObjActions(props) {
	const [{cstat}, dispatch] = useStateValue();
	const odata = cstat.monitor.services[props.path]
	const nInstances = nInstancesGet()
	if ((props.splitpath.kind == "svc") || (props.splitpath.kind == "vol")) {
		var actions = [
			{
				"section": "safe",
				"class": "border-left-4 border-secondary",
				"actions": [
					{
						"value": "started",
						"text": "Start",
						"disable": disable_start()
					},
					{
						"value": "frozen",
						"text": "Freeze",
						"disable": disable_freeze()
					},
					{
						"value": "thawed",
						"text": "Thaw",
						"disable": disable_thaw()
					},
					{
						"value": "placed",
						"text": "Giveback",
						"disable": disable_giveback()
					},
					{
						"value": "placed@<peer>",
						"text": "Switch",
						"disable": disable_switch()
					},
					{
						"value": "aborted",
						"text": "Abort",
						"disable": disable_abort()
					}
				]
			},
			"divider",
			{
				"section": "impacting",
				"class": "border-left-4 border-warning",
				"actions": [
					{
						"value": "stopped",
						"text": "Stop",
						"disable": disable_stop()
					},
					{
						"value": "provisioned",
						"text": "Provision",
						"disable": disable_provision()
					}
				]
			},
			"divider",
			{
				"section": "dangerous",
				"class": "border-left-4 border-danger",
				"actions": [
					{
						"value": "purged",
						"text": "Purge",
					},
					{
						"value": "deleted",
						"text": "Delete",
					},
					{
						"value": "unprovisioned",
						"text": "Unprovision",
						"disable": disable_unprovision()
					}
				]
			},
		]
	} else if (props.splitpath.kind == "ccfg") {
		var actions = [
		]
	} else if (props.splitpath.kind == "cfg") {
		var actions = [
			{
				"section": "dangerous",
				"class": "border-left-4 border-danger",
				"actions": [
					{
						"value": "deleted",
						"text": "Delete",
					}
				]
			}
		]
	} else if (props.splitpath.kind == "sec") {
		var actions = [
			{
				"section": "dangerous",
				"class": "border-left-4 border-danger",
				"actions": [
					{
						"value": "deleted",
						"text": "Delete",
					}
				]
			}
		]
	} else if (props.splitpath.kind == "usr") {
		var actions = [
			{
				"section": "dangerous",
				"class": "border-left-4 border-danger",
				"actions": [
					{
						"value": "deleted",
						"text": "Delete",
					}
				]
			}
		]
	}

	function nInstancesGet() {
		var count = 0
		for (var node in cstat.monitor.nodes) {
			if (props.path in cstat.monitor.nodes[node].services.status) {
				count++
			}
		}
		return count
	}
	function disable_freeze() {
		if (odata.frozen == "frozen") {
			return true
		}
		return false
	}
	function disable_thaw() {
		if (odata.frozen == "thawed") {
			return true
		}
		return false
	}
	function disable_start() {
		if (odata.avail in {"up": null, "n/a": null}) {
			return true
		}
		return false
	}
	function disable_giveback() {
		if (odata.avail == "n/a") {
			return true
		}
		if (nInstances == 1) {
			return true
		}
		return false
	}
	function disable_switch() {
		if (odata.avail == "n/a") {
			return true
		}
		if (nInstances == 1) {
			return true
		}
		return false
	}
	function disable_abort() {
		if (nInstances == 1) {
			return false
		}
		return true
	}
	function disable_stop() {
		if (odata.avail in {"down": null, "stdby down": null, "n/a": null}) {
			return true
		}
		return false
	}
	function disable_provision() {
		if (odata.provisioned == "mixed") {
			return false
		}
		if (odata.provisioned) {
			return true
		}
		return false
	}
	function disable_unprovision() {
		if (odata.provisioned == "mixed") {
			return false
		}
		if (!odata.provisioned) {
			return true
		}
		return false
	}
	function handleClick(e) {
		e.stopPropagation()
	}

	return (
		<div className="dropdown position-static">
			<button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onClick={handleClick}></button>
			<div className="dropdown-menu">
				{actions.map((section, i) => (
					<ObjActionsSection key={i} node={props.node} path={props.path} section={section} />
				))}
			</div>
		</div>
	)
}

export {
	ObjActions
}

