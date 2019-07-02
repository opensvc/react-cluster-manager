import React from "react";
import { useStateValue } from '../state.js';
import { apiNodeAction } from "../api.js";

function Threads(props) {
	const [{ cstat }, dispatch] = useStateValue();
	if (!("monitor" in cstat)) {
		return null
	}
	function handleTitleClick(e) {
		dispatch({
			type: "setNav",
			page: "Threads",
			links: ["Threads"],
		})
	}
	var threads = ["listener", "dns", "monitor", "scheduler"]
	for (var section in cstat) {
		if (section.match(/^hb#/)) {
			threads.push(section)
		}
	}
	return (
		<div id="threads">
			<h2><a className="text-dark" href="#" onClick={handleTitleClick}>Threads</a></h2>
			<div className="table-responsive">
				<table className="table table-hover">
					<thead>
						<tr className="text-secondary">
							<td>Name</td>
							<td>State</td>
						</tr>
					</thead>
					<tbody>
						{threads.map((name) => (
							<Thread key={name} name={name} data={cstat[name]} />
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}

function Thread(props) {
	if (props.data.state == "running") {
		var cl = "text-success"
	} else {
		var cl = "text-danger"
	}
	return (
		<tr>
			<td>{props.name}</td>
			<td className={cl}>{props.data.state}</td>
		</tr>
	)
}

function ThreadActions(props) {
	function handleClick(e) {
		var action = e.target.getAttribute("value")
		apiNodeAction(props.node, action, {thread_id: props.thread_id})
	}
	return (
		<div className="dropdown">
			<button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" data-boundary="window" aria-haspopup="true" aria-expanded="false"></button>
			<div className="dropdown-menu">
				<a className="dropdown-item" value="start" onClick={handleClick}>Start</a>
				<div className="dropdown-divider"></div>
				<a className="dropdown-item text-warning" value="stop" onClick={handleClick}>Stop</a>
			</div>
		</div>
	)
}


export {
	Threads,
	Thread
}
