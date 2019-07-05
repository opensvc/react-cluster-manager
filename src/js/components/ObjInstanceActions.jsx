import React from "react";
import { useStateValue } from '../state.js';
import { splitPath } from "../utils.js";
import { apiInstanceAction } from "../api.js";
import { ActionsDropdown, ActionsDropdownSection, ActionsDropdownItem, ActionsDropdownDivider } from './ActionsDropdown.jsx';


function ObjInstanceActions(props) {
	const [{cstat}, dispatch] = useStateValue();
	const sp = splitPath(props.path)
	const idata = cstat.monitor.nodes[props.node].services.status[props.path]

	function submit(props) {
		apiInstanceAction(
			props.menu.node,
			props.menu.path,
			props.value,
			{},
			(data) => dispatch({type: "parseApiResponse", data: data})
		)
	}
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

	if ((sp.kind == "svc") || (sp.kind == "vol")) {
		return (
			<ActionsDropdown path={props.path} node={props.node} title={props.title} submit={submit}>
				<ActionsDropdownSection name="safe" color="secondary" confirms={0}>
					<ActionsDropdownItem value="start" text="Start" disabled={disable_start()} requires={{role: "operator", namespace: sp.namespace}} />
					<ActionsDropdownItem value="freeze" text="Freeze" disabled={disable_freeze()} requires={{role: "operator", namespace: sp.namespace}} />
					<ActionsDropdownItem value="thaw" text="Thaw" disabled={disable_thaw()} requires={{role: "operator", namespace: sp.namespace}} />
					<ActionsDropdownItem value="enable" text="Enable" disabled={disable_enable()} requires={{role: "operator", namespace: sp.namespace}} />
					<ActionsDropdownItem value="status" text="Refresh" requires={{role: "operator", namespace: sp.namespace}} />
				</ActionsDropdownSection>
				<ActionsDropdownDivider />
				<ActionsDropdownSection name="impacting" color="warning" confirms={3}>
					<ActionsDropdownItem value="stop" text="Stop" disabled={disable_stop()} requires={{role: "operator", namespace: sp.namespace}} />
					<ActionsDropdownItem value="provision" text="Provision" disabled={disable_provision()} requires={{role: "admin", namespace: sp.namespace}} />
					<ActionsDropdownItem value="disable" text="Disable" disabled={disable_provision()} requires={{role: "operator", namespace: sp.namespace}} />
				</ActionsDropdownSection>
				<ActionsDropdownDivider />
				<ActionsDropdownSection name="dangerous" color="danger" confirms={6}>
					<ActionsDropdownItem value="purge" text="Purge" requires={{role: "admin", namespace: sp.namespace}} />
					<ActionsDropdownItem value="delete" text="Delete" requires={{role: "admin", namespace: sp.namespace}} />
					<ActionsDropdownItem value="unprovision" text="Unprovision" disabled={disable_unprovision()} requires={{role: "admin", namespace: sp.namespace}} />
				</ActionsDropdownSection>
			</ActionsDropdown>
		)
	} else if (sp.kind == "ccfg") {
		return null
	} else if (sp.kind == "cfg") {
		return (
			<ActionsDropdown path={props.path} node={props.node} title={props.title} submit={submit}>
				<ActionsDropdownSection name="dangerous" color="danger" confirms={6}>
					<ActionsDropdownItem value="delete" text="Delete" requires={{role: "admin", namespace: sp.namespace}} />
				</ActionsDropdownSection>
			</ActionsDropdown>
		)
	} else if (sp.kind == "sec") {
		return (
			<ActionsDropdown path={props.path} node={props.node} title={props.title} submit={submit}>
				<ActionsDropdownSection name="dangerous" color="danger" confirms={6}>
					<ActionsDropdownItem value="delete" text="Delete" requires={{role: "admin", namespace: sp.namespace}} />
				</ActionsDropdownSection>
			</ActionsDropdown>
		)
	} else if (sp.kind == "usr") {
		return (
			<ActionsDropdown path={props.path} node={props.node} title={props.title} submit={submit}>
				<ActionsDropdownSection name="dangerous" color="danger" confirms={6}>
					<ActionsDropdownItem value="delete" text="Delete" requires={{role: "admin", namespace: sp.namespace}} />
				</ActionsDropdownSection>
			</ActionsDropdown>
		)
	}
}

export {
	ObjInstanceActions
}



