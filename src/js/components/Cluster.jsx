import React from "react";
import { useStateValue } from '../state.js';
import { state } from '../utils.js';
import { threadsIssue, arbitratorsIssue, heartbeatsIssue, nodesIssue, objectsIssue } from "../issues.js";
import { Threads } from "./Threads.jsx";
import { HeartbeatsDetails } from "./HeartbeatsDetails.jsx";
import { ArbitratorsDetails } from "./ArbitratorsDetails.jsx";
import { Nodes } from "./Nodes.jsx";
import { Objs } from "./Objs.jsx";


function Cluster(props) {
	const [{ cstat }, dispatch] = useStateValue();
	if (!cstat.cluster) {
		return null
	}
	var threads, heartbeats, arbitrators, nodes
	if (threadsIssue(cstat) != state.OPTIMAL) {
		var threads = (
			<Threads />
		)
	}
	if (heartbeatsIssue(cstat) != state.OPTIMAL) {
		var heartbeats = (
			<HeartbeatsDetails />
		)
	}
	if (arbitratorsIssue(cstat) != state.OPTIMAL) {
		var arbitrators = (
			<ArbitratorsDetails />
		)
	}
	if (nodesIssue(cstat) != state.OPTIMAL) {
		var nodes = (
			<Nodes />
		)
	}
	return (
		<div>
			{threads}
			{heartbeats}
			{arbitrators}
			{nodes}
			<Objs />
		</div>
	)
}

export {
	Cluster
}
