import React from "react";
import { useStateValue } from '../state.js';

import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

function ObjActive(props) {
	const [{ cstat }, dispatch] = useStateValue();
	if (cstat.monitor === undefined) {
		return null
	}
	for (let node in cstat.monitor.nodes) {
		if (Object.entries(cstat.monitor.nodes[node]).length === 0) {
			continue
		}
		let services = cstat.monitor.nodes[node].services
		if (services === undefined) {
			continue
		}
		let idata = services.status[props.path]
		if (idata === undefined) {
			continue
		}
		if (idata.monitor === undefined) {
			continue
		}
		if (idata.monitor.status && (idata.monitor.status.indexOf("failed") > -1)) {
			return (
				<PlayArrowIcon color="error" />
			)
		}
		if (idata.monitor.global_expect || (idata.monitor.status !== "idle")) {
			return (
				<Typography className={props.className} component="span">
					<PlayArrowIcon color="primary" />
				</Typography>
			)
		}
	}
	return null
}

export {
	ObjActive
}
