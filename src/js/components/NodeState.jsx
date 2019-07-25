import React from "react";
import { ObjFrozen } from "./ObjFrozen.jsx";
import { MonitorStatusBadge } from "./MonitorStatusBadge.jsx";
import { MonitorTargetBadge } from "./MonitorTargetBadge.jsx";
import { NodeStateSpeaker } from "./NodeStateSpeaker.jsx";

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(theme => ({
        child: {
                marginRight: theme.spacing(1),
        },
}))

function NodeState(props) {
	const classes = useStyles()
	var items = [
		<ObjFrozen className={classes.child} frozen={props.data.frozen} />,
		<NodeStateSpeaker className={classes.child} speaker={props.data.speaker} />,
		<MonitorStatusBadge className={classes.child} state={props.data.monitor.status} />,
		<MonitorTargetBadge className={classes.child} target={props.data.monitor.global_expect} />
	]
	return (
		<Grid container spacing={0}>
			{items.map((item, i) => {
				if (!item) {
					return null
				}
				return (
					<Grid item key={i}>
						{item}
					</Grid>
				)
			})}
		</Grid>
	)
}

export {
	NodeState,
}
