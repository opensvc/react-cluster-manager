import React from "react";
import WarningIcon from '@material-ui/icons/Warning';
import Typography from '@material-ui/core/Typography';

function ObjProvisioned(props) {
	if (props.provisioned == false) {
		return (
			<Typography component="span" className={props.className}>
				<WarningIcon color="error" title="Not Provisionned" />
			</Typography>
		)
	} else if (props.provisioned == true) {
		return null
	} else {
		return null
	}
}

export {
	ObjProvisioned
}
