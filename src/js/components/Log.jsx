import React from "react";
import { Spinner } from "reactstrap"
import { useLog } from "../hooks/Log.jsx"

function Log(props) {
	const log = useLog(props.url)
	if (props.noTitle) {
		var title = null
	} else {
		var title = ( <h3>Logs</h3> )
	}
	return (
		<div className="pb-3">
			{title}
			<LogLines log={log} />
		</div>
	)
}

function LogLines(props) {
	if (!props.log) {
		return ( <Spinner type="grow" color="primary" size="sm" /> )
	}
	return (
		<div className="d-flex flex-column-reverse text-break">
			{props.log.map((line, i) => (
				<LogLine key={i} data={line} />
			))}
		</div>
	)	
}

function LogLine(props) {
	var l = props.data.split(" - ")
	var cl = "border-left-4 p-1 pl-2 "
	if (l[2] == "INFO") {
	} else if (l[2] == "WARNING") {
		cl += "border-warning"
	} else if (l[2] == "ERROR") {
		cl += "border-danger"
	} else if (l[2] == "DEBUG") {
		cl += "border-muted"
	}
	return (
		<div className={cl}>
			<div className="text-secondary small">{l[0]} - {l[1]}</div>
			<div>{l.slice(3).join(" - ")}</div>
		</div>
	)
}

export {
	Log
}
