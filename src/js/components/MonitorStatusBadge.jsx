import React from "react";

function MonitorStatusBadge(props) {
	if (!props.state) {
		return null
	}
	if (props.state == "idle") {
		return null
	}
	return (
		<span className="ml-1 mr-1 badge badge-secondary">{props.state}</span>
	)
}

export {
	MonitorStatusBadge
}
