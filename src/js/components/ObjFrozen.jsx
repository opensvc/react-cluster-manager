import React from "react";
import AcUnitIcon from '@mui/icons-material/AcUnit';
import Typography from '@mui/material/Typography';

function ObjFrozen(props) {
	if (!props.frozen) {
		return null
	} else if (props.frozen == "thawed") {
		return null
	}
	return (
		<Typography component="span" className={props.className}>
			<AcUnitIcon color="primary" title="Frozen" />
		</Typography>
	)
}

export {
	ObjFrozen
}
