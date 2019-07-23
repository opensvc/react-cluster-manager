import React, { useState } from "react";
import { useStateValue } from '../state.js';
import { splitPath } from '../utils.js';
import { apiObjSetMonitor } from "../api.js";
import { ActionsDropdown, ActionsDropdownSection, ActionsDropdownItem, ActionsDropdownDivider } from './ActionsDropdown.jsx';

function ObjActions(props) {
	const [{cstat}, dispatch] = useStateValue();
	if (props.path) {
		var selected = [props.path]
	} else {
		var selected = props.selected
	}
	if (!selected) {
		const odata = cstat.monitor.services[props.path]
		const sp = splitPath(props.path)
		var namespaces = [sp.namespace]

		if (odata === undefined) {
			return null
		}

		var submit = (props) => {
			apiObjSetMonitor(
				props.menu.path,
				props.value,
				(data) => dispatch({type: "parseApiResponse", data: data})
			)
		}
		var nInstancesGet = () => {
			var count = 0
			for (var node in cstat.monitor.nodes) {
				if (props.path in cstat.monitor.nodes[node].services.status) {
					count++
				}
			}
			return count
		}
		var nInstances = nInstancesGet()
		var disable_freeze = () => {
			if (odata.frozen == "frozen") {
				return true
			}
			return false
		}
		var disable_thaw = () => {
			if (odata.frozen == "thawed") {
				return true
			}
			return false
		}
		var disable_start = () => {
			if (odata.avail in {"up": null, "n/a": null}) {
				return true
			}
			return false
		}
		var disable_giveback = () => {
			if (odata.avail == "n/a") {
				return true
			}
			if (nInstances == 1) {
				return true
			}
			return false
		}
		var disable_switch = () => {
			if (odata.avail == "n/a") {
				return true
			}
			if (nInstances == 1) {
				return true
			}
			return false
		}
		var disable_abort = () => {
			if (nInstances == 1) {
				return false
			}
			return true
		}
		var disable_stop = () => {
			if (odata.avail in {"down": null, "stdby down": null, "n/a": null}) {
				return true
			}
			return false
		}
		var disable_provision = () => {
			if (odata.provisioned == "mixed") {
				return false
			}
			if (odata.provisioned) {
				return true
			}
			return false
		}
		var disable_unprovision = () => {
			if (odata.provisioned == "mixed") {
				return false
			}
			if (!odata.provisioned) {
				return true
			}
			return false
		}
		var path = props.path
		var kinds = [props.splitpath.kind]
	} else {
		var path = selected.join(",")
		var kinds = ["svc"]
		var namespaces = []
		for (var p of selected) {
			var sp = splitPath(p)
			if (namespaces.indexOf(sp.namespace) < 0) {
				namespaces.push(sp.namespace)
			}
		}
		var submit = (props) => {
			for (var p of selected) {
				apiObjSetMonitor(
					p,
					props.value,
					(data) => dispatch({type: "parseApiResponse", data: data})
				)
			}
		}
		var disable_freeze = () => {
			return false
		}
		var disable_thaw = () => {
			return false
		}
		var disable_start = () => {
			return false
		}
		var disable_giveback = () => {
			return false
		}
		var disable_switch = () => {
			return false
		}
		var disable_abort = () => {
			return true
		}
		var disable_stop = () => {
			return false
		}
		var disable_provision = () => {
			return false
		}
		var disable_unprovision = () => {
			return false
		}
	}

	if ((kinds.indexOf("svc") > -1) || (kinds.indexOf("vol") > -1)) {
		return (
			<ActionsDropdown path={path} node={props.node} title={props.title} submit={submit}>
				<ActionsDropdownSection name="safe" color="secondary" confirms={0}>
					<ActionsDropdownItem value="started" text="Start" disabled={disable_start()} requires={{role: "operator", namespace: namespaces}} />
					<ActionsDropdownItem value="frozen" text="Freeze" disabled={disable_freeze()} requires={{role: "operator", namespace: namespaces}} />
					<ActionsDropdownItem value="thawed" text="Thaw" disabled={disable_thaw()} requires={{role: "operator", namespace: namespaces}} />
					<ActionsDropdownItem value="placed" text="Giveback" disabled={disable_giveback()} requires={{role: "operator", namespace: namespaces}} />
					<ActionsDropdownItem value="placed@<peer>" text="Switch" disabled={disable_switch()} requires={{role: "operator", namespace: namespaces}} />
					<ActionsDropdownItem value="aborted" text="Abort" disabled={disable_abort()} requires={{role: "operator", namespace: namespaces}} />
				</ActionsDropdownSection>
				<ActionsDropdownDivider />
				<ActionsDropdownSection name="impacting" color="warning" confirms={3}>
					<ActionsDropdownItem value="stopped" text="Stop" disabled={disable_stop()} requires={{role: "operator", namespace: namespaces}} />
					<ActionsDropdownItem value="provisioned" text="Provision" disabled={disable_provision()} requires={{role: "admin", namespace: namespaces}} />
				</ActionsDropdownSection>
				<ActionsDropdownDivider />
				<ActionsDropdownSection name="dangerous" color="danger" confirms={6}>
					<ActionsDropdownItem value="purged" text="Purge" requires={{role: "admin", namespace: namespaces}} />
					<ActionsDropdownItem value="deleted" text="Delete" requires={{role: "admin", namespace: namespaces}} />
					<ActionsDropdownItem value="unprovisioned" text="Unprovision" disabled={disable_unprovision()} requires={{role: "admin", namespace: namespaces}} />
				</ActionsDropdownSection>
			</ActionsDropdown>
		)
	} else if (kinds.indexOf("ccfg") > -1) {
		return null
	} else if (kinds.indexOf("cfg") > -1) {
		return (
			<ActionsDropdown path={path} node={props.node} title={props.title} submit={submit}>
				<ActionsDropdownSection name="dangerous" color="danger" confirms={6}>
					<ActionsDropdownItem value="deleted" text="Delete" requires={{role: "admin", namespace: namespaces}} />
				</ActionsDropdownSection>
			</ActionsDropdown>
		)
	} else if (kinds.indexOf("sex") > -1) {
		return (
			<ActionsDropdown path={path} node={props.node} title={props.title} submit={submit}>
				<ActionsDropdownSection name="dangerous" color="danger" confirms={6}>
					<ActionsDropdownItem value="deleted" text="Delete" requires={{role: "admin", namespace: namespaces}} />
				</ActionsDropdownSection>
			</ActionsDropdown>
		)
	} else if (kinds.indexOf("usr") > -1) {
		return (
			<ActionsDropdown path={path} node={props.node} title={props.title} submit={submit}>
				<ActionsDropdownSection name="dangerous" color="danger" confirms={6}>
					<ActionsDropdownItem value="deleted" text="Delete" requires={{role: "admin", namespace: namespaces}} />
				</ActionsDropdownSection>
			</ActionsDropdown>
		)
	}

}

export {
	ObjActions
}

