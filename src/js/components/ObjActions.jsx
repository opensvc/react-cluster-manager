import React, { useState } from "react";
import { useStateValue } from '../state.js';
import { splitPath } from '../utils.js';
import { apiObjSetMonitor } from "../api.js";
import { Actions, ActionsSection, ActionsItem, ActionsDivider } from './Actions.jsx';

import CancelIcon from "@material-ui/icons/Cancel"
import PlayArrowIcon from "@material-ui/icons/PlayArrow"
import StopIcon from "@material-ui/icons/Stop"
import DeleteForeverIcon from "@material-ui/icons/DeleteForever"
import DeleteIcon from "@material-ui/icons/Delete"
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline"
import PauseCircleFilledIcon from "@material-ui/icons/PauseCircleFilled"
import PauseCircleOutlineIcon from "@material-ui/icons/PauseCircleOutline"
import ShuffleIcon from "@material-ui/icons/Shuffle"
import LabelIcon from "@material-ui/icons/Label"

function ObjActions(props) {
	const [{cstat}, dispatch] = useStateValue();
	if (cstat.monitor === undefined) {
		return null
	}
	var path = props.path
	if (path) {
		var selected = [props.path]
	} else {
		var selected = props.selected
		if (selected.length == 1) {
			path = selected[0]
		}
	}
	if (path) {
		const odata = cstat.monitor.services[path]
		const sp = splitPath(path)
		var namespaces = [sp.namespace]

		if (odata === undefined) {
			return null
		}

		var submit = (props) => {
			apiObjSetMonitor(
				path,
				props.value,
				(data) => dispatch({type: "parseApiResponse", data: data})
			)
		}
		var nInstancesGet = () => {
			var count = 0
			for (var node in cstat.monitor.nodes) {
				if (path in cstat.monitor.nodes[node].services.status) {
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
		var kinds = [sp.kind]
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
			<Actions path={path} node={props.node} title={props.title} submit={submit} fab={props.fab}>
				<ActionsSection name="safe" color="secondary" confirms={0}>
					<ActionsItem value="started" text="Start" disabled={disable_start()} requires={{role: "operator", namespace: namespaces}}
						icon=<PlayArrowIcon />
					/>
					<ActionsItem value="frozen" text="Freeze" disabled={disable_freeze()} requires={{role: "operator", namespace: namespaces}}
						icon=<PauseCircleFilledIcon />
					/>
					<ActionsItem value="thawed" text="Thaw" disabled={disable_thaw()} requires={{role: "operator", namespace: namespaces}}
						icon=<PauseCircleOutlineIcon />
					/>
					<ActionsItem value="placed" text="Giveback" disabled={disable_giveback()} requires={{role: "operator", namespace: namespaces}}
						icon=<ShuffleIcon />
					/>
					<ActionsItem value="placed@<peer>" text="Switch" disabled={disable_switch()} requires={{role: "operator", namespace: namespaces}}
						icon=<ShuffleIcon />
					/>
					<ActionsItem value="aborted" text="Abort" disabled={disable_abort()} requires={{role: "operator", namespace: namespaces}}
						icon=<CancelIcon />
					/>
				</ActionsSection>
				<ActionsDivider />
				<ActionsSection name="impacting" color="warning" confirms={3}>
					<ActionsItem value="stopped" text="Stop" disabled={disable_stop()} requires={{role: "operator", namespace: namespaces}}
						icon=<StopIcon />
					/>
					<ActionsItem value="provisioned" text="Provision" disabled={disable_provision()} requires={{role: "admin", namespace: namespaces}}
						icon=<LabelIcon />
					/>
				</ActionsSection>
				<ActionsDivider />
				<ActionsSection name="dangerous" color="danger" confirms={6}>
					<ActionsItem value="purged" text="Purge" requires={{role: "admin", namespace: namespaces}}
						icon=<DeleteForeverIcon />
					/>
					<ActionsItem value="unprovisioned" text="Unprovision" disabled={disable_unprovision()} requires={{role: "admin", namespace: namespaces}}
						icon=<DeleteIcon />
					/>
					<ActionsItem value="deleted" text="Delete" requires={{role: "admin", namespace: namespaces}}
						icon=<DeleteOutlineIcon />
					/>
				</ActionsSection>
			</Actions>
		)
	} else if (kinds.indexOf("ccfg") > -1) {
		return null
	} else if (kinds.indexOf("cfg") > -1) {
		return (
			<Actions path={path} node={props.node} title={props.title} submit={submit} fab={props.fab}>
				<ActionsSection name="dangerous" color="danger" confirms={6}>
					<ActionsItem value="deleted" text="Delete" requires={{role: "admin", namespace: namespaces}}
						icon=<DeleteOutlineIcon />
					/>
				</ActionsSection>
			</Actions>
		)
	} else if (kinds.indexOf("sec") > -1) {
		return (
			<Actions path={path} node={props.node} title={props.title} submit={submit} fab={props.fab}>
				<ActionsSection name="dangerous" color="danger" confirms={6}>
					<ActionsItem value="deleted" text="Delete" requires={{role: "admin", namespace: namespaces}}
						icon=<DeleteOutlineIcon />
					/>
				</ActionsSection>
			</Actions>
		)
	} else if (kinds.indexOf("usr") > -1) {
		return (
			<Actions path={path} node={props.node} title={props.title} submit={submit} fab={props.fab}>
				<ActionsSection name="dangerous" color="danger" confirms={6}>
					<ActionsItem value="deleted" text="Delete" requires={{role: "admin", namespace: namespaces}}
						icon=<DeleteOutlineIcon />
					/>
				</ActionsSection>
			</Actions>
		)
	}

}

export {
	ObjActions
}

