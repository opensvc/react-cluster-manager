import React, { useState } from "react";
import { useStateValue } from '../state.js';
import { apiNodeAction } from "../api.js";
import { Actions, ActionsSection, ActionsItem, ActionsDivider } from './Actions.jsx';

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
		<Actions node={props.node} title={props.title} submit={submit}>
			<ActionsSection name="safe" color="secondary" confirms={0}>
				<ActionsItem value="freeze" text="Freeze" disabled={disable_freeze()} requires={{role: "root"}} />
				<ActionsItem value="thaw" text="Thaw" disabled={disable_thaw()} requires={{role: "root"}} />
			</ActionsSection>
			<ActionsDivider />
			<ActionsSection name="push" color="secondary" confirms={0}>
				<ActionsItem value="pushasset" text="Asset" requires={{role: "root"}} />
				<ActionsItem value="checks" text="Checks" requires={{role: "root"}} />
				<ActionsItem value="pushdisks" text="Disks" requires={{role: "root"}} />
				<ActionsItem value="pushpatch" text="Patches" requires={{role: "root"}} />
				<ActionsItem value="pushpkg" text="Packages" requires={{role: "root"}} />
				<ActionsItem value="pushstats" text="Stats" requires={{role: "root"}} />
				<ActionsItem value="sysreport" text="Sysreport" requires={{role: "root"}} />
			</ActionsSection>
			<ActionsDivider />
			<ActionsSection name="impacting" color="warning" confirms={3}>
				<ActionsItem value="daemon_restart" text="Daemon Restart" requires={{role: "root"}} />
			</ActionsSection>
			<ActionsDivider />
			<ActionsSection name="dangerous" color="danger" confirms={6}>
				<ActionsItem value="reboot" text="Reboot" requires={{role: "root"}} />
				<ActionsItem value="shutdown" text="Shutdown" requires={{role: "root"}} />
			</ActionsSection>
		</Actions>
	)
}

export {
	NodeActions
}
