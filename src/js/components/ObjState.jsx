import React from "react";
import { useStateValue } from '../state.js';
import { ObjAvail } from "./ObjAvail.jsx";
import { ObjOverall } from "./ObjOverall.jsx";
import { ObjFrozen } from "./ObjFrozen.jsx";
import { ObjPlacement } from "./ObjPlacement.jsx";
import { ObjProvisioned } from "./ObjProvisioned.jsx";

function ObjState(props) {
	const [{ cstat }, dispatch] = useStateValue();
	if (cstat.monitor === undefined) {
		return null
	}
	return (
		<div>
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
