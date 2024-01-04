import React, { useState } from "react";
import useUser from "../hooks/User.jsx"
import { useStateValue } from '../state.js';
import { apiNodeSetMonitor } from "../api.js";
import { confirmations } from "../confirmations.js";
import { Actions, ActionsSection, ActionsItem } from './Actions.jsx';
import useApiResponse from "../hooks/ApiResponse.jsx"

import PauseCircleFilledIcon from "@mui/icons-material/PauseCircleFilled"
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline"

function ClusterActions(props) {
	const { auth } = useUser()
	const [{cstat}, dispatch] = useStateValue()
	const { dispatchAlerts } = useApiResponse()
	if (cstat.monitor === undefined) {
		return null
	}
	const cdata = cstat.monitor.nodes
	function submit(props) {
		apiNodeSetMonitor(
			props.value,
			(data) => dispatchAlerts({data: data}),
			auth
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
		<Actions title={props.title} submit={submit} position={props.position} fab={props.fab}>
			<ActionsSection name="safe" color="secondary">
				<ActionsItem value="frozen" text="Freeze Nodes" disabled={disable_freeze()} requires={{role: "root"}}
					icon=<PauseCircleFilledIcon />
					confirmations={[confirmations.OrchestrationDisabled]}
				/>
				<ActionsItem value="thawed" text="Thaw Nodes" disabled={disable_thaw()} requires={{role: "root"}}
					icon=<PauseCircleOutlineIcon />
				/>
			</ActionsSection>
		</Actions>
	)
}


export {
	ClusterActions
}
