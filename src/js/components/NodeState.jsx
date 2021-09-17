import React from "react";
import { ObjFrozen } from "./ObjFrozen.jsx";
import { MonitorStatusBadge } from "./MonitorStatusBadge.jsx";
import { MonitorTargetBadge } from "./MonitorTargetBadge.jsx";
import { NodeStateSpeaker } from "./NodeStateSpeaker.jsx";
import NodeStateSwapOverload from "./NodeStateSwapOverload.jsx"
import NodeStateMemOverload from "./NodeStateMemOverload.jsx"

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(theme => ({
        child: {
                marginRight: theme.spacing(1),
        },
}))

function NodeState(props) {
	const classes = useStyles()
	let status
	let globalExpect
	if (Object.entries(props.data).length !== 0) {
		status = props.data.monitor.status
		globalExpect = props.data.monitor.global_expect
	}
	let items = [
		<ObjFrozen className={classes.child} frozen={props.data.frozen} />,
		<NodeStateSpeaker className={classes.child} speaker={props.data.speaker} />,
		<MonitorStatusBadge className={classes.child} state={status} />,
		<MonitorTargetBadge className={classes.child} target={globalExpect} />,
		<NodeStateMemOverload className={classes.child} data={props.data} />,
		<NodeStateSwapOverload className={classes.child} data={props.data} />
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
