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

function Main(props) {
	const [{ nav }, dispatch] = useStateValue();

	if (nav.page == "Cluster") {
		return ( <Cluster noTitle /> )
	}
	if (nav.page == "Threads") {
		return ( <Threads noTitle /> )
	}
	if (nav.page == "Nodes") {
		return ( <Nodes noTitle /> )
	}
	if (nav.page == "Objects") {
		return ( <Objs noTitle /> )
	}
	if (nav.page == "Deploy") {
		return ( <Deploy noTitle /> )
	}
	if (nav.page == "Heartbeats") {
		return ( <HeartbeatsDetails noTitle /> )
	}
	if (nav.page == "Arbitrators") {
		return ( <ArbitratorsDetails noTitle /> )
	}
	if (nav.page == "User") {
		return ( <User noTitle /> )
	}
	if (nav.page == "Object") {
		return (
			<ObjDetails
				path={nav.links[nav.links.length-1]}
				noTitle
			/>
		)
	}
	if (nav.page == "ObjectInstance") {
		return (
			<ObjInstanceDetails
				path={nav.links[nav.links.length-2]}
				node={nav.links[nav.links.length-1]}
				noTitle
			/>
		)
	}
	var n = nav.links.length
	if (nav.links[n-2] == "Nodes") {
		return (
			<NodeDetails
				node={nav.links[nav.links.length-1]}
				noTitle
			/>
		)
	}
	if (nav.links[n-2] == "Objects") {
		return (
			<ObjDetails
				path={nav.links[n-1]}
				noTitle
			/>
		)
	}
	if ([nav.links[n-3], nav.links[n-1]] == ["Objects", "Log"]) {
		return (
			<Log
				url={"/object/"+nav.links[n-2]}
				noTitle
			/>
		)
	}
	if ([nav.links[n-3], nav.links[n-1]] == ["Nodes", "Log"]) {
		return (
			<Log
				url={"/node/"+nav.links[n-2]}
				noTitle
			/>
		)
	}
	return ( <div>Page not found</div> )
}

export { Main };
