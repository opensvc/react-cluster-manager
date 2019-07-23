import React from "react";

import { useColorStyles } from '../styles.js'
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';

function ObjAvail(props) {
	const classes = useColorStyles()
	return (
		<Typography component="span" className={clsx(props.className, classes[props.avail])}>
			{props.avail}
		</Typography>
	)
}

export {
	ObjAvail
}
