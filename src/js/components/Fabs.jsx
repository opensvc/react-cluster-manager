import React from "react";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
        root: {
		display: "flex",
		flexDirection: "column",
                position: 'fixed',
                bottom: theme.spacing(2),
                right: theme.spacing(2),
        },
}))

function Fabs(props) {
	const classes = useStyles()
	return (
		<div className={classes.root}>
			{props.children}
		</div>
	)
}

export {
	Fabs,
}
