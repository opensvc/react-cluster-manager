import React from "react";
import { useStateValue } from '../state.js';
import { splitPath } from "../utils.js";
import { confirmations } from "../confirmations.js";
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
import BackspaceIcon from "@material-ui/icons/Backspace"
import ReplayIcon from "@material-ui/icons/Replay"


function ObjInstanceActions(props) {
	const [{cstat}, dispatch] = useStateValue();
	const {selected} = props
        if (!cstat.monitor) {
                return null
        }
	if (selected === undefined) {
		return null
	}
	if (!selected.length) {
		return null
	}
	const sp = splitPath(selected[0].path)

	function submit(props) {
		for (var instance of selected) {
			apiInstanceAction(
				instance.node,
				instance.path,
				props.value,
				{},
				(data) => dispatch({type: "parseApiResponse", data: data})
			)
		}
	}
	function disable_clear() {
		for (var instance of selected) {
			var idata = cstat.monitor.nodes[instance.node].services.status[instance.path]
			if (idata.monitor.status && idata.monitor.status.match(/failed/)) {
				return false
			}
		}
		return true
	}
	function disable_enable() {
		for (var instance of selected) {
			var idata = cstat.monitor.nodes[instance.node].services.status[instance.path]
			if (idata.disable) {
				return false
			}
		}
		return true
	}
	function disable_disable() {
		for (var instance of selected) {
			var idata = cstat.monitor.nodes[instance.node].services.status[instance.path]
			if (!idata.disable) {
				return false
			}
		}
		return true
	}
	function disable_freeze() {
		for (var instance of selected) {
			var idata = cstat.monitor.nodes[instance.node].services.status[instance.path]
			if (!idata.frozen) {
				return false
			}
		}
		return true
	}
	function disable_thaw() {
		for (var instance of selected) {
			var idata = cstat.monitor.nodes[instance.node].services.status[instance.path]
			if (idata.frozen) {
				return false
			}
		}
		return true
	}
	function disable_start() {
		for (var instance of selected) {
			var idata = cstat.monitor.nodes[instance.node].services.status[instance.path]
			if (idata.avail != "up") {
				return false
			}
		}
		return true
	}
	function disable_stop() {
		for (var instance of selected) {
			var idata = cstat.monitor.nodes[instance.node].services.status[instance.path]
			if (idata.avail != "down") {
				return false
			}
		}
		return true
	}
	function disable_provision() {
		for (var instance of selected) {
			var idata = cstat.monitor.nodes[instance.node].services.status[instance.path]
			if (!idata.provisioned) {
				return false
			}
		}
		return true
	}
	function disable_unprovision() {
		for (var instance of selected) {
			var idata = cstat.monitor.nodes[instance.node].services.status[instance.path]
			if (idata.provisioned) {
				return false
			}
		}
		return true
	}

	function handleClick(e) {
		e.stopPropagation()
	}

	if ((sp.kind == "svc") || (sp.kind == "vol")) {
		return (
			<Actions path={props.path} node={props.node} title={props.title} submit={submit} fab={props.fab}>
				<ActionsSection name="safe" color="secondary" confirms={0}>
					<ActionsItem value="start" text="Start" disabled={disable_start()} requires={{role: "operator", namespace: sp.namespace}}
						icon=<PlayArrowIcon />
					/>
					<ActionsItem value="restart" text="Restart" disabled={false} requires={{role: "operator", namespace: sp.namespace}}
						icon=<ReplayIcon />
					/>
					<ActionsItem value="thaw" text="Thaw" disabled={disable_thaw()} requires={{role: "operator", namespace: sp.namespace}}
						icon=<PauseCircleOutlineIcon />
					/>
					<ActionsItem value="enable" text="Enable" disabled={disable_enable()} requires={{role: "operator", namespace: sp.namespace}}
						icon=<PauseCircleOutlineIcon />
					/>
					<ActionsItem value="clear" text="Clear" disabled={disable_clear()} requires={{role: "operator", namespace: sp.namespace}}
						icon=<BackspaceIcon />
					/>
					<ActionsItem value="status" text="Refresh" requires={{role: "operator", namespace: sp.namespace}}
						icon=<RefreshIcon />
					/>
				</ActionsSection>
				<ActionsDivider />
				<ActionsSection name="impacting" color="warning" confirms={3}>
					<ActionsItem value="stop" text="Stop" disabled={disable_stop()} requires={{role: "operator", namespace: sp.namespace}}
						icon=<StopIcon />
						confirmations={[confirmations.InstanceUnavail]}
					/>
					<ActionsItem value="freeze" text="Freeze" disabled={disable_freeze()} requires={{role: "operator", namespace: sp.namespace}}
						icon=<PauseCircleFilledIcon />
						confirmations={[confirmations.InstanceFailoverDisabled, confirmations.InstanceResourceMonDisabled]}
					/>
					<ActionsItem value="provision" text="Provision" disabled={disable_provision()} requires={{role: "admin", namespace: sp.namespace}}
						icon=<LabelIcon />
					/>
					<ActionsItem value="disable" text="Disable" disabled={disable_provision()} requires={{role: "operator", namespace: sp.namespace}}
						icon=<PauseCircleFilledIcon />
						confirmations={[confirmations.InstanceNoStatus]}
					/>
				</ActionsSection>
				<ActionsDivider />
				<ActionsSection name="dangerous" color="danger" confirms={6}>
					<ActionsItem value="purge" text="Purge" requires={{role: "admin", namespace: sp.namespace}}
						icon=<DeleteForeverIcon />
						confirmations={[confirmations.DataLoss, confirmations.ConfigLoss, confirmations.InstanceUnavail]}
					/>
					<ActionsItem value="delete" text="Delete" requires={{role: "admin", namespace: sp.namespace}}
						icon=<DeleteIcon />
						confirmations={[confirmations.ConfigLoss]}
					/>
					<ActionsItem value="unprovision" text="Unprovision" disabled={disable_unprovision()} requires={{role: "admin", namespace: sp.namespace}}
						icon=<DeleteOutlineIcon />
						confirmations={[confirmations.DataLoss, confirmations.InstanceUnavail]}
					/>
				</ActionsSection>
			</Actions>
		)
	} else if (sp.kind == "ccfg") {
		return null
	} else if (sp.kind == "cfg") {
		return (
			<Actions path={props.path} node={props.node} title={props.title} submit={submit} fab={props.fab}>
				<ActionsSection name="dangerous" color="danger" confirms={6}>
					<ActionsItem value="delete" text="Delete" requires={{role: "admin", namespace: sp.namespace}}
						icon=<DeleteIcon />
						confirmations={[confirmations.ConfigLoss]}
					/>
				</ActionsSection>
			</Actions>
		)
	} else if (sp.kind == "sec") {
		return (
			<Actions path={props.path} node={props.node} title={props.title} submit={submit} fab={props.fab}>
				<ActionsSection name="dangerous" color="danger" confirms={6}>
					<ActionsItem value="delete" text="Delete" requires={{role: "admin", namespace: sp.namespace}}
						icon=<DeleteIcon />
						confirmations={[confirmations.ConfigLoss]}
					/>
				</ActionsSection>
			</Actions>
		)
	} else if (sp.kind == "usr") {
		return (
			<Actions path={props.path} node={props.node} title={props.title} submit={submit} fab={props.fab}>
				<ActionsSection name="dangerous" color="danger" confirms={6}>
					<ActionsItem value="delete" text="Delete" requires={{role: "admin", namespace: sp.namespace}}
						icon=<DeleteIcon />
						confirmations={[confirmations.ConfigLoss]}
					/>
				</ActionsSection>
			</Actions>
		)
	}
}

export {
	ObjInstanceActions
}



