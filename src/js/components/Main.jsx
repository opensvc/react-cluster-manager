import React from "react";
import { useStateValue } from '../state.js';
import { Cluster } from "./Cluster.jsx";
import { Threads } from "./Threads.jsx";
import { Nodes } from "./Nodes.jsx";
import { NodeDetails } from "./NodeDetails.jsx";
import { Objs } from "./Objs.jsx";
import { ObjDetails } from "./ObjDetails.jsx";
import { ObjInstanceDetails } from "./ObjInstanceDetails.jsx";
import { Deploy } from "./Deploy.jsx";
import { HeartbeatsDetails } from "./HeartbeatsDetails.jsx";
import { ArbitratorsDetails } from "./ArbitratorsDetails.jsx";
import { User } from "./User.jsx";
import { Pools } from "./Pools.jsx";
import { Networks } from "./Networks.jsx";
import { NetworkDetails } from "./NetworkDetails.jsx"

function Main(props) {
	const [{ nav }, dispatch] = useStateValue();
	const objects = {
		"Objects": null,
		"Services": "svc",
		"Volumes": "vol",
		"Configs": "cfg",
		"Secrets": "sec",
		"Users": "usr",
	}

	if (nav.page == "Cluster") {
		return (
			<Cluster />
		)
	}
	if (nav.page == "Threads") {
		return ( <Threads /> )
	}
	if (nav.page == "Deploy") {
		return ( <Deploy /> )
	}
	if (nav.page == "Heartbeats") {
		return ( <HeartbeatsDetails /> )
	}
	if (nav.page == "Arbitrators") {
		return ( <ArbitratorsDetails /> )
	}
	if (nav.page == "User") {
		return ( <User /> )
	}
	var n = nav.links.length
	if (nav.page == "ObjectInstance") {
		var path = nav.links[n-2]
		var node = nav.links[n-1]
		return (
			<ObjInstanceDetails path={path} node={node} />
		)
	}
	if (nav.links[n-1] == "Networks") {
		return (
			<Networks />
		)
	}
	if (nav.links[n-2] == "Networks") {
		return (
			<NetworkDetails name={nav.links[n-1]} />
		)
	}
	if (nav.links[n-1] == "Pools") {
		return (
			<Pools />
		)
	}
	if (nav.links[n-1] == "Nodes") {
		return (
			<Nodes />
		)
	}
	if (nav.links[n-2] == "Nodes") {
		return (
			<NodeDetails node={nav.links[n-1]} />
		)
	}
	if (nav.links[n-1] in objects) {
		return (
			<React.Fragment>
				<Objs kind={objects[nav.links[n-1]]} />
			</React.Fragment>
		)
	}
	if (nav.links[n-2] in objects) {
		const path = nav.links[n-1]
		return (
			<ObjDetails path={path} />
		)
	}
	if ([nav.links[n-3], nav.links[n-1]] == ["Objects", "Log"]) {
		return (
			<Log
				url={"/object/"+nav.links[n-2]}
			/>
		)
	}
	if ([nav.links[n-3], nav.links[n-1]] == ["Nodes", "Log"]) {
		return (
			<Log
				url={"/node/"+nav.links[n-2]}
			/>
		)
	}
	return ( <div>Page not found</div> )
}

export {
	Main
}
