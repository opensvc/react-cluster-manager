import React from "react";
import { splitPath } from "../utils.js";
import { ObjDigest } from "./ObjDigest.jsx";
import { ObjInstanceDigest } from "./ObjInstanceDigest.jsx";
import { ObjInstanceCounts } from "./ObjInstanceCounts.jsx";
import { ObjInstanceResources } from "./ObjInstanceResources.jsx";

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
        root: {
		flexGrow: 1,
        },
        section: {
                padding: theme.spacing(1),
		overflowX: "auto",
        }
}))

function ObjInstanceDetails(props) {
	//
	// props.path
	// props.node
	//
	const classes = useStyles()
	const sp = splitPath(props.path)
	return (
		<Grid container className={classes.root}>
			<Grid item xs={12} md={6} className={classes.section}>
				<ObjDigest path={props.path} />
			</Grid>
			<Grid item xs={12} md={6} className={classes.section}>
				<ObjInstanceDigest path={props.path} node={props.node} />
			</Grid>
			<Grid item xs={12} className={classes.section}>
				<Paper>
					<ObjInstanceResources path={props.path} node={props.node} />
				</Paper>
			</Grid>
		</Grid>
	)
}

export {
	ObjInstanceDetails
}
