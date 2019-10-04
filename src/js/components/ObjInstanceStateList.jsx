import React from "react";
import { useStateValue } from '../state.js';
import { ObjAvailItem } from "./ObjAvailItem.jsx";
import { ObjOverallItem } from "./ObjOverallItem.jsx";
import { ObjFrozenItem } from "./ObjFrozenItem.jsx";
import { ObjProvisionedItem } from "./ObjProvisionedItem.jsx";
import { ObjLeaderItem } from "./ObjLeaderItem.jsx";
import { MonitorStatusBadgeItem } from "./MonitorStatusBadgeItem.jsx";
import { MonitorTargetBadge } from "./MonitorTargetBadge.jsx";

import List from '@material-ui/core/List';

function ObjInstanceStateList(props) {
	const { path, node } = props
	const [{ cstat }, dispatch] = useStateValue();
	if (cstat.monitor === undefined) {
		return null
	}
	var data = cstat.monitor.nodes[node].services.status[path]
	return (
		<List dense={true}>
			<ObjAvailItem avail={data.avail} />
			<ObjOverallItem overall={data.overall} />
			<ObjFrozenItem frozen={data.frozen} />
			<ObjProvisionedItem provisioned={data.provisioned} />
			<ObjLeaderItem placement={data.monitor.placement} />
			<MonitorStatusBadgeItem state={data.monitor.status} />
			<MonitorTargetBadge target={data.monitor.global_expect} />
		</List>
	)
}

export {
	ObjInstanceStateList
}
