import React from "react";
import { useStateValue } from '../state.js';
import { ObjFrozenItem } from "./ObjFrozenItem.jsx";
import { MonitorStatusBadgeItem } from "./MonitorStatusBadgeItem.jsx";
import { MonitorTargetBadgeItem } from "./MonitorTargetBadgeItem.jsx";
import { NodeStateSpeakerItem } from "./NodeStateSpeakerItem.jsx";
import { NodeStateVersionItem } from "./NodeStateVersionItem.jsx";
import { NodeStateCompatItem } from "./NodeStateCompatItem.jsx";
import NodeStateMemOverloadItem from "./NodeStateMemOverloadItem.jsx";
import NodeStateSwapOverloadItem from "./NodeStateSwapOverloadItem.jsx";

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

function NodeStateList(props) {
	const [{ cstat }, dispatch] = useStateValue();
	if (cstat.monitor === undefined) {
		return null
	}
	const data = cstat.monitor.nodes[props.name]
	if ((data === undefined) || (data.monitor === undefined)) {
		return (
			<List dense={true}>
				<MonitorStatusBadgeItem state={"unknown"} />
			</List>
		)
	}
	return (
		<List dense={true}>
			<ObjFrozenItem frozen={data.frozen} />
			<NodeStateSpeakerItem speaker={data.speaker} />
			<MonitorStatusBadgeItem state={data.monitor.status} />
			<MonitorTargetBadgeItem target={data.monitor.global_expect} />
			<NodeStateMemOverloadItem data={data} />
			<NodeStateSwapOverloadItem data={data} />
			<NodeStateCompatItem />
			<NodeStateVersionItem />
		</List>
	)
}

export {
	NodeStateList
}
