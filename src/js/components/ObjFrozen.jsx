import React from "react";

function ObjFrozen(props) {
	if (!props.frozen) {
		return (<span />)
	} else if (props.frozen == "thawed") {
		return (<span />)
	}
	return (
		<span className="ml-1 mr-1 badge badge-info" title={props.frozen}>frozen</span>
	)
}

export {
	ObjFrozen
}
