import React from "react";
import Typography from '@material-ui/core/Typography';

function MonitorTargetBadge(props) {
	if (!props.target) {
		return null
	}
	return (
		<Typography className={props.className} color="primary" component="span">
			{">"+props.target}
		</Typography>
	)
}

export {
	MonitorTargetBadge
}
