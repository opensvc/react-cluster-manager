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
	child: {
		marginTop: theme.spacing(2),
	},
}))

function Fabs(props) {
	const classes = useStyles()
	return (
		<div className={classes.root}>
			{React.Children.map(props.children, child => (
				<div className={classes.child}>
					{child}
				</div>
			))}
		</div>
	)
}

export {
	Fabs,
}
