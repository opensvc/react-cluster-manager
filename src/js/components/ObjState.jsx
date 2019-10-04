import React from "react";
import { useStateValue } from '../state.js';
import { ObjAvail } from "./ObjAvail.jsx";
import { ObjActive } from "./ObjActive.jsx";
import { ObjOverall } from "./ObjOverall.jsx";
import { ObjFrozen } from "./ObjFrozen.jsx";
import { ObjPlacement } from "./ObjPlacement.jsx";
import { ObjProvisioned } from "./ObjProvisioned.jsx";

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
        child: {
                marginRight: theme.spacing(1),
        },
}))

function ObjState(props) {
	const classes = useStyles()
	const [{ cstat }, dispatch] = useStateValue();
	if (cstat.monitor === undefined) {
		return null
	}
	return (
		<Grid container spacing={0}>
			<ObjAvail className={classes.child} avail={cstat.monitor.services[props.path].avail} />
			<ObjActive className={classes.child} path={props.path} />
			<ObjOverall className={classes.child} overall={cstat.monitor.services[props.path].overall} />
			<ObjPlacement className={classes.child} placement={cstat.monitor.services[props.path].placement} />
			<ObjFrozen className={classes.child} frozen={cstat.monitor.services[props.path].frozen} />
			<ObjProvisioned className={classes.child} provisioned={cstat.monitor.services[props.path].provisioned} />
		</Grid>
	)
}

export {
	ObjState
}
