import React from "react";
import WarningIcon from '@mui/icons-material/Warning';
import Typography from '@mui/material/Typography';

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
