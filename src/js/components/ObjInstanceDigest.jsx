import React from "react";
import { useStateValue } from '../state.js';
import { ObjAvail } from "./ObjAvail.jsx";
import { ObjInstanceState } from "./ObjInstanceState.jsx";

import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';

function ObjInstanceDigest(props) {
	const [{ cstat }, dispatch] = useStateValue();
	return (
		<Table>
			<TableHead>
			</TableHead>
			<TableBody>
				<TableRow>
					<TableCell><Typography color="textSecondary">Availability</Typography></TableCell>
					<TableCell><ObjAvail avail={cstat.monitor.nodes[props.node].services.status[props.path].avail} /></TableCell>
				</TableRow>
				<TableRow>
					<TableCell><Typography color="textSecondary">State</Typography></TableCell>
					<TableCell><ObjInstanceState node={props.node} path={props.path} /></TableCell>
				</TableRow>
			</TableBody>
		</Table>
	)
}

export {
	ObjInstanceDigest
}
