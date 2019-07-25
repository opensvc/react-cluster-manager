import React, { useState } from "react";
import { useStateValue } from '../state.js';
import { apiNodeSetMonitor } from "../api.js";
import { Actions, ActionsSection, ActionsItem } from './Actions.jsx';

function ClusterActions(props) {
	const [{cstat}, dispatch] = useStateValue();
	const cdata = cstat.monitor.nodes
	function submit(props) {
		apiNodeSetMonitor(
			props.value,
			(data) => dispatch({type: "parseApiResponse", data: data})
		)
	}

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
		<Actions title={props.title} submit={submit}>
			<ActionsSection name="safe" color="secondary" confirms={0}>
				<ActionsItem value="frozen" text="Freeze Nodes" disabled={disable_freeze()} requires={{role: "root"}} />
				<ActionsItem value="thawed" text="Thaw Nodes" disabled={disable_thaw()} requires={{role: "root"}} />
			</ActionsSection>
		</Actions>
	)
}


export {
	ClusterActions
}
