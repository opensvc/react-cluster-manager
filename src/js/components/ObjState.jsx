import React from "react";
import { useStateValue } from '../state.js';
import { ObjAvail } from "./ObjAvail.jsx";
import { ObjOverall } from "./ObjOverall.jsx";
import { ObjFrozen } from "./ObjFrozen.jsx";
import { ObjPlacement } from "./ObjPlacement.jsx";
import { ObjProvisioned } from "./ObjProvisioned.jsx";
import { Spinner } from 'reactstrap'

function ObjActive(props) {
	const [{ cstat }, dispatch] = useStateValue();
	if (cstat.monitor === undefined) {
		return null
	}
	for (var node in cstat.monitor.nodes) {
		var idata = cstat.monitor.nodes[node].services.status[props.path]
		if (idata === undefined) {
			continue
		}
		if (idata.monitor.global_expect || (idata.monitor.status != "idle")) {
			return ( <Spinner type="grow" color="primary" size="sm" /> )
		}
	}
	return null
}

function ObjState(props) {
	const [{ cstat }, dispatch] = useStateValue();
	if (cstat.monitor === undefined) {
		return null
	}
	return (
		<div>
			<ObjActive path={props.path} />
			<ObjOverall overall={cstat.monitor.services[props.path].overall} />
			<ObjPlacement placement={cstat.monitor.services[props.path].placement} />
			<ObjFrozen frozen={cstat.monitor.services[props.path].frozen} />
			<ObjProvisioned provisioned={cstat.monitor.services[props.path].provisioned} />
		</div>
	)
}

export {
	ObjState
}
