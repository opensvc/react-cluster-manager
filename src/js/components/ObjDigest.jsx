import React from "react";
import { useStateValue } from '../state.js';
import { ObjAvail } from "./ObjAvail.jsx";
import { ObjState } from "./ObjState.jsx";
import { ObjInstanceCounts } from "./ObjInstanceCounts.jsx";

import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';

function ObjDigest(props) {
	const [{ cstat }, dispatch] = useStateValue();
	if (cstat.monitor.services[props.path] === undefined) {
		return null
	}
	return (
		<Table>
			<TableHead>
			</TableHead>
			<TableBody>
				<TableRow>
					<TableCell><Typography color="textSecondary">Availability</Typography></TableCell>
					<TableCell><ObjAvail avail={cstat.monitor.services[props.path].avail} /></TableCell>
				</TableRow>
				<TableRow>
					<TableCell><Typography color="textSecondary">State</Typography></TableCell>
					<TableCell><ObjState path={props.path} /></TableCell>
				</TableRow>
				<TableRow>
					<TableCell><Typography color="textSecondary">Instances</Typography></TableCell>
					<TableCell><ObjInstanceCounts path={props.path} /></TableCell>
				</TableRow>
			</TableBody>
		</Table>
	)
}

export {
	ObjDigest
}
