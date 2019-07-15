import React, { useState } from "react";
import { Button, Spinner, Nav, NavItem, NavLink, Dropdown, DropdownMenu, DropdownItem, DropdownToggle } from "reactstrap"
import { useStateValue } from '../state.js';
import { useObjConfig } from "../hooks/ObjConfig.jsx";
import { splitPath } from "../utils.js";
import { ObjAvail } from "./ObjAvail.jsx";
import { ObjActions } from "./ObjActions.jsx";
import { ObjDigest } from "./ObjDigest.jsx";
import { ObjInstanceState } from "./ObjInstanceState.jsx";
import { ObjInstanceActions } from "./ObjInstanceActions.jsx";
import { Log } from "./Log.jsx"

const tabs = {
	MAIN: "Main",
	CONF: "Config",
	LOG: "Log",
}

function Title(props) {
	if (props.noTitle) {
		return null
	}
	return (
		<h2>{props.path}</h2>
	)
}

function ObjDetails(props) {
	//
	// props.path
	//
	const [active, setActive] = useState(tabs.MAIN)
	const [{user}, dispatch] = useStateValue()
	const sp = splitPath(props.path)

	const handleClick = (e) => {
		setActive(e.target.textContent)
	}

	return (
		<div>
			<Title path={props.path} noTitle={props.noTitle} />
			<Nav tabs>
				<NavItem>
					<NavLink href="#" active={active == tabs.MAIN} onClick={handleClick}>{tabs.MAIN}</NavLink>
				</NavItem>
				<NavItem>
					<NavLink href="#" active={active == tabs.CONF} onClick={handleClick}>{tabs.CONF}</NavLink>
				</NavItem>
				<NavItem>
					<NavLink href="#" active={active == tabs.LOG} onClick={handleClick}>{tabs.LOG}</NavLink>
				</NavItem>
			</Nav>
			<div className="pt-3">
				<ObjMain active={active} path={props.path} />
				<ObjConfig active={active} path={props.path} />
				<ObjLog active={active} path={props.path} />
			</div>
		</div>
	)
}

function ObjMain(props) {
	if (props.active != tabs.MAIN) {
		return null
	}
	const sp = splitPath(props.path)

	return (
		<div>
			<div className="clearfix">
				<div className="float-left">
					<h3>Object</h3>
				</div>
				<div className="float-right">
					<ObjActions
						path={props.path}
						splitpath={sp}
						title="Object Actions"
					/>
				</div>
			</div>
			<ObjDigest path={props.path} />
			<ObjInstances path={props.path} />
		</div>
	)
}

function ObjConfig(props) {
	//
	// props.path
	//
	if (props.active != tabs.CONF) {
		return null
	}
	const data = useObjConfig(props.path)
	if (!data) {
		return ( <Spinner type="grow" size="sm" /> )
	}
	const date = new Date(data.mtime * 1000)

	return (
		<div>
			<p className="text-secondary">Last Modified {date.toLocaleString()}</p>
			<pre>{data.data}</pre>
		</div>
	)
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
			<div className="table-adaptative">
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
			<td data-title="Node">{props.node}</td>
			<td data-title="Availability"><ObjAvail avail={cstat.monitor.nodes[props.node].services.status[props.path].avail} /></td>
			<td data-title="State"><ObjInstanceState node={props.node} path={props.path} /></td>
			<td data-title="Actions" className="text-right"><ObjInstanceActions node={props.node} path={props.path} /></td>
			<td className="flex-trailer"/>
			<td className="flex-trailer" />
			<td className="flex-trailer" />
		</tr>
	)
}

function ObjLog(props) {
	if (props.active != tabs.LOG) {
		return null
	}
	return (
		<div className="pt-3">
			<Log url={"/object/"+props.path} noTitle />
		</div>
	)
}

function ObjLogButton(props) {
	return (
		<Button
			color="outline-secondary"
			size="sm"
			onClick={(e) => setNav({
				"page": props.path + " Log",
				"links": ["Objects", props.path, "Log"]
			})}
		>Log</Button>
	)
}

export {
	ObjDetails
}
