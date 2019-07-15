import React from "react";
import { useStateValue } from '../state.js';

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
		<span>{live}/{target}</span>
	)
}

export {
	ObjInstanceCounts
}
