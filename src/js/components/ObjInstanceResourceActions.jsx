import React from "react";
import { useStateValue } from '../state.js';
import { splitPath } from '../utils.js';
import { apiInstanceAction } from "../api.js";
import { ActionsDropdown, ActionsDropdownSection, ActionsDropdownItem, ActionsDropdownDivider } from './ActionsDropdown.jsx';

function ObjInstanceResourceActions(props) {
	const [{cstat}, dispatch] = useStateValue();
	const rdata = cstat.monitor.nodes[props.node].services.status[props.path].resources[props.rid]
	const sp = splitPath(props.path)

	function submit(props) {
		apiInstanceAction(
			props.menu.node,
			props.menu.path,
			props.value,
			{
				"rid": props.menu.rid
			},
			(data) => dispatch({type: "parseApiResponse", data: data})
		)
	}
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
		<ActionsDropdown rid={props.rid} path={props.path} node={props.node} title={props.title} submit={submit}>
			<ActionsDropdownSection name="safe" color="secondary" confirms={0}>
				<ActionsDropdownItem value="start" text="Start" disabled={disable_start()} requires={{role: "operator", namespace: sp.namespace}} />
				<ActionsDropdownItem value="enable" text="Enable" disabled={disable_enable()} requires={{role: "operator", namespace: sp.namespace}} />
			</ActionsDropdownSection>
			<ActionsDropdownDivider />
			<ActionsDropdownSection name="impacting" color="warning" confirms={3}>
				<ActionsDropdownItem value="stop" text="Stop" disabled={disable_stop()} requires={{role: "operator", namespace: sp.namespace}} />
				<ActionsDropdownItem value="provision" text="Provision" disabled={disable_provision()} requires={{role: "admin", namespace: sp.namespace}} />
				<ActionsDropdownItem value="disable" text="Disable" disabled={disable_provision()} requires={{role: "operator", namespace: sp.namespace}} />
			</ActionsDropdownSection>
			<ActionsDropdownDivider />
			<ActionsDropdownSection name="dangerous" color="danger" confirms={6}>
				<ActionsDropdownItem value="delete" text="Delete" requires={{role: "admin", namespace: sp.namespace}} />
				<ActionsDropdownItem value="unprovision" text="Unprovision" disabled={disable_unprovision()} requires={{role: "admin", namespace: sp.namespace}} />
			</ActionsDropdownSection>
		</ActionsDropdown>
	)
}

export {
	ObjInstanceResourceActions
}
