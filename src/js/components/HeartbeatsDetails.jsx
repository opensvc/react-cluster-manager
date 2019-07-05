import React from "react";
import { useStateValue } from '../state.js';

function ThreadStatus(props) {
	if (props.state != "running") {
		return (
			<span className="text-danger">{props.state}</span>
		)
	} else {
		return (
			<span className="text-success">{props.state}</span>
		)
	}
}

function HeartbeatsDetails(props) {
	const [{ cstat }, dispatch] = useStateValue();
	if (cstat.monitor === undefined) {
		return null
	}
	var hbNames = []
	function handleClick(e) {
		dispatch({
			type: "setNav",
			page: "Heartbeats",
			links: ["Heartbeats"]
		})
	}
        for (var hbName in cstat) {
		if (!/^hb#/.test(hbName)) {
			continue
		}
		if (hbName.match(/rx$/)) {
			hbNames.push(hbName.slice(0, -3))
		}
	}
	var nodes = Object.keys(cstat.monitor.nodes)
	return (
		<div id="heartbeats">
			<h2><a className="text-dark" href="#" onClick={handleClick}>Heartbeats</a></h2>
			<div className="table-adaptative">
				<table className="table table-hover">
					<thead>
						<tr className="text-secondary">
							<td>Nodes</td>
							{hbNames.map((hbName, i) => (
								<td key={i}>{hbName}</td>
							))}
						</tr>
					</thead>
					<tbody>
						{cstat.cluster.nodes.map((node, i) => (
							<NodeHeartbeats key={i} node={node} hbNames={hbNames} />
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}

function NodeHeartbeats(props) {
	return (
		<tr>
			<td data-title="Node">{props.node}</td>
			{props.hbNames.map((hbName, i) => (
				<NodeHeartbeat key={i} node={props.node} hbName={hbName} />
			))}
		</tr>
	)
}

function NodeHeartbeat(props) {
	const [{ cstat }, dispatch] = useStateValue();
	if (cstat.monitor === undefined) {
		return null
	}
	function badge(beating) {
		var cl = ""
		if (beating == false) {
			cl += "text-danger"
		} else if (beating == true) {
			cl += "text-success"
		} else {
			cl += "text-secondary"
		}
		return cl
	}
	return (
		<td data-title={props.hbName}>
			<span className={badge(cstat[props.hbName+".rx"].peers[props.node].beating)}>rx</span>
			<span className="text-secondary">&nbsp;&#47;&nbsp;</span>
			<span className={badge(cstat[props.hbName+".tx"].peers[props.node].beating)}>tx</span>
		</td>
	)
}


export {
	HeartbeatsDetails
}
