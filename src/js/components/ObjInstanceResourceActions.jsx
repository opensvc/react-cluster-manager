import React from "react";
import { useReactOidc } from '@axa-fr/react-oidc-context'
import { useStateValue } from '../state.js';
import { splitPath } from '../utils.js';
import { confirmations } from '../confirmations.js';
import { apiInstanceAction } from "../api.js";
import { Actions, ActionsSection, ActionsItem, ActionsDivider } from './Actions.jsx';

import RefreshIcon from "@material-ui/icons/Refresh"
import PlayArrowIcon from "@material-ui/icons/PlayArrow"
import StopIcon from "@material-ui/icons/Stop"
import DeleteForeverIcon from "@material-ui/icons/DeleteForever"
import DeleteIcon from "@material-ui/icons/Delete"
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline"
import PauseCircleFilledIcon from "@material-ui/icons/PauseCircleFilled"
import PauseCircleOutlineIcon from "@material-ui/icons/PauseCircleOutline"
import ShuffleIcon from "@material-ui/icons/Shuffle"
import LabelIcon from "@material-ui/icons/Label"
import ReplayIcon from "@material-ui/icons/Replay"
import SkipNextIcon from "@material-ui/icons/SkipNext"

function ObjInstanceResourceActions(props) {
	const { oidcUser } = useReactOidc()
	const [{cstat}, dispatch] = useStateValue();
	const sp = splitPath(props.path)
	const {node, path, rids, title, fab} = props

	function submit(props) {
		apiInstanceAction(
			node,
			path,
			props.value,
			{
				"rid": rids.join(",")
			},
			(data) => dispatch({type: "parseApiResponse", data: data}),
			oidcUser
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
