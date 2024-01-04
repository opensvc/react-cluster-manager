import React, { useState } from "react"
import { useStateValue } from '../state.js'
import { useTranslation } from 'react-i18next'
import { NodeActions } from "./NodeActions.jsx"
import { NodeStateList } from "./NodeStateList.jsx"

import { makeStyles } from '@mui/styles'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'

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
