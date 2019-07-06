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

function SubsysLink(props) {
	return (
		<button className={"text-center flex-grow-1 m-1 alert alert-"+props.color} href={props.href} onClick={props.onClick}>
			<span className={"text-"+props.color}>{props.title}</span>
		</button>
	)
}


function SubsysLinks(props) {
	const [{ cstat }, dispatch] = useStateValue();
	return (
		<div className="d-flex flex-wrap mb-2">
			<SubsysLink color={threadsIssue(cstat).color} href="#threads" title="Threads" onClick={() => dispatch({type: "setNav", page: "Threads", links: ["Threads"]})} />
			<SubsysLink color={heartbeatsIssue(cstat).color} href="#heartbeats" title="Heartbeats" onClick={() => dispatch({type: "setNav", page: "Heartbeats", links: ["Heartbeats"]})} />
			<SubsysLink color={arbitratorsIssue(cstat).color} href="#arbitrators" title="Arbitrators" onClick={() => dispatch({type: "setNav", page: "Arbitrators", links: ["Arbitrators"]})} />
			<SubsysLink color={nodesIssue(cstat).color} href="#nodes" title="Nodes" onClick={() => dispatch({type: "setNav", page: "Nodes", links: ["Nodes"]})} />
			<SubsysLink color={objectsIssue(cstat).color} href="#objects" title="Objects" onClick={() => dispatch({type: "setNav", page: "Objects", links: ["Objects"]})} />
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
