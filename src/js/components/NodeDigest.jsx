import React, { useState } from "react"
import { useStateValue } from '../state.js'
import { useTranslation } from 'react-i18next'
import { NodeActions } from "./NodeActions.jsx"
import { NodeStateList } from "./NodeStateList.jsx"

import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import Chip from '@material-ui/core/Chip'
import Divider from '@material-ui/core/Divider'
import Skeleton from '@material-ui/lab/Skeleton'

const useStyles = makeStyles(theme => ({
	content: {
		height: "100%",
	},
	divider: {
		marginBottom: theme.spacing(2),
	},
}))

function NodeDigest(props) {
	const classes = useStyles()
	const { name, nodeData } = props
	const { t, i18n } = useTranslation()
	const [{user}, dispatch] = useStateValue()

	return (
		<Card className={classes.content}>
			<CardHeader
				title={t("Node")}
				subheader={name}
				action={
					<NodeActions selected={name} />
				}
			/>
			<CardContent>
				<NodeStateList name={name} />
				<Divider className={classes.divider} />
				<Grid container spacing={1}>
					{["Labels", "Server", "Processor", "Memory", "System", "Agent", "Network", "Initiators", "Hardware", "Log"].map((id) => (
					<Grid item key={id}>
						<Chip label={t(id)} component="a" href={"#"+id} clickable />
					</Grid>
					))}
				</Grid>
			</CardContent>
		</Card>
	)
}

export {
	NodeDigest
}
