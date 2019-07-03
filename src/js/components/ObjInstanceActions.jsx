import React, { Component } from "react";
import { useStateValue } from '../state.js';
import { apiInstanceAction } from "../api.js";

function ObjInstanceActions(props) {
	const [{cstat}, dispatch] = useStateValue();
	function handleClick(e) {
		var action = e.target.getAttribute("value")
		apiInstanceAction(props.node, props.path, action, {}, (data) => dispatch({type: "parseApiResponse", data: data}))
	}
	return (
		<div className="dropdown">
			<button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
			<div className="dropdown-menu">
				<a className="dropdown-item" value="start" onClick={handleClick}>Start</a>
				<a className="dropdown-item" value="freeze" onClick={handleClick}>Freeze</a>
				<a className="dropdown-item" value="thaw" onClick={handleClick}>Thaw</a>
				<div className="dropdown-divider"></div>
				<a className="dropdown-item text-warning" value="provision" onClick={handleClick}>Provision</a>
				<a className="dropdown-item text-warning" value="stop" onClick={handleClick}>Stop</a>
				<div className="dropdown-divider"></div>
				<a className="dropdown-item text-danger" value="delete" onClick={handleClick}>Delete</a>
				<a className="dropdown-item text-danger" value="purge" onClick={handleClick}>Purge</a>
				<a className="dropdown-item text-danger" value="unprovision" onClick={handleClick}>Unprovision</a>
			</div>
		</div>
	)
}

export {
	ObjInstanceActions
}
