import React from "react";
import useClasses from "../hooks/useClasses";

const useStyles = theme => ({
        root: {
		display: "flex",
		flexDirection: "column",
                position: 'fixed',
                bottom: theme.spacing(2),
                right: theme.spacing(2),
        },
});

function Fabs(props) {
	const classes = useClasses(useStyles)
	return (
		<div className={classes.root}>
			{props.children}
		</div>
	)
}

export {
	Fabs,
}
