import React, { useState } from "react";
import { useStateValue } from '../state.js';
import { splitPath } from '../utils.js';
import { apiObjSetMonitor } from "../api.js";
import { ActionsDropdown, ActionsDropdownSection, ActionsDropdownItem, ActionsDropdownDivider } from './ActionsDropdown.jsx';

function ObjActions(props) {
	const [{cstat}, dispatch] = useStateValue();
	const odata = cstat.monitor.services[props.path]
	const nInstances = nInstancesGet()
	const sp = splitPath(props.path)

	function submit(props) {
		apiObjSetMonitor(
			props.menu.path,
			props.value,
			(data) => dispatch({type: "parseApiResponse", data: data})
		)
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

	if ((props.splitpath.kind == "svc") || (props.splitpath.kind == "vol")) {
		return (
			<ActionsDropdown path={props.path} node={props.node} title={props.title} submit={submit}>
				<ActionsDropdownSection name="safe" color="secondary" confirms={0}>
					<ActionsDropdownItem value="started" text="Start" disabled={disable_start()} requires={{role: "operator", namespace: sp.namespace}} />
					<ActionsDropdownItem value="frozen" text="Freeze" disabled={disable_freeze()} requires={{role: "operator", namespace: sp.namespace}} />
					<ActionsDropdownItem value="thawed" text="Thaw" disabled={disable_thaw()} requires={{role: "operator", namespace: sp.namespace}} />
					<ActionsDropdownItem value="placed" text="Giveback" disabled={disable_giveback()} requires={{role: "operator", namespace: sp.namespace}} />
					<ActionsDropdownItem value="placed@<peer>" text="Switch" disabled={disable_switch()} requires={{role: "operator", namespace: sp.namespace}} />
					<ActionsDropdownItem value="aborted" text="Abort" disabled={disable_abort()} requires={{role: "operator", namespace: sp.namespace}} />
				</ActionsDropdownSection>
				<ActionsDropdownDivider />
				<ActionsDropdownSection name="impacting" color="warning" confirms={3}>
					<ActionsDropdownItem value="stopped" text="Stop" disabled={disable_stop()} requires={{role: "operator", namespace: sp.namespace}} />
					<ActionsDropdownItem value="provisioned" text="Provision" disabled={disable_provision()} requires={{role: "admin", namespace: sp.namespace}} />
				</ActionsDropdownSection>
				<ActionsDropdownDivider />
				<ActionsDropdownSection name="dangerous" color="danger" confirms={6}>
					<ActionsDropdownItem value="purged" text="Purge" requires={{role: "admin", namespace: sp.namespace}} />
					<ActionsDropdownItem value="deleted" text="Delete" requires={{role: "admin", namespace: sp.namespace}} />
					<ActionsDropdownItem value="unprovisioned" text="Unprovision" disabled={disable_unprovision()} requires={{role: "admin", namespace: sp.namespace}} />
				</ActionsDropdownSection>
			</ActionsDropdown>
		)
	} else if (props.splitpath.kind == "ccfg") {
		return null
	} else if (props.splitpath.kind == "cfg") {
		return (
			<ActionsDropdown path={props.path} node={props.node} title={props.title} submit={submit}>
				<ActionsDropdownSection name="dangerous" color="danger" confirms={6}>
					<ActionsDropdownItem value="deleted" text="Delete" requires={{role: "admin", namespace: sp.namespace}} />
				</ActionsDropdownSection>
			</ActionsDropdown>
		)
	} else if (props.splitpath.kind == "sec") {
		return (
			<ActionsDropdown path={props.path} node={props.node} title={props.title} submit={submit}>
				<ActionsDropdownSection name="dangerous" color="danger" confirms={6}>
					<ActionsDropdownItem value="deleted" text="Delete" requires={{role: "admin", namespace: sp.namespace}} />
				</ActionsDropdownSection>
			</ActionsDropdown>
		)
	} else if (props.splitpath.kind == "usr") {
		return (
			<ActionsDropdown path={props.path} node={props.node} title={props.title} submit={submit}>
				<ActionsDropdownSection name="dangerous" color="danger" confirms={6}>
					<ActionsDropdownItem value="deleted" text="Delete" requires={{role: "admin", namespace: sp.namespace}} />
				</ActionsDropdownSection>
			</ActionsDropdown>
		)
	}

}

export {
	ObjActions
}

