import React from "react";

function MonitorTargetBadge(props) {
	if (!props.target) {
		return null
	}
	return (
		<span className="ml-1 mr-1 badge badge-secondary">{props.target}</span>
	)
}

export {
	MonitorTargetBadge
}
