import React from "react"
import { useStateValue } from '../state.js'
import { state } from '../utils.js'
import { ClusterDigest } from "./ClusterDigest.jsx"
import { SvcMap } from "./SvcMap.jsx"
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

const useStyles = makeStyles(theme => ({
        root: {
		marginTop: theme.spacing(2),
        },
}))

function Cluster(props) {
	const [{ cstat }, dispatch] = useStateValue()
	const classes = useStyles()
	if (!cstat.cluster) {
		return null
	}
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

export {
	Cluster
}
