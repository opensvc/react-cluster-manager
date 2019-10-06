import React from "react";
import { useStateValue } from '../state.js';
import { state } from '../utils.js';
import { ClusterDigest } from "./ClusterDigest.jsx";

function Cluster(props) {
	const [{ cstat }, dispatch] = useStateValue();
	if (!cstat.cluster) {
		return null
	}
	return (
		<div>
			<ClusterDigest />
		</div>
	)
}

export {
	Cluster
}
