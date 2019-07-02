import React from "react";

function ObjProvisioned(props) {
	if (props.provisioned == false) {
		return (
			<span className="ml-1 mr-1 badge badge-danger" title={props.provisioned.toString()}>unprovisioned</span>
		)
	} else if (props.provisioned == true) {
		return (<span />)
	} else {
		return (<span />)
	}
}

export {
	ObjProvisioned
}
