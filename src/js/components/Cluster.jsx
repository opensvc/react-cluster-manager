import React from "react";
import { useStateValue } from '../state.js';
import { state } from '../utils.js';
import { threadsIssue, arbitratorsIssue, heartbeatsIssue, nodesIssue } from "../issues.js";
import { ClusterTools } from "./ClusterTools.jsx";
import { Threads } from "./Threads.jsx";
import { HeartbeatsDetails } from "./HeartbeatsDetails.jsx";
import { ArbitratorsDetails } from "./ArbitratorsDetails.jsx";
import { Nodes } from "./Nodes.jsx";
import { Objs } from "./Objs.jsx";
import { ClusterActions } from "./ClusterActions.jsx";

function ThreadsLink(props) {
	const [{ cstat }, dispatch] = useStateValue();
	var cl = "text-" + threadsIssue(cstat).color
	return (
		<a className={cl} href="#threads" onClick={() => dispatch({type: "setNav", page: "Threads", links: ["Threads"]})}>Threads</a>
	)
}

function NodesLink(props) {
	const [{ cstat }, dispatch] = useStateValue();
	var cl = "text-" + nodesIssue(cstat).color
	return (
		<a className={cl} href="#nodes" onClick={() => dispatch({type: "setNav", page: "Nodes", links: ["Nodes"]})}>Nodes</a>
	)
}

function ObjectsLink(props) {
	const [{ cstat }, dispatch] = useStateValue();
	var cl = "text-secondary"
	return (
		<a className={cl} href="#objects" onClick={() => dispatch({type: "setNav", page: "Objects", links: ["Objects"]})}>Objects</a>
	)
}

function ArbitratorsLink(props) {
	const [{ cstat }, dispatch] = useStateValue();
	var cl = "text-" + arbitratorsIssue(cstat).color
	return (
		<a className={cl} href="#arbitrators" onClick={() => dispatch({type: "setNav", page: "Arbitrators", links: ["Arbitrators"]})}>Arbitrators</a>
	)
}

function HeartbeatsLink(props) {
	const [{ cstat }, dispatch] = useStateValue();
	var cl = "text-" + heartbeatsIssue(cstat).color
	return (
		<a className={cl} href="#heartbeats" onClick={() => dispatch({type: "setNav", page: "Heartbeats", links: ["Heartbeats"]})}>Heartbeats</a>
	)
}

function SubsysLinks(props) {
	return (
		<div className="d-flex flex-wrap p-0 m-0 h6">
			<div className="mb-2 mr-2">
				<ThreadsLink />
			</div>
			<div className="mb-2 mr-2">
				<HeartbeatsLink />
			</div>
			<div className="mb-2 mr-2">
				<ArbitratorsLink />
			</div>
			<div className="mb-2 mr-2">
				<NodesLink />
			</div>
			<div className="mb-2 mr-2">
				<ObjectsLink />
			</div>
		</div>
	)
}

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
			<SubsysLinks />
			<ClusterTools />
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
