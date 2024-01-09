import React from "react";
import { withOidcUser } from '@axa-fr/react-oidc-context';
import { Routes, Route } from 'react-router-dom';
import { useStateValue } from '../state.js';
import Cluster from "./Cluster.jsx";
import { Threads } from "./Threads.jsx";
import { Nodes } from "./Nodes.jsx";
import { NodeDetails } from "./NodeDetails.jsx";
import { Objs } from "./Objs.jsx";
import { ObjDetails } from "./ObjDetails.jsx";
import { ObjInstanceDetails } from "./ObjInstanceDetails.jsx";
import { Deploy } from "./Deploy.jsx";
import { HeartbeatsDetails } from "./HeartbeatsDetails.jsx";
import ArbitratorsDetails from "./ArbitratorsDetails.jsx";
import { User } from "./User.jsx";
import { Pools } from "./Pools.jsx";
import { Networks } from "./Networks.jsx";
import { NetworkDetails } from "./NetworkDetails.jsx"
import Api from "./Api.jsx"
import Stats from "./Stats.jsx"
import { NotFound } from "./NotFound.jsx"

function Main(props) {
	const [{ nav }, dispatch] = useStateValue();

	return (
		<Routes>
			<Route path="/" element={<Cluster />} />
			<Route path="/authentication/callback" element={<Cluster />} />
			<Route path="/threads" element={<Threads />} />
			<Route path="/deploy" element={<Deploy />} />
			<Route path="/heartbeats" element={<HeartbeatsDetails />} />
			<Route path="/arbitrators" element={<ArbitratorsDetails />} />
			<Route path="/nodes" element={<Nodes />} />
			<Route path="/networks" element={<Networks />} />
			<Route path="/pools" element={<Pools />} />
			<Route path="/objects" element={<Objs />} />
			<Route path="/services" element={<Objs kind="svc" />} />
			<Route path="/volumes" element={<Objs kind="vol" />} />
			<Route path="/configs" element={<Objs kind="cfg" />} />
			<Route path="/secrets" element={<Objs kind="sec" />} />
			<Route path="/users" element={<Objs kind="usr" />} />
			<Route path="/network" element={<NetworkDetails />} />
			<Route path="/node" element={<NodeDetails />} />
			<Route path="/object" element={<ObjDetails />} />
			<Route path="/instance" element={<ObjInstanceDetails />} />
			<Route path="/user" element={<User />} />
			<Route path="/stats" element={<Stats />} />
			<Route path="/api" element={<Api />} />
			<Route element={<NotFound />} />
		</Routes>
	)
}

export default withOidcUser(Main)
