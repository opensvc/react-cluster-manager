import React from "react";
import { useStateValue } from '../state.js';
import { ClusterActions } from "./ClusterActions.jsx";

function ClusterTools(props) {
	return (
		<div className="d-flex flex-wrap px-0 h6">
			<div className="mb-2 mr-2">
				<ClusterActions />
			</div>
			<ReloadButton />
		</div>
	)
}

function ReloadButton(props) {
	const [{ cstat, refreshQueued }, dispatch] = useStateValue();
	return (
		<div className="mb-2 mr-2">
			<button className="btn btn-sm btn-outline-secondary" disabled={refreshQueued ? 1 : 0} onClick={() => {dispatch("loadCstat")}}>Reload</button>
		</div>
	)
}

export {
	ClusterTools
}
