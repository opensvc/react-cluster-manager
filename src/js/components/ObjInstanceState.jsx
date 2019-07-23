import React from "react";
import { useStateValue } from '../state.js';
import { ObjOverall } from "./ObjOverall.jsx";
import { ObjFrozen } from "./ObjFrozen.jsx";
import { ObjProvisioned } from "./ObjProvisioned.jsx";
import { MonitorStatusBadge } from "./MonitorStatusBadge.jsx";
import { MonitorTargetBadge } from "./MonitorTargetBadge.jsx";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
        child: {
                marginRight: theme.spacing(1),
        },
}))

import Grid from '@material-ui/core/Grid';

function ObjInstanceState(props) {
	//
	// props.path
	// props.node
	//
	const [{ cstat }, dispatch] = useStateValue();
	const classes = useStyles()
	if (cstat.monitor === undefined) {
		return null
	}
	return (
		<Grid container spacing={1}>
			<ObjOverall className={classes.child} overall={cstat.monitor.nodes[props.node].services.status[props.path].overall} />
			<ObjFrozen className={classes.child} frozen={cstat.monitor.nodes[props.node].services.status[props.path].frozen} />
			<ObjProvisioned className={classes.child} provisioned={cstat.monitor.nodes[props.node].services.status[props.path].provisioned} />
			<MonitorStatusBadge className={classes.child} state={cstat.monitor.nodes[props.node].services.status[props.path].monitor.status} />
			<MonitorTargetBadge className={classes.child} target={cstat.monitor.nodes[props.node].services.status[props.path].monitor.global_expect} />
		</Grid>
	)
}

export {
	ObjInstanceState
}
