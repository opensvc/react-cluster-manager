import React from "react";
import { useStateValue } from '../state.js';
import { apiNodeSetMonitor } from "../api.js";

function ClusterActions(props) {
	const [{}, dispatch] = useStateValue();
	function handleClick(e) {
		var target = e.target.getAttribute("value")
		apiNodeSetMonitor(target, (data) => dispatch({type: "parseApiResponse", data: data}))
	}
	return (
		<div className="dropdown">
			<button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Cluster Actions</button>
			<div className="dropdown-menu">
				<a className="dropdown-item" value="frozen" onClick={handleClick}>Freeze Nodes</a>
				<a className="dropdown-item" value="thawed" onClick={handleClick}>Thaw Nodes</a>
			</div>
		</div>
	)
}

export {
	ClusterActions
}
