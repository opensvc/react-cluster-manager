import React from "react"
import ClusterDigest from "./ClusterDigest.jsx"
import SvcMap from "./SvcMap.jsx"
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

const useStyles = makeStyles(theme => ({
        root: {
		marginTop: theme.spacing(2),
        },
}))

function Cluster(props) {
	const classes = useStyles()
	return (
		<Grid container spacing={2} className={classes.root}>
			<Grid item md={6}>
				<ClusterDigest />
			</Grid>
			<Grid item md={6}>
				<SvcMap />
			</Grid>
		</Grid>
	)
}

export default Cluster
