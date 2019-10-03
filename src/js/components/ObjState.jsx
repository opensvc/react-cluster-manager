import React from "react";
import { useStateValue } from '../state.js';
import { ObjAvail } from "./ObjAvail.jsx";
import { ObjOverall } from "./ObjOverall.jsx";
import { ObjFrozen } from "./ObjFrozen.jsx";
import { ObjPlacement } from "./ObjPlacement.jsx";
import { ObjProvisioned } from "./ObjProvisioned.jsx";

import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

const useStyles = makeStyles(theme => ({
        child: {
                marginRight: theme.spacing(1),
        },
	wrapper: {
		position: 'relative',
	},
	progress: {
		position: 'absolute',
		left: "-0.15em",
		zoom: 0.7,
		top: "-0.15em",
		zIndex: 1,
	},
}))

function ObjActive(props) {
	const classes = useStyles()
	const [{ cstat }, dispatch] = useStateValue();
	if (cstat.monitor === undefined) {
		return null
	}
	for (var node in cstat.monitor.nodes) {
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
					<div className={classes.wrapper}>
						<PlayArrowIcon color="primary" />
						<CircularProgress className={classes.progress} />
					</div>
				</Typography>
			)
		}
	}
	return null
}

function ObjState(props) {
	const classes = useStyles()
	const [{ cstat }, dispatch] = useStateValue();
	if (cstat.monitor === undefined) {
		return null
	}
	return (
		<Grid container spacing={0}>
			<Hidden smUp>
				<ObjAvail className={classes.child} avail={cstat.monitor.services[props.path].avail} />
			</Hidden>
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
