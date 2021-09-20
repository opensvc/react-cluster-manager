import React from "react";
import { useStateValue } from '../state.js';

import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

function ObjActive(props) {
	const [{ cstat }, dispatch] = useStateValue();
	if (cstat.monitor === undefined) {
		return null
	}
	for (var node in cstat.monitor.nodes) {
		if (Object.entries(cstat.monitor.nodes[node]).length === 0) {
			continue
		}
		var idata = cstat.monitor.nodes[node].services.status[props.path]
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
		if (idata.monitor.global_expect || (idata.monitor.status != "idle")) {
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
