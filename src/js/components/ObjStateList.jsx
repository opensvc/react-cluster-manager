import React from "react";
import { useStateValue } from '../state.js';
import { ObjAvailItem } from "./ObjAvailItem.jsx";
import { ObjActiveItem } from "./ObjActiveItem.jsx";
import { ObjOverallItem } from "./ObjOverallItem.jsx";
import { ObjFrozenItem } from "./ObjFrozenItem.jsx";
import { ObjPlacementItem } from "./ObjPlacementItem.jsx";
import { ObjProvisionedItem } from "./ObjProvisionedItem.jsx";

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

function ObjStateList(props) {
	const [{ cstat }, dispatch] = useStateValue();
	if (cstat.monitor === undefined) {
		return null
	}
	return (
		<List dense={true}>
			<ObjAvailItem avail={cstat.monitor.services[props.path].avail} />
			<ObjActiveItem path={props.path} />
			<ObjOverallItem overall={cstat.monitor.services[props.path].overall} />
			<ObjPlacementItem placement={cstat.monitor.services[props.path].placement} />
			<ObjFrozenItem frozen={cstat.monitor.services[props.path].frozen} />
			<ObjProvisionedItem provisioned={cstat.monitor.services[props.path].provisioned} />
		</List>
	)
}

export {
	ObjStateList
}
