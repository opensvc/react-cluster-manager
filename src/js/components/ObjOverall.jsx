import React from "react";
import WarningIcon from '@mui/icons-material/Warning';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';

const useStyles = makeStyles(theme => ({
        root: {
                color: theme.status.warning,
        },
}))

function ObjOverall(props) {
	const classes = useStyles()
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
