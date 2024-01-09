import React from "react";
import WarningIcon from '@mui/icons-material/Warning';
import Typography from '@mui/material/Typography';
import useClasses from "../hooks/useClasses.jsx";

const useStyles = theme => ({
        root: {
                color: theme.status.warning,
        },
})

function ObjOverall(props) {
	const classes = useClasses(useStyles)
	if (props.overall == "warn") {
		return (
			<Typography component="span" className={props.className}>
				<WarningIcon className={classes.root} />
			</Typography>
		)
	}
	return null
}

export {
	ObjOverall
}
