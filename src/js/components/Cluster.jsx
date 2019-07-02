import React from "react";
import { useStateValue } from '../state.js';
import { compatIssue, versionIssue, threadsIssue, arbitratorsIssue, heartbeatsIssue, nodesIssue } from "../issues.js";
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
		<a className={cl} href="#threads">Threads</a>
	)
}

function NodesLink(props) {
	const [{ cstat }, dispatch] = useStateValue();
	var cl = "text-" + nodesIssue(cstat).color
	return (
		<a className={cl} href="#nodes">Nodes</a>
	)
}

function ObjectsLink(props) {
	var cl = "text-secondary"
	return (
		<a className={cl} href="#objects">Objects</a>
	)
}

function ArbitratorsLink(props) {
	const [{ cstat }, dispatch] = useStateValue();
	var cl = "text-" + arbitratorsIssue(cstat).color
	return (
		<a className={cl} href="#arbitrators">Arbitrators</a>
	)
}

function HeartbeatsLink(props) {
	const [{ cstat }, dispatch] = useStateValue();
	var cl = "text-" + heartbeatsIssue(cstat).color
	return (
		<a className={cl} href="#heartbeats">Heartbeats</a>
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
	return (
		<div>
			<SubsysLinks />
			<ClusterTools />
			<Threads />
			<HeartbeatsDetails />
			<ArbitratorsDetails />
			<Nodes />
			<Objs />
		</div>
	)
}

export {
	Cluster
}
