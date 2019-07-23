import React from "react";
import Typography from '@material-ui/core/Typography';

function MonitorStatusBadge(props) {
	if (!props.state) {
		return null
	}
	if (props.state == "idle") {
		return null
	}
	return (
		<Typography className={props.className} color="primary" component="span">
			{props.state}
		</Typography>
	)
}

export {
	MonitorStatusBadge
}
