import React from "react";
import { ObjFrozen } from "./ObjFrozen.jsx";
import { MonitorStatusBadge } from "./MonitorStatusBadge.jsx";
import { MonitorTargetBadge } from "./MonitorTargetBadge.jsx";
import { NodeStateSpeaker } from "./NodeStateSpeaker.jsx";
import NodeStateSwapOverload from "./NodeStateSwapOverload.jsx"
import NodeStateMemOverload from "./NodeStateMemOverload.jsx"
import Grid from '@mui/material/Grid';
import {isEmpty} from "lodash";
import useClasses from "../hooks/useClasses.jsx";

const styles = theme => ({
        child: {
                marginRight: theme.spacing(1),
        },
})

function NodeState(props) {
	const classes = useClasses(styles)
	let status = "unknown"
	let globalExpect
	let frozen
	let speaker
	let items = []

	if (!isEmpty(props.data)) {
		if (props.data.monitor !== undefined) {
			status = props.data.monitor.status
			globalExpect = props.data.monitor.global_expect
		}
		frozen = props.data.frozen
		speaker = props.data.speaker
		items = [
			<ObjFrozen className={classes.child} frozen={frozen}/>,
			<NodeStateSpeaker className={classes.child} speaker={speaker}/>,
			<MonitorStatusBadge className={classes.child} state={status}/>,
			<MonitorTargetBadge className={classes.child} target={globalExpect}/>,
			<NodeStateMemOverload className={classes.child} data={props.data}/>,
			<NodeStateSwapOverload className={classes.child} data={props.data}/>
		]
	} else {
		items = [
			<MonitorStatusBadge className={classes.child} state="unknown"/>,
		]
	}
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
