import React from "react"
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'

const useStyles = makeStyles(theme => ({
	content: {
		height: "100%",
	},
}))

function PropGroup(props) {
	const classes = useStyles()
	const { i18n, t } = useTranslation()
	return (
		<Grid item xs={12} sm={6} md={4}>
			<Card id={props.title} className={classes.content}>
				<CardHeader
					title={t(props.title)}
					action={props.action}
				/>
				<CardContent>
					{props.children}
				</CardContent>
			</Card>
		</Grid>
	)
}

export default PropGroup
