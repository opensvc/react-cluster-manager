import React from "react";
import { useStateValue } from '../state.js';
import { state } from "../utils.js";
import { apiNodeAction } from "../api.js";
import { compatIssue, versionIssue } from "../issues.js";
import { ObjFrozen } from "./ObjFrozen.jsx";
import { MonitorStatusBadge } from "./MonitorStatusBadge.jsx";
import { MonitorTargetBadge } from "./MonitorTargetBadge.jsx";
import { NodeActions } from "./NodeActions.jsx";
import { Sparklines, SparklinesLine, SparklinesReferenceLine, SparklinesNormalBand } from 'react-sparklines';

function NodeCpuSparkline(props) {
	var sampleData = [3, 2, 2, 1, 3, 5, 2]
	return (
		<Sparklines data={sampleData} height={40} style={{ "maxWidth": "6em" }} >
			<SparklinesLine style={{ strokeWidth: 5, stroke: "#6c757d", fill: "none" }} />
			<SparklinesReferenceLine type="mean" style={{ strokeWidth: 2, stroke: "#dc3545" }} />
		</Sparklines>
	)
}

function NodeState(props) {
	return (
		<div>
			<ObjFrozen frozen={props.data.frozen} />
			<NodeSpeakerBadge speaker={props.data.speaker} />
			<MonitorStatusBadge state={props.data.monitor.status} />
			<MonitorTargetBadge target={props.data.monitor.global_expect} />
			<NodeCpuSparkline />
		</div>
	)
}

function NodeSpeakerBadge(props) {
	if (props.speaker != true) {
		return null
	}
	return (
		<span className="ml-1 mr-1 badge badge-secondary">Speaker</span>
	)
}

function Node(props) {
	const [{ cstat }, dispatch] = useStateValue();
	if (cstat.monitor === undefined) {
		return null
	}
	var data = cstat.monitor.nodes[props.node]
	if (props.compatIssue == state.OPTIMAL) {
		var ccl = "badge badge-secondary"
	} else {
		var ccl = "badge badge-"+props.versionIssue.color
	}
	if (props.versionIssue == state.OPTIMAL) {
		var vcl = "badge text-secondary"
	} else {
		var vcl = "badge text-"+props.versionIssue.color
	}
	return (
		<tr>
			<td>{props.node}</td>
			<td><NodeState data={data} /></td>
			<td><span className={vcl}>{data.agent}</span><span className={ccl}>{data.compat}</span></td>
			<td className="text-right"><NodeActions node={props.node} /></td>
		</tr>
	)
}

function Nodes(props) {
	const [{ cstat }, dispatch] = useStateValue();
	if (cstat.monitor === undefined) {
		return null
	}
	var vissue = versionIssue(cstat)
	var cissue = compatIssue(cstat)
	function handleTitleClick(e) {
		dispatch({
			"type": "setNav",
			"page": "Nodes",
			"links": ["Nodes"],
		})
	}
	return (
		<div id="nodes">
			<h2><a className="text-dark" href="#" onClick={handleTitleClick}>Nodes</a></h2>
			<div className="table-responsive">
				<table className="table table-hover">
					<thead>
						<tr className="text-secondary">
							<td>Name</td>
							<td>State</td>
							<td>Version</td>
							<td className="text-right">Actions</td>
						</tr>
					</thead>
					<tbody>
						{cstat.cluster.nodes.map((node) => (
							<Node key={node} node={node} compatIssue={cissue} versionIssue={vissue} />
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export {
	Nodes
}
