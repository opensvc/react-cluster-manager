import React from "react";
import { useStateValue } from '../state.js';
import { ObjOverall } from "./ObjOverall.jsx";
import { ObjFrozen } from "./ObjFrozen.jsx";
import { ObjAvail } from "./ObjAvail.jsx";
import { ObjLeader } from "./ObjLeader.jsx";
import { ObjProvisioned } from "./ObjProvisioned.jsx";
import { MonitorStatusBadge } from "./MonitorStatusBadge.jsx";
import { MonitorTargetBadge } from "./MonitorTargetBadge.jsx";
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(theme => ({
        child: {
                marginRight: theme.spacing(1),
        },
}))

import Grid from '@mui/material/Grid';

function ObjInstanceState(props) {
	//
	// props.path
	// props.node
	//
	const [{ cstat }, dispatch] = useStateValue();
	const classes = useStyles()
	if (cstat.monitor === undefined) {
		return (
			<Grid container spacing={1}>
				<MonitorStatusBadge className={classes.child} state="unkown" />
			</Grid>
		)
	}
	return (
		<Grid container spacing={1}>
			<ObjAvail className={classes.child} avail={cstat.monitor.nodes[props.node].services.status[props.path].avail} />
			<ObjOverall className={classes.child} overall={cstat.monitor.nodes[props.node].services.status[props.path].overall} />
			<ObjFrozen className={classes.child} frozen={cstat.monitor.nodes[props.node].services.status[props.path].frozen} />
			<ObjProvisioned className={classes.child} provisioned={cstat.monitor.nodes[props.node].services.status[props.path].provisioned} />
			<ObjLeader className={classes.child} placement={cstat.monitor.nodes[props.node].services.status[props.path].monitor.placement} />
			<MonitorStatusBadge className={classes.child} state={cstat.monitor.nodes[props.node].services.status[props.path].monitor.status} />
			<MonitorTargetBadge className={classes.child} target={cstat.monitor.nodes[props.node].services.status[props.path].monitor.global_expect} />
		</Grid>
	)
}

export {
	ObjInstanceState
}
