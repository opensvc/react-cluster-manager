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

function ObjInstanceDetails(props) {
	//
	// props.path
	// props.node
	//
	const sp = splitPath(props.path)
	var title
	if ((props.noTitle === undefined) || !props.noTitle) {
		title = (
			<h2>{props.path} @ {props.node}</h2>
		)
	}

	return (
		<div>
			{title}
			<div className="clearfix">
				<div className="float-left">
					<h3>Object</h3>
				</div>
				<div className="float-right">
					<ObjActions
						path={props.path}
						splitpath={sp}
						title="Object Actions"
					/>
				</div>
			</div>
			<ObjDigest path={props.path} />
			<div className="clearfix">
				<div className="float-left">
					<h3>Instance</h3>
				</div>
				<div className="float-right">
					<ObjInstanceActions
						path={props.path}
						splitpath={sp}
						node={props.node}
						title="Instance Actions"
					/>
				</div>
			</div>
			<ObjInstanceDigest path={props.path} node={props.node} />
			<ObjInstancesResources path={props.path} node={props.node} />
		</div>
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
		<div>
			<h3>Resources</h3>
			<div className="table-adaptative">
				<table className="table table-hover">
					<thead>
						<tr className="text-secondary">
							<td>Id</td>
							<td>Availability</td>
							<td>State</td>
							<td>Desc</td>
							<td className="text-right">Actions</td>
						</tr>
					</thead>
					<tbody>
						{Object.keys(rdata).sort().map((rid, i) => (
							<ObjInstanceResourceLine key={i} rid={rid} node={props.node} path={props.path} />
						))}
					</tbody>
				</table>
			</div>
		</div>
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
		<tr>
			<td data-title="Id">{props.rid}</td>
			<td data-title="Availability"><ObjAvail avail={rdata.status} /></td>
			<td data-title="State"><ObjInstanceResourceState rid={props.rid} node={props.node} path={props.path} /></td>
			<td data-title="Desc">{rdata.label}</td>
			<td data-title="Actions" className="text-right"><ObjInstanceResourceActions rid={props.rid} node={props.node} path={props.path} /></td>
			<td className="flex-trailer"/>
			<td className="flex-trailer" />
			<td className="flex-trailer" />
		</tr>
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
		<div>
			<ObjProvisioned provisioned={rdata.provisioned && rdata.provisioned.state} />
		</div>
	)
}

export {
	ObjInstanceDetails
}
