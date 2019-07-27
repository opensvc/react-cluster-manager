import React from "react";
import { splitPath } from "../utils.js";
import { ObjDigest } from "./ObjDigest.jsx";
import { ObjInstanceDigest } from "./ObjInstanceDigest.jsx";
import { ObjInstanceCounts } from "./ObjInstanceCounts.jsx";
import { ObjInstanceResources } from "./ObjInstanceResources.jsx";

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
        root: {
                padding: theme.spacing(3, 2),
                marginTop: theme.spacing(3),
		overflowX: "scroll",
        },
}))

function ObjInstanceDetails(props) {
	//
	// props.path
	// props.node
	//
	const classes = useStyles()
	const sp = splitPath(props.path)
	return (
		<Paper className={classes.root}>
			<Typography variant="h4" component="h2">
				{props.path} @ {props.node}
			</Typography>
			<Typography variant="h5" component="h2">
				Object
			</Typography>
			<ObjDigest path={props.path} />
			<Typography variant="h5" component="h2">
				Instance
			</Typography>
			<ObjInstanceDigest path={props.path} node={props.node} />
			<ObjInstanceResources path={props.path} node={props.node} />
		</Paper>
	)
}

export {
	ObjInstanceDetails
}
