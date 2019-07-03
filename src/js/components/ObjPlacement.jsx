import React from "react";

function ObjPlacement(props) {
	if (props.placement == "optimal") {
		return (<span />)
	} else if (props.placement == "n/a") {
		return (<span />)
	} else if (!props.placement) {
		return (<span />)
	}
	return (
		<span className="ml-1 mr-1 badge badge-warning" title={props.placement}>placement</span>
	)
}

export {
	ObjPlacement
}
