import React from "react";

import { useColorStyles } from '../styles.js'
import Typography from '@material-ui/core/Typography';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

function ObjLeader(props) {
	const classes = useColorStyles()
	if (props.placement != "leader") {
		return null
	}
	return (
		<span title="leader">
			<Typography component="span" color="primary">
				<KeyboardArrowUpIcon />
			</Typography>
		</span>
	)
}

export {
	ObjLeader
}
