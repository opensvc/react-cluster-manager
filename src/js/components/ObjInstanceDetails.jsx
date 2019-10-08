import React from "react";
import { useLocation } from "react-router";
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
        const loc = useLocation()
        let params = new URLSearchParams(loc.search)
        const path = params.get("path")
        const node = params.get("node")
	const classes = useStyles()
	const sp = splitPath(path)
	return (
		<Grid container className={classes.root}>
			<Grid item xs={12} md={6} className={classes.section}>
				<ObjDigest path={path} />
			</Grid>
			<Grid item xs={12} md={6} className={classes.section}>
				<ObjInstanceDigest path={path} node={node} />
			</Grid>
			<Grid item xs={12} className={classes.section}>
				<Paper>
					<ObjInstanceResources path={path} node={node} />
				</Paper>
			</Grid>
		</Grid>
	)
}

export {
	ObjInstanceDetails
}
