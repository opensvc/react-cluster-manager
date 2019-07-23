import React from "react";
import { useStateValue } from '../state.js';
import { splitPath } from "../utils.js";
import { ObjAvail } from "./ObjAvail.jsx";
import { ObjOverall } from "./ObjOverall.jsx";
import { ObjFrozen } from "./ObjFrozen.jsx";
import { ObjProvisioned } from "./ObjProvisioned.jsx";
import { ObjActions } from "./ObjActions.jsx";
import { ObjState } from "./ObjState.jsx";
import { ObjDigest } from "./ObjDigest.jsx";
import { ObjInstanceDigest } from "./ObjInstanceDigest.jsx";
import { ObjInstanceActions } from "./ObjInstanceActions.jsx";
import { ObjInstanceCounts } from "./ObjInstanceCounts.jsx";
import { ObjInstanceResourceActions } from "./ObjInstanceResourceActions.jsx";
import { MonitorStatusBadge } from "./MonitorStatusBadge.jsx";
import { MonitorTargetBadge } from "./MonitorTargetBadge.jsx";

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

const useStyles = makeStyles(theme => ({
        root: {
                padding: theme.spacing(3, 2),
                marginTop: theme.spacing(3),
		overflowX: "scroll",
        },
}))

function ObjInstanceDetails(props) {
	//
	// props.path
	// props.node
	//
	const classes = useStyles()
	const sp = splitPath(props.path)
	return (
		<Paper className={classes.root}>
			<Typography variant="h4" component="h2">
				{props.path} @ {props.node}
			</Typography>
			<Typography variant="h5" component="h2">
				Object
			</Typography>
			<ObjActions
				path={props.path}
				splitpath={sp}
				title="Object Actions"
			/>
			<ObjDigest path={props.path} />
			<Typography variant="h5" component="h2">
				Instance
			</Typography>
			<ObjInstanceActions
				path={props.path}
				splitpath={sp}
				node={props.node}
				title="Instance Actions"
			/>
			<ObjInstanceDigest path={props.path} node={props.node} />
			<ObjInstancesResources path={props.path} node={props.node} />
		</Paper>
	)
}

function ObjInstancesResources(props) {
	//
	// props.path
	// props.node
	//
	const [{ cstat }, dispatch] = useStateValue();
	if (cstat.monitor === undefined) {
		return null
	}
	const rdata = cstat.monitor.nodes[props.node].services.status[props.path].resources
	return (
		<React.Fragment>
			<Typography variant="h5" component="h2">
				Resources
			</Typography>
			<Table>
				<TableHead>
					<TableRow className="text-secondary">
						<td>Id</td>
						<td>Availability</td>
						<td>State</td>
						<td>Desc</td>
						<td className="text-right">Actions</td>
					</TableRow>
				</TableHead>
				<TableBody>
					{Object.keys(rdata).sort().map((rid, i) => (
						<ObjInstanceResourceLine key={i} rid={rid} node={props.node} path={props.path} />
					))}
				</TableBody>
			</Table>
		</React.Fragment>
	)
}

function ObjInstanceResourceLine(props) {
	//
	// props.path
	// props.node
	// props.rid
	//
	const [{ cstat }, dispatch] = useStateValue();
	if (cstat.monitor === undefined) {
		return null
	}
	const rdata = cstat.monitor.nodes[props.node].services.status[props.path].resources[props.rid]
	if (!rdata.status) {
		return null
	}
	return (
		<TableRow>
			<TableCell>{props.rid}</TableCell>
			<TableCell><ObjAvail avail={rdata.status} /></TableCell>
			<TableCell><ObjInstanceResourceState rid={props.rid} node={props.node} path={props.path} /></TableCell>
			<TableCell>{rdata.label}</TableCell>
			<TableCell><ObjInstanceResourceActions rid={props.rid} node={props.node} path={props.path} /></TableCell>
		</TableRow>
	)
}

function ObjInstanceResourceState(props) {
	//
	// props.path
	// props.node
	// props.rid
	//
	const [{ cstat }, dispatch] = useStateValue();
	if (cstat.monitor === undefined) {
		return null
	}
	const rdata = cstat.monitor.nodes[props.node].services.status[props.path].resources[props.rid]
	// disabled
	// log warnings/errors/info
	return (
		<ObjProvisioned provisioned={rdata.provisioned && rdata.provisioned.state} />
	)
}

export {
	ObjInstanceDetails
}
