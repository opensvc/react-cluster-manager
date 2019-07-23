import React from "react";
import WarningIcon from '@material-ui/icons/Warning';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

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
