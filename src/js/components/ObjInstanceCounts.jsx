import React from "react";
import { useStateValue } from '../state.js';
import { splitPath, fmtPath } from '../utils.js'
import Typography from '@material-ui/core/Typography'
import {isEmpty} from "lodash";

function slaveInstancesCount(path, cstat) {
	let live = 0
	for (let node in cstat.monitor.nodes) {
		let nstat = cstat.monitor.nodes[node]
		let instance = nstat.services.status[path]
		if (!instance) {
			continue
		}
		if (!instance.scaler_slave) {
			continue
		}
		if (instance.avail === "up") {
			live += 1
		}
	}
	return live
}

function ObjInstanceCounts(props) {
	const [{ cstat }, dispatch] = useStateValue();
	if (cstat.monitor === undefined) {
		return null
	}
	let live = 0
	let total = 0
	let target = 0
	let sp = splitPath(props.path)
	for (let node in cstat.monitor.nodes) {
		let nstat = cstat.monitor.nodes[node]
		if (isEmpty(nstat)) {
			continue
		}
		let instance
		try {
			instance = nstat.services.status[props.path]
		} catch (e) {
			continue
		}
		if (!instance) {
			continue
		}
		if (instance.scaler_slave) {
			continue
		}

		if ("scale" in instance) {
			target = instance.scale
			for (let slavePath of instance.scaler_slaves) {
				slavePath = fmtPath(slavePath, sp.namespace, sp.kind)
				live += slaveInstancesCount(slavePath, cstat)
			}
			return (
				<span>{live}/{target}</span>
			)
		}
		total += 1
		if (instance.topology === "failover") {
			target = 1
		} else if (instance.topology === "flex") {
			target = instance.flex_target
		}
		if (instance.avail === "up") {
			live += 1
		}
	}
	if (target === 0) {
		return (<span />)
	}
	return (
		<Typography component="span">{live}/{target}</Typography>
	)
}

export {
	ObjInstanceCounts
}
