import React from "react";
import { useStateValue } from '../state.js';
import { state } from '../utils.js';
import { objectsIssue, threadsIssue, arbitratorsIssue, heartbeatsIssue, nodesIssue } from "../issues.js";
import { Threads } from "./Threads.jsx";
import { HeartbeatsDetails } from "./HeartbeatsDetails.jsx";
import { ArbitratorsDetails } from "./ArbitratorsDetails.jsx";
import { Nodes } from "./Nodes.jsx";
import { Objs } from "./Objs.jsx";
import { ClusterDigest } from "./ClusterDigest.jsx";

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
	if (objectsIssue(cstat) != state.OPTIMAL) {
		var objs = (
			<Objs />
		)
	}
	return (
		<div>
			<ClusterDigest />
			{threads}
			{heartbeats}
			{arbitrators}
			{nodes}
			{objs}
		</div>
	)
}

export {
	Cluster
}
