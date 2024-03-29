import React from "react"
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import useClasses from "../hooks/useClasses.jsx";

const styles = theme => ({
	content: {
		height: "100%",
	},
})

function PropGroup(props) {
	const classes = useClasses(styles)
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
