import React from "react";
import { useStateValue } from '../state.js';
import { state } from "../utils.js";

function ThreadStatus(props) {
	if (props.status != "up") {
		return (
			<span className="text-danger">{props.status}</span>
		)
	} else {
		return (
			<span className="text-success">{props.status}</span>
		)
	}
}

function ArbitratorsDetails(props) {
	const [{ cstat }, dispatch] = useStateValue();
	var arbitrators = {}
	var arbNames = []
	var arbAddr = {}
	function handleClick(e) {
		dispatch({
			type: "setNav",
			page: "Arbitrators",
			links: ["Arbitrators"]
		})
	}
	if (cstat.monitor === undefined) {
		return null
	}
	for (var node in cstat.monitor.nodes) {
		var ndata = cstat.monitor.nodes[node]
		if (!ndata.arbitrators) {
			continue
		}
		if (!(node in arbitrators)) {
			arbitrators[node] = {}
		}
		for (var arbitrator in ndata.arbitrators) {
			var adata = ndata.arbitrators[arbitrator]
			if (arbNames.indexOf(arbitrator) < 0) {
				arbNames.push(arbitrator)
				arbAddr[arbitrator] = adata.name
			}
			arbitrators[node][arbitrator] = adata
		}
	}

	if (!arbNames.length) {
		return null
	}
	var title
	if ((props.noTitle === undefined) || !props.noTitle) {
		title = (
			<h2><a className="text-dark" href="#" onClick={handleClick}>Arbitrators</a></h2>
		)
	}

	return (
		<div id="arbitrators">
			{title}
			<div className="table-adaptative">
				<table className="table table-hover">
					<thead>
						<tr className="text-secondary">
							<td>Nodes</td>
							{arbNames.map((an, i) => (
								<td key={i} title={an}>{arbAddr[an]}</td>
							))}
						</tr>
					</thead>
					<tbody>
						{Object.keys(arbitrators).map((node) => (
							<ArbitratorDetails key={node} node={node} arbitrators={arbitrators[node]} />
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}

function ArbitratorDetails(props) {
	var ans = []
	var an
	for (an in props.arbitrators) {
		var adata = props.arbitrators[an]
		adata.an = an
		ans.push(adata)
	}

	return (
		<tr>
			<td data-title="Node">{props.node}</td>
			{ans.map((adata, i) => (
				<td key={i} data-title={adata.name} className={adata.status == "up" ? "text-"+state.OPTIMAL.color : "text-"+state.DANGER.color}>{adata.status}</td>
			))}
			<td className="flex-trailer"/>
			<td className="flex-trailer" />
			<td className="flex-trailer" />
		</tr>
	)
}

export {
	ArbitratorsDetails
}
