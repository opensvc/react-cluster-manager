import React from "react";

function ObjOverall(props) {
	if (props.overall == "warn") {
		return (
			<span className="ml-1 mr-1 badge badge-warning">warning</span>
		)
	}
	return (
		<span />
	)
}

export {
	ObjOverall
}
