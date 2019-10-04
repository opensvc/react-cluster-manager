import React from "react";

import { useColorStyles } from '../styles.js'
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

function ObjAvail(props) {
	const classes = useColorStyles()
	return (
		<span title={props.avail}>
			<FiberManualRecordIcon className={clsx(props.className, classes[props.avail])} />
		</span>
	)
}

export {
	ObjAvail
}
