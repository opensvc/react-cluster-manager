import React from "react";
import useUser from "../hooks/User.jsx"
import { useTranslation } from "react-i18next"
import { useStateValue } from '../state.js'
import { splitPath } from '../utils.js'
import { confirmations } from '../confirmations.js'
import { apiInstanceAction } from "../api.js"
import { Actions, ActionsSection, ActionsItem, ActionsDivider } from './Actions.jsx'
import useApiResponse from "../hooks/ApiResponse.jsx"
import useObjConfirmations from '../hooks/ObjConfirmations.jsx'

import RefreshIcon from "@mui/icons-material/Refresh"
import PlayArrowIcon from "@mui/icons-material/PlayArrow"
import StopIcon from "@mui/icons-material/Stop"
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"
import DeleteIcon from "@mui/icons-material/Delete"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import PauseCircleFilledIcon from "@mui/icons-material/PauseCircleFilled"
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline"
import ShuffleIcon from "@mui/icons-material/Shuffle"
import LabelIcon from "@mui/icons-material/Label"
import ReplayIcon from "@mui/icons-material/Replay"
import SkipNextIcon from "@mui/icons-material/SkipNext"

function ObjInstanceResourceActions(props) {
	const { auth } = useUser()
	const [{cstat}, dispatch] = useStateValue()
	const { dispatchAlerts } = useApiResponse()
	const sp = splitPath(props.path)
	const {node, path, rids, title, fab} = props
	const { t } = useTranslation()
	const objConfirmations = useObjConfirmations(props.path)

	function submit(props) {
		var options = {
			"rid": rids.join(",")
		}
		if (props.value == "run") {
			options["confirm"] = true
		}
		apiInstanceAction(
			node,
			path,
			props.value,
			options,
			(data) => dispatchAlerts({data: data}),
			auth
		)
	}
	function disable_enable() {
		for (var rid of rids) {
			var rdata = cstat.monitor.nodes[node].services.status[path].resources[rid]
			if (rdata.disable) {
				return false
			}
		}
		return true
	}
	function disable_disable() {
		for (var rid of rids) {
			var rdata = cstat.monitor.nodes[node].services.status[path].resources[rid]
			if (!rdata.disable) {
				return false
			}
		}
		return true
	}
	function disable_start() {
		for (var rid of rids) {
			var rdata = cstat.monitor.nodes[node].services.status[path].resources[rid]
			if ((rdata.status != "n/a") && (rdata.status != "up")) {
				return false
			}
		}
		return true
	}
	function disable_run() {
		for (var rid of rids) {
			if (rid.match(/^task#/)) {
				return false
			}
		}
		return true
	}
	function disable_stop() {
		for (var rid of rids) {
			var rdata = cstat.monitor.nodes[node].services.status[path].resources[rid]
			if ((rdata.status != "n/a") && (rdata.status != "stdby down") && (rdata.status != "down")) {
				return false
			}
		}
		return true
	}
	function disable_provision() {
		for (var rid of rids) {
			var rdata = cstat.monitor.nodes[node].services.status[path].resources[rid]
			if (!rdata.provisioned || !rdata.provisioned.state) {
				return false
			}
		}
		return true
	}
	function disable_unprovision() {
		for (var rid of rids) {
			var rdata = cstat.monitor.nodes[node].services.status[path].resources[rid]
			if (rdata.provisioned && rdata.provisioned.state) {
				return false
			}
		}
		return true
	}

	function run_confirmations() {
		var data = []
		for (var rid of objConfirmations) {
			if (rids.indexOf(rid) < 0) {
				continue
			}
			data.push(t("I confirm {{rid}} action", {rid: rid}))
		}
		return data
	}

	function handleClick(e) {
		e.stopPropagation()
	}

	return (
		<Actions rid={rids} path={path} node={node} title={title} submit={submit} fab={fab}>
			<ActionsSection name="safe" color="secondary" confirms={0}>
				<ActionsItem value="start" text="Start" disabled={disable_start()} requires={{role: "operator", namespace: sp.namespace}}
					icon=<PlayArrowIcon />
				/>
				<ActionsItem value="restart" text="Restart" disabled={false} requires={{role: "operator", namespace: sp.namespace}}
					icon=<ReplayIcon />
				/>
				<ActionsItem value="run" text="Run" disabled={disable_run()} requires={{role: "operator", namespace: sp.namespace}}
					icon=<SkipNextIcon />
					confirmations={run_confirmations()}
				/>
				<ActionsItem value="enable" text="Enable" disabled={disable_enable()} requires={{role: "operator", namespace: sp.namespace}}
					icon=<PauseCircleOutlineIcon />
				/>
			</ActionsSection>
			<ActionsDivider />
			<ActionsSection name="impacting" color="warning" confirms={3}>
				<ActionsItem value="stop" text="Stop" disabled={disable_stop()} requires={{role: "operator", namespace: sp.namespace}}
					icon=<StopIcon />
					confirmations={[confirmations.InstanceUnavail]}
				/>
				<ActionsItem value="provision" text="Provision" disabled={disable_provision()} requires={{role: "admin", namespace: sp.namespace}}
					icon=<LabelIcon />
				/>
				<ActionsItem value="disable" text="Disable" disabled={disable_provision()} requires={{role: "operator", namespace: sp.namespace}}
					icon=<PauseCircleFilledIcon />
					confirmations={[confirmations.ResourceNoStatus]}
				/>
			</ActionsSection>
			<ActionsDivider />
			<ActionsSection name="dangerous" color="danger">
				<ActionsItem value="delete" text="Delete" requires={{role: "admin", namespace: sp.namespace}}
					icon=<DeleteIcon />
					confirmations={[confirmations.ConfigLoss]}
				/>
				<ActionsItem value="unprovision" text="Unprovision" disabled={disable_unprovision()} requires={{role: "admin", namespace: sp.namespace}}
					icon=<DeleteOutlineIcon />
					confirmations={[confirmations.DataLoss]}
				/>
			</ActionsSection>
		</Actions>
	)
}

export {
	ObjInstanceResourceActions
}
