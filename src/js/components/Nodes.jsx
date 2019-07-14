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
		<div className={cl}>
			{props.value}{props.unit}
			{refer}
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

function Node(props) {
	const [{ cstat }, dispatch] = useStateValue();
	if (cstat.monitor === undefined) {
		return null
	}
	var data = cstat.monitor.nodes[props.node]
	if (data == undefined) {
		return null
	}
	if (props.compatIssue == state.OPTIMAL) {
		var ccl = "badge badge-secondary"
	} else {
		var ccl = "badge badge-"+props.compatIssue.color
	}
	if (props.versionIssue == state.OPTIMAL) {
		var vcl = "badge text-secondary"
	} else {
		var vcl = "badge text-"+props.versionIssue.color
	}
	function handleClick(e) {
		dispatch({
			"type": "setNav",
			"page": props.node,
			"links": ["Nodes", props.node]
		})
	}
	return (
		<tr className="clickable" onClick={handleClick}>
			<td data-title="Name">{props.node}</td>
			<td data-title="State"><NodeState data={data} /></td>
			<td data-title="Score"><NodeScore node={props.node} /></td>
			<td data-title="Load15m"><NodeLoad node={props.node} /></td>
			<td data-title="Mem Avail"><NodeMem node={props.node} /></td>
			<td data-title="Swap Avail"><NodeSwap node={props.node} /></td>
			<td data-title="Version" className="text-nowrap"><span className={vcl}>{data.agent}</span><span className={ccl}>{data.compat}</span></td>
			<td data-title="Actions" className="text-right"><NodeActions node={props.node} /></td>
			<td className="flex-trailer"/>
			<td className="flex-trailer" />
			<td className="flex-trailer" />
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
	var title
	if ((props.noTitle === undefined) || !props.noTitle) {
		title = (
			<div className="float-left">
				<h2><a className="text-dark" href="#" onClick={handleTitleClick}>Nodes</a></h2>
			</div>
		)
	}
	return (
		<div id="nodes">
			<div className="clearfix">
				{title}
				<div className="float-right">
					<ClusterActions title="Cluster Actions" />
				</div>
			</div>
			<div className="table-adaptative">
				<table className="table table-hover">
					<thead>
						<tr className="text-secondary">
							<td>Name</td>
							<td>State</td>
							<td>Score</td>
							<td>Load15m</td>
							<td>Mem Avail</td>
							<td>Swap Avail</td>
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
