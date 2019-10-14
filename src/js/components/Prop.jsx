import React from "react"
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(theme => ({
	prop: {
                paddingTop: theme.spacing(1),
	},
	edited: {
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(2),
	},
}))

function Prop(props) {
	const classes = useStyles()
	const { i18n, t } = useTranslation()
	if (props.remove || props.change) {
		var cols = {title: 4, value: 4, action: 4}
		var className = classes.edited
	} else {
		var cols = {title: 8, value: 4, action: 0}
		var className = null
	}
	return (
		<Grid container className={classes.prop}>
			<Grid item xs={cols.title} className={className}>
				<Typography color="textSecondary">
					{t(props.title)}
				</Typography>
			</Grid>
			<Grid item xs={cols.value} className={className}>
				<Typography>
					{props.value}
				</Typography>
			</Grid>
			{(props.remove || props.change) &&
			<Grid item xs={cols.action}>
				<Grid container wrap="nowrap">
					{props.change && <Grid item>{props.change}</Grid>}
					{props.remove && <Grid item>{props.remove}</Grid>}
				</Grid>
			</Grid>
			}
		</Grid>
	)
}

export default Prop
