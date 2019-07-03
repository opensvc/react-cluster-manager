import React from "react";
import { useStateValue } from '../state.js';
import { splitPath } from "../utils.js";
import { ObjAvail } from "./ObjAvail.jsx";
import { ObjState } from "./ObjState.jsx";
import { ObjInstanceCounts } from "./ObjInstanceCounts.jsx";

function ObjDigest(props) {
	const [{ cstat }, dispatch] = useStateValue();
	const sp = splitPath(props.path)
	return (
		<div className="table-responsive">
			<table className="table table-hover">
				<thead>
				</thead>
				<tbody>
					<tr>
						<td className="text-secondary">Availability</td>
						<td><ObjAvail avail={cstat.monitor.services[props.path].avail} /></td>
					</tr>
					<tr>
						<td className="text-secondary">State</td>
						<td><ObjState path={props.path} /></td>
					</tr>
					<tr>
						<td className="text-secondary">Instances</td>
						<td><ObjInstanceCounts path={props.path} /></td>
					</tr>
				</tbody>
			</table>
		</div>
	)
}

export {
	ObjDigest
}
