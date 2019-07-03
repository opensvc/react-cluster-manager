import React from "react";
import { useStateValue } from '../state.js';

function ObjInstanceCounts(props) {
	const [{ cstat }, dispatch] = useStateValue();
	if (cstat.monitor === undefined) {
		return null
	}
	var live = 0
	var total = 0
	var target = 0
	var node
	for (node in cstat.monitor.nodes) {
		var nstat = cstat.monitor.nodes[node]
		var instance = nstat.services.status[props.path]
		if (!instance) {
			continue
		}
		total += 1
		if (instance.topology == "failover") {
			target = 1
		} else if (instance.topology == "flex") {
			target = instance.flex_target
		} else if (instance.topology == "scaler") {
			target = instance.scale
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
