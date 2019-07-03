import React, { Component } from "react";
import { useStateValue } from '../state.js';
import { apiObjGetConfig } from "../api.js";
import { splitPath } from "../utils.js";
import { ObjAvail } from "./ObjAvail.jsx";
import { ObjActions } from "./ObjActions.jsx";
import { ObjDigest } from "./ObjDigest.jsx";
import { ObjInstanceState } from "./ObjInstanceState.jsx";
import { ObjInstanceActions } from "./ObjInstanceActions.jsx";

function ObjDetails(props) {
	//
	// props.path
	//
	const sp = splitPath(props.path)
	return (
		<div>
			<div className="clearfix">
				<div className="float-left">
					<h2>{props.path}</h2>
				</div>
				<div className="float-right">
					<ObjActions
						path={props.path}
						splitpath={sp}
						text="Object Actions"
					/>
				</div>
			</div>
			<ObjDigest path={props.path} />
			<ObjInstances path={props.path} />
			<ObjConfig path={props.path} />
		</div>
	)
}

class ObjConfig extends Component {
	//
	// props.path
	//
	constructor(props) {
		super(props)
		this.state = {
			data: {}
		}
	}
	componentDidMount() {
		apiObjGetConfig({svcpath: this.props.path}, (data) => {
			this.setState({data: data})
		})
	}
	render() {
		if (!this.state.data) {
			return null
		}
		var date = new Date(this.state.data.mtime * 1000)
		return (
			<div>
				<h3>Configuration</h3>
				<p className="text-secondary">Last Modified {date.toLocaleString()}</p>
				<pre>{this.state.data.data}</pre>
			</div>
		)
	}
}

function ObjInstances(props) {
	//
	// props.path
	//
	const [{ cstat }, dispatch] = useStateValue();
	if (cstat.monitor === undefined) {
		return null
	}
	return (
		<div>
			<h3>Instances</h3>
			<div className="table-responsive">
				<table className="table table-hover">
					<thead>
						<tr className="text-secondary">
							<td>Node</td>
							<td>Availability</td>
							<td>State</td>
							<td className="text-right">Actions</td>
						</tr>
					</thead>
					<tbody>
						{Object.keys(cstat.monitor.nodes).sort().map((node) => (
							<InstanceLine key={node} node={node} path={props.path} />
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}

function InstanceLine(props) {
	//
	// props.path
	// props.node
	//
	const [{ cstat }, dispatch] = useStateValue();
	if (cstat.monitor === undefined) {
		return null
	}
	if (!cstat.monitor.nodes[props.node].services.status[props.path]) {
		return null
	}
	function handleClick(e) {
		dispatch({
			type: "setNav",
			page: "ObjectInstance",
			links: ["Objects", props.path, props.node]
		})
	}
	return (
		<tr onClick={handleClick}>
			<td>{props.node}</td>
			<td><ObjAvail avail={cstat.monitor.nodes[props.node].services.status[props.path].avail} /></td>
			<td><ObjInstanceState node={props.node} path={props.path} /></td>
			<td className="text-right"><ObjInstanceActions node={props.node} path={props.path} /></td>
		</tr>
	)
}

export {
	ObjDetails
}
