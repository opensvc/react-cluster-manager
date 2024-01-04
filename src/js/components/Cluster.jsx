import React from "react"
import ClusterDigest from "./ClusterDigest.jsx"
import SvcMap from "./SvcMap.jsx"
import { makeStyles } from '@mui/styles'
import Grid from '@mui/material/Grid'

const useStyles = makeStyles(theme => ({
        root: {
		marginTop: theme.spacing(2),
        },
        item: {
		flexGrow: 1,
        },
}))

function Cluster(props) {
	const classes = useStyles()
	return (
		<Grid container spacing={2} className={classes.root}>
			<Grid item md={6} className={classes.item}>
				<ClusterDigest />
			</Grid>
			<Grid item md={6} className={classes.item}>
				<SvcMap />
			</Grid>
		</Grid>
	)
}

export default Cluster
