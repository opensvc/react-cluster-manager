import React, { Component } from "react";
import { useStateValue } from '../state.js';
import { splitPath } from "../utils.js";
import { DeployButton } from "./Deploy.jsx";
import { ObjAvail } from "./ObjAvail.jsx";
import { ObjActions } from "./ObjActions.jsx";
import { ObjState } from "./ObjState.jsx";
import { ObjInstanceCounts } from "./ObjInstanceCounts.jsx";

function ObjsKindFilterButton(props) {
	const [{}, dispatch] = useStateValue();
	if (props.value) {
		var cl = "w-100 btn btn-secondary active"
	} else {
		var cl = "w-100 btn btn-light"
	}
	function handleClick(e) {
		dispatch({"type": "toggleKindFilter", "kind": props.kind})
		e.target.blur()
	}
	return (
		<button type="button" className={cl} onClick={handleClick}>{props.kind}</button>
	)
}
function ObjsKindFilter(props) {
	const [{ kinds }, dispatch] = useStateValue();
	return (
		<div className="d-flex btn-group btn-group-toggle" data-toggle="buttons">
			{Object.keys(kinds).map((kind) => (
				<ObjsKindFilterButton key={kind} kind={kind} value={kinds[kind]} />
			))}
		</div>
	)
}

function ObjsFilter(props) {
	const [{ filters }, dispatch] = useStateValue();
	function handleChange(e) {
		var t = e.target.getAttribute("t")
		dispatch({"type": "setFilter", "filter_type": t, "filter_value": e.target.value})
	}
	function handleClick(e) {
		var t = e.target.getAttribute("value")
		var input = e.target.parentNode.parentNode.parentNode.querySelector("input")
		dispatch({"type": "setFilter", "filter_type": t, "filter_value": input.value})
	}
	var currentType = Object.keys(filters)[0]
	return (
		<div className="input-group">
			<div className="input-group-prepend">
				<button className="btn btn-outline-secondary dropdown-toggle text-capitalize" type="button" data-toggle="dropdown" data-boundary="window" aria-haspopup="true" aria-expanded="false">{currentType}</button>
				<div className="dropdown-menu">
					<a className="dropdown-item" value="name" onClick={handleClick}>Name</a>
					<a className="dropdown-item" value="namespace" onClick={handleClick}>Namespace</a>
					<a className="dropdown-item" value="path" onClick={handleClick}>Path</a>
				</div>
			</div>
			<input type="text" className="form-control" placeholder="regexp" aria-label="Filter" t={currentType} onChange={handleChange} value={filters[currentType]}/>
		</div>
	)
}

function Objs(props) {
	const [{ cstat }, dispatch] = useStateValue();
	if (cstat.monitor === undefined) {
		return null
	}

	function handleTitleClick(e) {
		dispatch({
			type: "setNav",
			page: "Objects",
			links: ["Objects"],
		})
	}
	return (
		<div id="objects">
			<h2><a className="text-dark" href="#" onClick={handleTitleClick}>Objects</a></h2>
			<div className="d-flex btn-toolbar justify-content-between pb-3">
				<div className="mr-2 mb-2 flex-grow-1"><ObjsKindFilter /></div>
				<div className="mr-2 mb-2 flex-grow-1"><ObjsFilter /></div>
				<div className="mr-2 mb-2"><DeployButton /></div>
			</div>
			<div className="table-adaptative">
				<table className="table table-hover">
					<thead>
						<tr className="text-secondary">
							<td>Namespace</td>
							<td>Kind</td>
							<td>Name</td>
							<td>Availability</td>
							<td>State</td>
							<td>Instances</td>
							<td className="text-right">Actions</td>
						</tr>
					</thead>
					<tbody>
						{Object.keys(cstat.monitor.services).sort().map((path) => (
							<ObjLine key={path} path={path} />
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}

function ObjLine(props) {
	const [{ cstat, kinds, filters }, dispatch] = useStateValue();
	if (cstat.monitor === undefined) {
		return null
	}
	const sp = splitPath(props.path)

	// Apply filters
	if (!kinds[sp.kind]) {
		return null
	}
	try {
		if (filters.name && !RegExp(filters.name, "i").test(sp.name)) {
			return null
		}
	} catch (e) {}
	try {
		if (filters.namespace && !RegExp(filters.namespace, "i").test(sp.namespace)) {
			return null
		}
	} catch (e) {}
	try {
		if (filters.path && !RegExp(filters.path, "i").test(props.path)) {
			return null
		}
	} catch (e) {}


	function handleClick(e) {
		dispatch({
			type: "setNav",
			page: "Object",
			links: ["Objects", props.path]
		})
	}
	return (
		<tr onClick={handleClick}>
			<td data-title="Namespace">{sp.namespace}</td>
			<td data-title="Kind">{sp.kind}</td>
			<td data-title="Name">{sp.name}</td>
			<td data-title="Availability"><ObjAvail avail={cstat.monitor.services[props.path].avail} /></td>
			<td data-title="State"><ObjState path={props.path} /></td>
			<td data-title="Instances"><ObjInstanceCounts path={props.path} /></td>
			<td data-title="Actions" className="text-right"><ObjActions path={props.path} splitpath={sp} title="" /></td>
			<td className="flex-trailer"/>
			<td className="flex-trailer" />
			<td className="flex-trailer" />
		</tr>
	)
}

export {
	Objs
}
