import React from "react";
import AcUnitIcon from '@material-ui/icons/AcUnit';
import Typography from '@material-ui/core/Typography';

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
