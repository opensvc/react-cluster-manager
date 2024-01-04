import React from "react"
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@mui/styles'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

const useStyles = makeStyles(theme => ({
	prop: {
                paddingTop: theme.spacing(1),
	},
	edited: {
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(2),
	},
	actions: {
		"&:first-child": {
			marginRight: -theme.spacing(1),
		},
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
				<Grid container direction="row-reverse" wrap="nowrap">
					{props.change && <Grid item className={classes.actions}>{props.change}</Grid>}
					{props.remove && <Grid item className={classes.actions}>{props.remove}</Grid>}
				</Grid>
			</Grid>
			}
		</Grid>
	)
}

export default Prop
