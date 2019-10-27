import React from "react";
import { useHistory } from 'react-router'
import { Switch, Route } from 'react-router-dom';
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
import Stats from "./Stats.jsx"
import { NotFound } from "./NotFound.jsx"
import { withOidcUser, OidcSecure } from '@axa-fr/react-oidc-context';


function Main(props) {
	const [{ nav }, dispatch] = useStateValue();
	const history = useHistory()
	const objects = {
		"Objects": null,
		"Services": "svc",
		"Volumes": "vol",
		"Configs": "cfg",
		"Secrets": "sec",
		"Users": "usr",
	}
	console.log("router path:", history.location.pathname)

	return (
		<Switch>
			<Route exact path="/">
				<Cluster />
			</Route>
			<Route exact path="/authentication/callback">
				<Cluster />
			</Route>
			<Route exact path="/threads">
				<Threads />
			</Route>
			<Route exact path="/deploy">
				<Deploy />
			</Route>
			<Route exact path="/heartbeats">
				<HeartbeatsDetails />
			</Route>
			<Route exact path="/arbitrators">
				<ArbitratorsDetails />
			</Route>
			<Route exact path="/nodes">
				<Nodes />
			</Route>
			<Route exact path="/networks">
				<Networks />
			</Route>
			<Route exact path="/pools">
				<Pools />
			</Route>
			<Route exact path="/objects">
				<Objs />
			</Route>
			<Route exact path="/services">
				<Objs kind="svc" />
			</Route>
			<Route exact path="/volumes">
				<Objs kind="vol" />
			</Route>
			<Route exact path="/configs">
				<Objs kind="cfg" />
			</Route>
			<Route exact path="/secrets">
				<Objs kind="sec" />
			</Route>
			<Route exact path="/users">
				<Objs kind="usr" />
			</Route>
			<Route exact path="/network">
				<NetworkDetails />
			</Route>
			<Route exact path="/node">
				<NodeDetails />
			</Route>
			<Route exact path="/pool">
				<NotFound />
			</Route>
			<Route exact path="/object">
				<ObjDetails />
			</Route>
			<Route exact path="/instance">
				<ObjInstanceDetails />
			</Route>
			<Route exact path="/user">
				<User />
			</Route>
			<Route exact path="/stats">
				<Stats />
			</Route>
			<Route>
				<NotFound />
			</Route>
		</Switch>
	)
}

export default withOidcUser(Main)
