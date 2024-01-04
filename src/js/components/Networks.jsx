import React from "react";
import { useNavigate } from 'react-router-dom';
import { useStateValue } from '../state.js'
import { useTranslation } from 'react-i18next';
import { useNetworksStatus } from "../hooks/NetworksStatus.jsx"
import { NetworkAdd } from "./NetworkAdd.jsx"

import { makeStyles } from '@mui/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Hidden from '@mui/material/Hidden';

const useStyles = makeStyles(theme => ({
	root: {
		marginTop: theme.spacing(3),
	},
	wrapper: {
		overflowX: 'auto',
		marginLeft: -theme.spacing(2),
		marginRight: -theme.spacing(2),
	},
	row: {
		'&:hover': {
			cursor: "pointer",
		},
	},
}))

function getLines(data) {
	if (!data) {
		return []
	}
	var lines = []
	for (var name in data) {
		var _data = data[name]
		_data.name = name
		lines.push(_data)
	}
	return lines
}

function Networks(props) {
	const classes = useStyles()
	const { t, i18n } = useTranslation()
	const data = useNetworksStatus()
	const [{}, dispatch] = useStateValue()
	var lines = getLines(data)

	return (
		<Card id="networks" className={classes.root}>
			<CardHeader
				title={t("Networks")}
				action={
					<NetworkAdd />
				}
			/>
			<CardContent>
				<div className={classes.wrapper}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>{t("Name")}</TableCell>
								<TableCell>Type</TableCell>
								<TableCell>{t("Network")}</TableCell>
								<TableCell>{t("Addresses")}</TableCell>
								<TableCell>{t("Usage")}</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{lines.map((line, i) => (
								<NetworksLine key={i} index={i} data={line} />
							))}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	)
}

function NetworksLine(props) {
	const {index, data} = props
	const [{}, dispatch] = useStateValue()
	const classes = useStyles()
	const navigate = useNavigate()
	function handleLineClick(event) {
		event.stopPropagation()
		navigate("/network?name="+data.name)
	}
	return (
		<TableRow onClick={handleLineClick} className={classes.row}>
			<TableCell>{data.name}</TableCell>
			<TableCell>{data.type}</TableCell>
			<TableCell>{data.network}</TableCell>
			<TableCell>{data.used}</TableCell>
			<TableCell>{data.pct.toFixed(2)}%</TableCell>
		</TableRow>
	)
}

export {
	Networks,
}
