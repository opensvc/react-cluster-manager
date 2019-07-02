import React from "react";
import { useStateValue } from '../state.js';
import { Cluster } from "./Cluster.jsx";
import { Threads } from "./Threads.jsx";
import { Nodes } from "./Nodes.jsx";
import { Objs } from "./Objs.jsx";
import { ObjDetails } from "./ObjDetails.jsx";
import { Deploy } from "./Deploy.jsx";
import { HeartbeatsDetails } from "./HeartbeatsDetails.jsx";
import { ArbitratorsDetails } from "./ArbitratorsDetails.jsx";
import { User } from "./User.jsx";

function Main(props) {
	const [{ nav }, dispatch] = useStateValue();

	if (nav.page == "Cluster") {
		return (
			<Cluster />
		)
	}
	if (nav.page == "Threads") {
		return (
			<Threads />
		)
	}
	if (nav.page == "Nodes") {
		return (
			<Nodes />
		)
	}
	if (nav.page == "Objects") {
		return (
			<Objs />
		)
	}
	if (nav.page == "Object") {
		return (
			<ObjDetails path={nav.links[nav.links.length-1]} />
		)
	}
	if (nav.page == "Deploy") {
		return (
			<Deploy />
		)
	}
	if (nav.page == "Heartbeats") {
		return (
			<HeartbeatsDetails />
		)
	}
	if (nav.page == "Arbitrators") {
		return (
			<ArbitratorsDetails />
		)
	}
	if (nav.page == "User") {
		return (
			<User />
		)
	}
	if (nav.links[nav.links.length-2] == "Objects") {
		return (
			<ObjDetails path={nav.links[nav.links.length-1]} />
		)
	}
	return (
		<div>Page not found</div>
	)
}

export { Main };
