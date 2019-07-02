import React from "react";
import { useStateValue } from "../state.js";
import { apiObjSetMonitor } from "../api.js";

function ObjActions(props) {
	//
	// props.path
	// props.splitpath
	//
	const [{}, dispatch] = useStateValue();
	function handleClick(e) {
		var target = e.target.getAttribute("value")
		apiObjSetMonitor(props.path, target, (data) => dispatch({type: "parseApiResponse", data: data}))
		return null
	}
	if ((props.splitpath.kind == "svc") || (props.splitpath.kind == "vol")) {
		var options = (
			<div className="dropdown-menu">
				<a className="dropdown-item" value="started" onClick={handleClick}>Start</a>
				<a className="dropdown-item" value="aborted" onClick={handleClick}>Abort</a>
				<a className="dropdown-item" value="frozen" onClick={handleClick}>Freeze</a>
				<a className="dropdown-item" value="thawed" onClick={handleClick}>Thaw</a>
				<a className="dropdown-item" value="placed" onClick={handleClick}>Giveback</a>
				<a className="dropdown-item" value="placed@<peer>" onClick={handleClick}>Switch</a>
				<div className="dropdown-divider"></div>
				<a className="dropdown-item text-warning" value="provisioned" onClick={handleClick}>Provision</a>
				<a className="dropdown-item text-warning" value="stopped" onClick={handleClick}>Stop</a>
				<div className="dropdown-divider"></div>
				<a className="dropdown-item text-danger" value="deleted" onClick={handleClick}>Delete</a>
				<a className="dropdown-item text-danger" value="purged" onClick={handleClick}>Purge</a>
				<a className="dropdown-item text-danger" value="unprovisioned" onClick={handleClick}>Unprovision</a>
			</div>
		)
	} else if (props.splitpath.kind == "ccfg") {
		var options = (
			<div className="dropdown-menu">
			</div>
		)
	} else if (props.splitpath.kind == "cfg") {
		var options = (
			<div className="dropdown-menu">
				<a className="dropdown-item text-danger" value="deleted" onClick={handleClick}>Delete</a>
			</div>
		)
	} else if (props.splitpath.kind == "sec") {
		var options = (
			<div className="dropdown-menu">
				<a className="dropdown-item text-danger" value="deleted" onClick={handleClick}>Delete</a>
			</div>
		)
	} else if (props.splitpath.kind == "usr") {
		var options = (
			<div className="dropdown-menu">
				<a className="dropdown-item text-danger" value="deleted" onClick={handleClick}>Delete</a>
			</div>
		)
	}
	return (
		<div className="dropdown" onClick={e => e.stopPropagation()}>
			<button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" data-boundary="window" aria-haspopup="true" aria-expanded="false">{props.text}</button>
			{options}
		</div>
	)
}

export {
	ObjActions
}
