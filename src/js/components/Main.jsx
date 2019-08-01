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
import { ClusterActions } from "./ClusterActions.jsx";
import { ObjActions } from "./ObjActions.jsx";
import { ObjInstanceActions } from "./ObjInstanceActions.jsx";
import { ObjKeyAdd } from "./ObjKeyAdd.jsx";
import { NodeActions } from "./NodeActions.jsx";
import { ObjScale } from "./ObjScale.jsx";
import { User } from "./User.jsx";
import { DeployButton } from "./DeployButton.jsx";
import { Fabs } from "./Fabs.jsx";
import { Pools } from "./Pools.jsx";
import { PoolAdd } from "./PoolAdd.jsx";
import { Networks } from "./Networks.jsx";
import { NetworkAdd } from "./NetworkAdd.jsx";

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
			<React.Fragment>
				<Cluster />
				<Fabs>
					<ClusterActions fab={true} />
					<DeployButton />
				</Fabs>
			</React.Fragment>
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
		return (
			<React.Fragment>
				<ObjInstanceDetails
					path={nav.links[n-2]}
					node={nav.links[n-1]}
				/>
				<Fabs>
					<ObjInstanceActions
						selected={[{
							path: nav.links[n-2],
							node: nav.links[n-1],
						}]}
						fab={true}
					/>
				</Fabs>
			</React.Fragment>
		)
	}
	if (nav.links[n-1] == "Networks") {
		return (
			<React.Fragment>
				<Networks />
				<Fabs>
					<NetworkAdd />
				</Fabs>
			</React.Fragment>
		)
	}
	if (nav.links[n-1] == "Pools") {
		return (
			<React.Fragment>
				<Pools />
				<Fabs>
					<PoolAdd />
				</Fabs>
			</React.Fragment>
		)
	}
	if (nav.links[n-1] == "Nodes") {
		return (
			<React.Fragment>
				<Nodes />
				<Fabs>
					<ClusterActions fab={true} />
					<DeployButton />
				</Fabs>
			</React.Fragment>
		)
	}
	if (nav.links[n-2] == "Nodes") {
		return (
			<React.Fragment>
				<NodeDetails
					node={nav.links[n-1]}
				/>
				<Fabs>
					<NodeActions fab={true} selected={nav.links[n-1]} />
				</Fabs>
			</React.Fragment>
		)
	}
	if (nav.links[n-1] in objects) {
		return (
			<React.Fragment>
				<Objs kind={objects[nav.links[n-1]]} />
				<Fabs>
					<DeployButton kind={objects[nav.links[n-1]]} />
				</Fabs>
			</React.Fragment>
		)
	}
	if (nav.links[n-2] in objects) {
		const path = nav.links[n-1]
		return (
			<React.Fragment>
				<ObjDetails
					path={path}
				/>
				<Fabs>
					<ObjActions path={path} fab={true} />
					<ObjKeyAdd path={path} />
					<ObjScale path={path} />
				</Fabs>
			</React.Fragment>
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
