import React from "react";
import { useStateValue } from '../state.js';
import { ObjOverall } from "./ObjOverall.jsx";
import { ObjFrozen } from "./ObjFrozen.jsx";
import { ObjProvisioned } from "./ObjProvisioned.jsx";
import { MonitorStatusBadge } from "./MonitorStatusBadge.jsx";
import { MonitorTargetBadge } from "./MonitorTargetBadge.jsx";

function ObjInstanceState(props) {
	//
	// props.path
	// props.node
	//
	const [{ cstat }, dispatch] = useStateValue();
	if (cstat.monitor === undefined) {
		return null
	}
	return (
		<div>
			<ObjOverall overall={cstat.monitor.nodes[props.node].services.status[props.path].overall} />
			<ObjFrozen frozen={cstat.monitor.nodes[props.node].services.status[props.path].frozen} />
			<ObjProvisioned provisioned={cstat.monitor.nodes[props.node].services.status[props.path].provisioned} />
			<MonitorStatusBadge state={cstat.monitor.nodes[props.node].services.status[props.path].monitor.status} />
			<MonitorTargetBadge target={cstat.monitor.nodes[props.node].services.status[props.path].monitor.global_expect} />
		</div>
	)
}

export {
	ObjInstanceState
}
