import React from "react";

function ObjAvail(props) {
	var cl = "text-secondary"
	if (props.avail == "up") {
		cl = "text-success"
	} else if (props.avail == "down") {
		cl = "text-danger"
	} else if (props.avail == "warn") {
		cl = "text-warning"
	}
	return (
		<span className={cl}>{props.avail}</span>
	)
}

export {
	ObjAvail
}
