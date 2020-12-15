import React from "react";
import { useStateValue } from '../state.js';
import { splitPath, fmtPath } from '../utils.js'
import Typography from '@material-ui/core/Typography'

function slaveInstancesCount(path, cstat) {
	var live = 0
	for (var node in cstat.monitor.nodes) {
		var nstat = cstat.monitor.nodes[node]
		var instance = nstat.services.status[path]
		if (!instance) {
			continue
		}
		if (!instance.scaler_slave) {
			continue
		}
		if (instance.avail == "up") {
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
	var live = 0
	var total = 0
	var target = 0
	var sp = splitPath(props.path)
	for (var node in cstat.monitor.nodes) {
		var nstat = cstat.monitor.nodes[node]
		var instance = nstat.services.status[props.path]
		if (!instance) {
			continue
		}
		if (instance.scaler_slave) {
			continue
		}

		if ("scale" in instance) {
			target = instance.scale
			for (var slavePath of instance.scaler_slaves) {
				slavePath = fmtPath(slavePath, sp.namespace, sp.kind)
				live += slaveInstancesCount(slavePath, cstat)
			}
			return (
				<span>{live}/{target}</span>
			)
		}
		total += 1
		if (instance.topology == "failover") {
			target = 1
		} else if (instance.topology == "flex") {
			target = instance.flex_target
		}
		if (instance.avail == "up") {
			live += 1
		}
	}
	if (target == 0) {
		return (<span />)
	}
	return (
		<Typography component="span">{live}/{target}</Typography>
	)
}

export {
	ObjInstanceCounts
}
