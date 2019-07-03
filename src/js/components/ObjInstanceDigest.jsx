import React from "react";
import { useStateValue } from '../state.js';
import { splitPath } from "../utils.js";
import { ObjAvail } from "./ObjAvail.jsx";
import { ObjInstanceState } from "./ObjInstanceState.jsx";

function ObjInstanceDigest(props) {
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
						<td><ObjAvail avail={cstat.monitor.nodes[props.node].services.status[props.path].avail} /></td>
					</tr>
					<tr>
						<td className="text-secondary">State</td>
						<td><ObjInstanceState node={props.node} path={props.path} /></td>
					</tr>
				</tbody>
			</table>
		</div>
	)
}

export {
	ObjInstanceDigest
}
