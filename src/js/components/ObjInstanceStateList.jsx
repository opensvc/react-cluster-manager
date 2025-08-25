import React from "react";
import { useStateValue } from '../state.js';
import { ObjAvailItem } from "./ObjAvailItem.jsx";
import { ObjOverallItem } from "./ObjOverallItem.jsx";
import { ObjFrozenItem } from "./ObjFrozenItem.jsx";
import { ObjProvisionedItem } from "./ObjProvisionedItem.jsx";
import { ObjLeaderItem } from "./ObjLeaderItem.jsx";
import { MonitorStatusBadgeItem } from "./MonitorStatusBadgeItem.jsx";
import { MonitorTargetBadgeItem } from "./MonitorTargetBadgeItem.jsx";

import List from '@mui/material/List';

function ObjInstanceStateList(props) {
	const { path, node } = props
	const [{ cstat }, dispatch] = useStateValue();
	if (cstat.monitor === undefined) {
		return null
	}
    let nodeData = cstat.monitor.nodes[node]
    if (nodeData === undefined) {
        return null
    }
    let data = nodeData.services.status[path]
    if (data === undefined) {
        return null
    }

    return (
		<List dense={true}>
			<ObjAvailItem avail={data.avail} />
			<MonitorStatusBadgeItem state={data.monitor.status} />
			<MonitorTargetBadgeItem target={data.monitor.global_expect} />
			<ObjOverallItem overall={data.overall} />
			<ObjLeaderItem placement={data.monitor.placement} />
			<ObjFrozenItem frozen={data.frozen} />
			<ObjProvisionedItem provisioned={data.provisioned} />
		</List>
	)
}

export {
	ObjInstanceStateList
}
