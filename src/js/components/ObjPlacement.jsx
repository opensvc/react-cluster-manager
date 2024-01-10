import React from "react";
import PlaceIcon from '@mui/icons-material/Place';
import Typography from '@mui/material/Typography';
import { ColorStyles } from "../styles.js"
import useClasses from "../hooks/useClasses.jsx";

function ObjPlacement(props) {
	const classes = useClasses(ColorStyles)
	if (props.placement == "optimal") {
		return null
	} else if (props.placement == "n/a") {
		return null
	} else if (!props.placement) {
		return null
	}
	return (
		<Typography component="span" className={props.className}>
			<PlaceIcon className={classes.warning} title={"Placement "+props.placement} />
		</Typography>
	)
}

export {
	ObjPlacement
}
