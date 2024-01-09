import React from "react";
import useUser from "../hooks/User.jsx"
import { useStateValue } from '../state.js';
import { apiNodeAction } from "../api.js";
import { Actions, ActionsSection, ActionsItem, ActionsDivider } from './Actions.jsx';
import useApiResponse from "../hooks/ApiResponse.jsx"

import PauseCircleFilledIcon from "@mui/icons-material/PauseCircleFilled"
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline"
import InfoIcon from "@mui/icons-material/Info"
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew"
import RefreshIcon from "@mui/icons-material/Refresh"

function NodeActions(props) {
	const { auth } = useUser()
	const [{cstat}, dispatch] = useStateValue()
	const { dispatchAlerts } = useApiResponse()
	if (cstat.monitor === undefined) {
		return null
	}
	const {selected} = props
	function disable_freeze() {
		for (var node of selected) {
			var ndata = cstat.monitor.nodes[node]
			if (ndata && !ndata.frozen) {
				return false
			}
		}
		return true
	}
	function disable_thaw() {
		for (var node of selected) {
			var ndata = cstat.monitor.nodes[node]
			if (ndata && ndata.frozen) {
				return false
			}
		}
		return true
	}
	function submit(props) {
		for (var node of selected) {
			apiNodeAction(
				node,
				props.value,
				{},
				(data) => dispatchAlerts({data: data}),
				auth
			)
		}
	}

	return (
		<Actions selected={selected} title={props.title} submit={submit} fab={props.fab}>
			<ActionsSection name="safe" color="secondary" confirms={0}>
				<ActionsItem value="freeze" text="Freeze" disabled={disable_freeze()} requires={{role: "root"}}
					icon=<PauseCircleFilledIcon />
				/>
				<ActionsItem value="thaw" text="Thaw" disabled={disable_thaw()} requires={{role: "root"}}
					icon=<PauseCircleOutlineIcon />
				/>
			</ActionsSection>
			<ActionsDivider />
			<ActionsSection name="push" color="secondary" confirms={0}>
				<ActionsItem value="pushasset" text="Asset" requires={{role: "root"}}
					icon=<InfoIcon />
				/>
				<ActionsItem value="checks" text="Checks" requires={{role: "root"}}
					icon=<InfoIcon />
				/>
				<ActionsItem value="pushdisks" text="Disks" requires={{role: "root"}}
					icon=<InfoIcon />
				/>
				<ActionsItem value="pushpatch" text="Patches" requires={{role: "root"}}
					icon=<InfoIcon />
				/>
				<ActionsItem value="pushpkg" text="Packages" requires={{role: "root"}}
					icon=<InfoIcon />
				/>
				<ActionsItem value="pushstats" text="Stats" requires={{role: "root"}}
					icon=<InfoIcon />
				/>
				<ActionsItem value="sysreport" text="Sysreport" requires={{role: "root"}}
					icon=<InfoIcon />
				/>
			</ActionsSection>
			<ActionsDivider />
			<ActionsSection name="impacting" color="warning" confirms={3}>
				<ActionsItem value="daemon_restart" text="Daemon Restart" requires={{role: "root"}}
					icon=<RefreshIcon />
				/>
			</ActionsSection>
			<ActionsDivider />
			<ActionsSection name="dangerous" color="danger" confirms={6}>
				<ActionsItem value="reboot" text="Reboot" requires={{role: "root"}}
					icon=<RefreshIcon />
				/>
				<ActionsItem value="shutdown" text="Shutdown" requires={{role: "root"}}
					icon=<PowerSettingsNewIcon />
				/>
			</ActionsSection>
		</Actions>
	)
}

export {
	NodeActions
}
