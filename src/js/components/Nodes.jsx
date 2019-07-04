import React from "react";
import { useStateValue } from '../state.js';
import { state, fancySizeMB } from "../utils.js";
import { apiNodeAction } from "../api.js";
import { nodeMemOverloadIssue, nodeSwapOverloadIssue, compatIssue, versionIssue } from "../issues.js";
import { ObjFrozen } from "./ObjFrozen.jsx";
import { MonitorStatusBadge } from "./MonitorStatusBadge.jsx";
import { MonitorTargetBadge } from "./MonitorTargetBadge.jsx";
import { NodeActions } from "./NodeActions.jsx";
import { ClusterActions } from "./ClusterActions.jsx";
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

function NodeMetric(props) {
	console.log(props)
	const [{ cstat }, dispatch] = useStateValue();
	if (props.issue == state.WARNING) {
		var cl = "text-strong text-warning"
	} else {
		var cl = "text-strong"
	}
	var refer
	if (props.refer) {
		refer = ( <small className="text-secondary pl-1">{props.refer}</small> )
	}
	return (
		<div>
			<small className="text-secondary text-nowrap">{props.label}</small>
			<hr />
			<div className={cl}>
				{props.value}{props.unit}
				{refer}
			</div>
		</div>
	)
}
function NodeScore(props) {
	const [{ cstat }, dispatch] = useStateValue();
	return (
		<NodeMetric
			label="Score"
			value={cstat.monitor.nodes[props.node].stats.score}
			unit=""
		/>
	)
}function NodeLoad(props) {
	const [{ cstat }, dispatch] = useStateValue();
	return (
		<NodeMetric
			label="Load15m"
			value={cstat.monitor.nodes[props.node].stats.load_15m}
			unit=""
		/>
	)
}
function NodeMem(props) {
	const [{ cstat }, dispatch] = useStateValue();
	var memIssue = nodeMemOverloadIssue(cstat, props.node)
	return (
		<NodeMetric
			label="Avail Mem"
			value={cstat.monitor.nodes[props.node].stats.mem_avail}
			unit="%"
			issue={memIssue}
			refer={fancySizeMB(cstat.monitor.nodes[props.node].stats.mem_total)}
		/>
	)
}
function NodeSwap(props) {
	const [{ cstat }, dispatch] = useStateValue();
	var swapIssue = nodeSwapOverloadIssue(cstat, props.node)
	return (
		<NodeMetric
			label="Avail Swap"
			value={cstat.monitor.nodes[props.node].stats.mem_avail}
			unit="%"
			issue={swapIssue}
			refer={fancySizeMB(cstat.monitor.nodes[props.node].stats.swap_total)}
		/>
	)
}
function NodeMetrics(props) {
	return (
		<div className="metrics">
			<NodeScore node={props.node} />
			<NodeLoad node={props.node} />
			<NodeMem node={props.node} />
			<NodeSwap node={props.node} />
		</div>
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
			<td><NodeMetrics node={props.node} /></td>
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
			<div className="clearfix">
				<div className="float-left">
					<h2><a className="text-dark" href="#" onClick={handleTitleClick}>Nodes</a></h2>
				</div>
				<div className="float-right">
					<ClusterActions />
				</div>
			</div>
			<div className="table-responsive">
				<table className="table table-hover">
					<thead>
						<tr className="text-secondary">
							<td>Name</td>
							<td>State</td>
							<td className="text-center">Load</td>
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
