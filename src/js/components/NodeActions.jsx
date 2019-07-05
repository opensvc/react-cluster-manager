import React, { useState } from "react";
import { useStateValue } from '../state.js';
import { apiNodeAction } from "../api.js";
import { ActionsDropdown, ActionsDropdownSection, ActionsDropdownItem, ActionsDropdownDivider } from './ActionsDropdown.jsx';

function NodeActions(props) {
	const [{cstat}, dispatch] = useStateValue();
	const ndata = cstat.monitor.nodes[props.node]
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
	function submit(props) {
		apiNodeAction(props.menu.node, props.value, {}, (data) => dispatch({type: "parseApiResponse", data: data}))
	}

	return (
		<ActionsDropdown node={props.node} title={props.title} submit={submit}>
			<ActionsDropdownSection name="safe" color="secondary" confirms={0}>
				<ActionsDropdownItem value="freeze" text="Freeze" disabled={disable_freeze()} requires={{role: "root"}} />
				<ActionsDropdownItem value="thaw" text="Thaw" disabled={disable_thaw()} requires={{role: "root"}} />
			</ActionsDropdownSection>
			<ActionsDropdownDivider />
			<ActionsDropdownSection name="push" color="secondary" confirms={0}>
				<ActionsDropdownItem value="pushasset" text="Asset" requires={{role: "root"}} />
				<ActionsDropdownItem value="checks" text="Checks" requires={{role: "root"}} />
				<ActionsDropdownItem value="pushdisks" text="Disks" requires={{role: "root"}} />
				<ActionsDropdownItem value="pushpatch" text="Patches" requires={{role: "root"}} />
				<ActionsDropdownItem value="pushpkg" text="Packages" requires={{role: "root"}} />
				<ActionsDropdownItem value="pushstats" text="Stats" requires={{role: "root"}} />
				<ActionsDropdownItem value="sysreport" text="Sysreport" requires={{role: "root"}} />
			</ActionsDropdownSection>
			<ActionsDropdownDivider />
			<ActionsDropdownSection name="impacting" color="warning" confirms={3}>
				<ActionsDropdownItem value="daemon_restart" text="Daemon Restart" requires={{role: "root"}} />
			</ActionsDropdownSection>
			<ActionsDropdownDivider />
			<ActionsDropdownSection name="dangerous" color="danger" confirms={6}>
				<ActionsDropdownItem value="reboot" text="Reboot" requires={{role: "root"}} />
				<ActionsDropdownItem value="shutdown" text="Shutdown" requires={{role: "root"}} />
			</ActionsDropdownSection>
		</ActionsDropdown>
	)
}

export {
	NodeActions
}
