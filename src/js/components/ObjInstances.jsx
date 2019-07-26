import React, { useState } from "react";

import { useStateValue } from '../state.js';
import { fmtPath, splitPath } from "../utils.js";
import { ObjAvail } from "./ObjAvail.jsx";
import { ObjInstanceState } from "./ObjInstanceState.jsx";

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

const useStyles = makeStyles(theme => ({
        tableWrapper: {
                overflowX: 'auto',
        },
}))

function ObjInstances(props) {
	//
	// props.path
	//
	const classes = useStyles()
	const [{ cstat }, dispatch] = useStateValue();
	const sp = splitPath(props.path)
	if (cstat.monitor === undefined) {
		return null
	}
	if (cstat.monitor.services[props.path] === undefined) {
		return null
	}
	if ("scale" in cstat.monitor.services[props.path]) {
		var slice = <TableCell>Slice</TableCell>
	} else {
		var slice
	}
	return (
		<div>
			<Typography variant="h5" component="h3">
				Instances
			</Typography>
			<div className={classes.tableWrapper}>
				<table className="table table-hover">
					<TableHead>
						<TableRow className="text-secondary">
							{slice}
							<TableCell>Node</TableCell>
							<TableCell>Availability</TableCell>
							<TableCell>State</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{Object.keys(cstat.monitor.nodes).sort().map((node) => (
							<InstanceLine key={node} node={node} path={props.path} sp={sp} />
						))}
					</TableBody>
				</table>
			</div>
		</div>
	)
}

function InstanceLine(props) {
	//
	// props.path
	// props.node
	//
	const [{ cstat }, dispatch] = useStateValue();
	if (cstat.monitor === undefined) {
		return null
	}
	const instance = cstat.monitor.nodes[props.node].services.status[props.path]
	if (!instance) {
		return null
	}
	if ("scaler_slaves" in instance) {
		var slavePaths = []
		const re = RegExp("^"+fmtPath("[0-9]+\."+props.sp.name, props.sp.namespace, props.sp.kind)+"$")
		for (var path in cstat.monitor.services) {
			if (path.match(re)) {
				slavePaths.push(path)
			}
		}
		return slavePaths.sort().map((slavePath) => {
			var slaveSp = splitPath(slavePath)
			return ( <InstanceLine key={props.node+"-"+slavePath} node={props.node} path={slavePath} sp={slaveSp} slice={true} /> )
		})
	}
	function handleClick(e) {
		dispatch({
			type: "setNav",
			page: "ObjectInstance",
			links: ["Objects", props.path, props.node]
		})
	}
	if (props.slice) {
		var n = splitPath(props.path).name.replace(/\..*$/, "")
		var slice = <TableCell>{n}</TableCell>
	} else {
		var slice
	}
	return (
		<TableRow onClick={handleClick}>
			{slice}
			<TableCell>{props.node}</TableCell>
			<TableCell><ObjAvail avail={cstat.monitor.nodes[props.node].services.status[props.path].avail} /></TableCell>
			<TableCell><ObjInstanceState node={props.node} path={props.path} /></TableCell>
		</TableRow>
	)
}

export {
	ObjInstances,
}
