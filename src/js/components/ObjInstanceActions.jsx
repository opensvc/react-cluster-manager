import React from "react";
import { useStateValue } from '../state.js';
import { splitPath } from "../utils.js";
import { apiInstanceAction } from "../api.js";
import { Actions, ActionsSection, ActionsItem, ActionsDivider } from './Actions.jsx';


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
			<Actions path={props.path} node={props.node} title={props.title} submit={submit}>
				<ActionsSection name="safe" color="secondary" confirms={0}>
					<ActionsItem value="start" text="Start" disabled={disable_start()} requires={{role: "operator", namespace: sp.namespace}} />
					<ActionsItem value="freeze" text="Freeze" disabled={disable_freeze()} requires={{role: "operator", namespace: sp.namespace}} />
					<ActionsItem value="thaw" text="Thaw" disabled={disable_thaw()} requires={{role: "operator", namespace: sp.namespace}} />
					<ActionsItem value="enable" text="Enable" disabled={disable_enable()} requires={{role: "operator", namespace: sp.namespace}} />
					<ActionsItem value="status" text="Refresh" requires={{role: "operator", namespace: sp.namespace}} />
				</ActionsSection>
				<ActionsDivider />
				<ActionsSection name="impacting" color="warning" confirms={3}>
					<ActionsItem value="stop" text="Stop" disabled={disable_stop()} requires={{role: "operator", namespace: sp.namespace}} />
					<ActionsItem value="provision" text="Provision" disabled={disable_provision()} requires={{role: "admin", namespace: sp.namespace}} />
					<ActionsItem value="disable" text="Disable" disabled={disable_provision()} requires={{role: "operator", namespace: sp.namespace}} />
				</ActionsSection>
				<ActionsDivider />
				<ActionsSection name="dangerous" color="danger" confirms={6}>
					<ActionsItem value="purge" text="Purge" requires={{role: "admin", namespace: sp.namespace}} />
					<ActionsItem value="delete" text="Delete" requires={{role: "admin", namespace: sp.namespace}} />
					<ActionsItem value="unprovision" text="Unprovision" disabled={disable_unprovision()} requires={{role: "admin", namespace: sp.namespace}} />
				</ActionsSection>
			</Actions>
		)
	} else if (sp.kind == "ccfg") {
		return null
	} else if (sp.kind == "cfg") {
		return (
			<Actions path={props.path} node={props.node} title={props.title} submit={submit}>
				<ActionsSection name="dangerous" color="danger" confirms={6}>
					<ActionsItem value="delete" text="Delete" requires={{role: "admin", namespace: sp.namespace}} />
				</ActionsSection>
			</Actions>
		)
	} else if (sp.kind == "sec") {
		return (
			<Actions path={props.path} node={props.node} title={props.title} submit={submit}>
				<ActionsSection name="dangerous" color="danger" confirms={6}>
					<ActionsItem value="delete" text="Delete" requires={{role: "admin", namespace: sp.namespace}} />
				</ActionsSection>
			</Actions>
		)
	} else if (sp.kind == "usr") {
		return (
			<Actions path={props.path} node={props.node} title={props.title} submit={submit}>
				<ActionsSection name="dangerous" color="danger" confirms={6}>
					<ActionsItem value="delete" text="Delete" requires={{role: "admin", namespace: sp.namespace}} />
				</ActionsSection>
			</Actions>
		)
	}
}

export {
	ObjInstanceActions
}



