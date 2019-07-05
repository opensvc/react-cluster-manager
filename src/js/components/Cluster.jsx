import React from "react";
import { useStateValue } from '../state.js';
import { state } from '../utils.js';
import { threadsIssue, arbitratorsIssue, heartbeatsIssue, nodesIssue, objectsIssue } from "../issues.js";
import { ClusterTools } from "./ClusterTools.jsx";
import { Threads } from "./Threads.jsx";
import { HeartbeatsDetails } from "./HeartbeatsDetails.jsx";
import { ArbitratorsDetails } from "./ArbitratorsDetails.jsx";
import { Nodes } from "./Nodes.jsx";
import { Objs } from "./Objs.jsx";

function ThreadsLink(props) {
	const [{ cstat }, dispatch] = useStateValue();
	var color = threadsIssue(cstat).color
	return (
		<div className={"m-1 alert alert-"+color}>
			<a className={"text-"+color} href="#threads" onClick={() => dispatch({type: "setNav", page: "Threads", links: ["Threads"]})}>Threads</a>
		</div>
	)
}

function NodesLink(props) {
	const [{ cstat }, dispatch] = useStateValue();
	var color = nodesIssue(cstat).color
	return (
		<div className={"m-1 alert alert-"+color}>
			<a className={"text-"+color} href="#nodes" onClick={() => dispatch({type: "setNav", page: "Nodes", links: ["Nodes"]})}>Nodes</a>
		</div>
	)
}

function ObjectsLink(props) {
	const [{ cstat }, dispatch] = useStateValue();
	var color = objectsIssue(cstat).color
	return (
		<div className={"m-1 alert alert-"+color}>
			<a className={"text-"+color} href="#objects" onClick={() => dispatch({type: "setNav", page: "Objects", links: ["Objects"]})}>Objects</a>
		</div>
	)
}

function ArbitratorsLink(props) {
	const [{ cstat }, dispatch] = useStateValue();
	var color = arbitratorsIssue(cstat).color
	return (
		<div className={"m-1 alert alert-"+color}>
			<a className={"text-"+color} href="#arbitrators" onClick={() => dispatch({type: "setNav", page: "Arbitrators", links: ["Arbitrators"]})}>Arbitrators</a>
		</div>
	)
}

function HeartbeatsLink(props) {
	const [{ cstat }, dispatch] = useStateValue();
	var color = heartbeatsIssue(cstat).color
	return (
		<div className={"m-1 alert alert-"+color}>
			<a className={"text-"+color} href="#heartbeats" onClick={() => dispatch({type: "setNav", page: "Heartbeats", links: ["Heartbeats"]})}>Heartbeats</a>
		</div>
	)
}

function SubsysLinks(props) {
	return (
		<div className="d-flex flex-wrap p-0 m-0 h6">
			<ThreadsLink />
			<HeartbeatsLink />
			<ArbitratorsLink />
			<NodesLink />
			<ObjectsLink />
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
