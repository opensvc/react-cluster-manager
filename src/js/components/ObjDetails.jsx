import React, { useState } from "react";
import {
	Button,
	Spinner,
	Nav,
	NavItem,
	NavLink,
	Dropdown,
	DropdownMenu,
	DropdownItem,
	DropdownToggle,
	InputGroupAddon,
	InputGroup,
	Input,
	FormGroup
} from "reactstrap"
import { useStateValue } from '../state.js';
import { useObjConfig } from "../hooks/ObjConfig.jsx";
import { fmtPath, splitPath } from "../utils.js";
import { ObjAvail } from "./ObjAvail.jsx";
import { ObjActions } from "./ObjActions.jsx";
import { ObjDigest } from "./ObjDigest.jsx";
import { ObjInstanceState } from "./ObjInstanceState.jsx";
import { ObjInstanceActions } from "./ObjInstanceActions.jsx";
import { Log } from "./Log.jsx"
import { apiInstanceAction } from "../api.js"

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
	if ((sp.kind == "svc") || (sp.kind == "vol")) {
		return <SvcMain path={props.path} />
	} else if ((sp.kind == "cfg") || (sp.kind == "sec") || (sp.kind == "ccfg")) {
		return <CfgMain path={props.path} />
	} else if ((sp.kind == "usr") || (sp.kind == "sec") || (sp.kind == "ccfg")) {
		return <UsrMain path={props.path} />
	} else {
		return null
	}
}

function SvcMain(props) {
	const sp = splitPath(props.path)
	const [{ cstat }, dispatch] = useStateValue();

	if (cstat.monitor === undefined) {
		return null
	}
	if ("scale" in cstat.monitor.services[props.path]) {
		var title = "Scaler"
	} else if (cstat.monitor.services[props.path].scaler_slave) {
		var title = "Scaler Slice"
	} else {
		var title = "Object"
	}
	return (
		<div>
			<div className="clearfix">
				<div className="float-left">
					<h3>{title}</h3>
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
			<ObjScale path={props.path} />
			<ObjInstances path={props.path} />
		</div>
	)
}

function ObjScale(props) {
	const [{ cstat }, dispatch] = useStateValue();

	if (cstat.monitor === undefined) {
		return null
	}
	if (!("scale" in cstat.monitor.services[props.path])) {
		return null
	}
	const [ scale, setScale] = useState(cstat.monitor.services[props.path].scale)
	function handleChange(e) {
		setScale(e.target.value)
	}
	function handleSubmit() {
		apiInstanceAction(
			"ANY",
			props.path,
			"scale",
			{"to": scale},
			(data) => dispatch({type: "parseApiResponse", data: data})
		)
	}
	return (
		<FormGroup>
			<InputGroup>
				<InputGroupAddon addonType="prepend">Scale Target</InputGroupAddon>
				<Input value={scale} min={0} max={1000} type="number" step="1" onChange={handleChange} />
				<InputGroupAddon addonType="append">
					<Button color="outline-secondary" onClick={handleSubmit}>Submit</Button>
				</InputGroupAddon>
			</InputGroup>
		</FormGroup>
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
	const sp = splitPath(props.path)
	if (cstat.monitor === undefined) {
		return null
	}
	if (cstat.monitor.services[props.path] === undefined) {
		return null
	}
	if ("scale" in cstat.monitor.services[props.path]) {
		var slice = <td>Slice</td>
	} else {
		var slice
	}
	return (
		<div>
			<h3>Instances</h3>
			<div className="table-adaptative">
				<table className="table table-hover">
					<thead>
						<tr className="text-secondary">
							{slice}
							<td>Node</td>
							<td>Availability</td>
							<td>State</td>
							<td className="text-right">Actions</td>
						</tr>
					</thead>
					<tbody>
						{Object.keys(cstat.monitor.nodes).sort().map((node) => (
							<InstanceLine key={node} node={node} path={props.path} sp={sp} />
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
	const instance = cstat.monitor.nodes[props.node].services.status[props.path]
	if (!instance) {
		return null
	}
	if ("scaler_slaves" in instance) {
		var slavePaths = []
		const re = RegExp("^"+fmtPath("[0-9]+\."+props.sp.name, props.sp.namespace, props.sp.kind)+"$")
		for (var path in cstat.monitor.services) {
			if (path.match(re)) {
				slavePaths.push(path)
			}
		}
		return slavePaths.sort().map((slavePath) => {
			var slaveSp = splitPath(slavePath)
			return ( <InstanceLine key={props.node+"-"+slavePath} node={props.node} path={slavePath} sp={slaveSp} slice={true} /> )
		})
	}
	function handleClick(e) {
		dispatch({
			type: "setNav",
			page: "ObjectInstance",
			links: ["Objects", props.path, props.node]
		})
	}
	if (props.slice) {
		var n = splitPath(props.path).name.replace(/\..*$/, "")
		var slice = <td data-title="Slice">{n}</td>
	} else {
		var slice
	}
	return (
		<tr onClick={handleClick}>
			{slice}
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
		<div>
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
