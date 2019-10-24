import React from "react";
import { useReactOidc } from '@axa-fr/react-oidc-context'
import { useTranslation } from 'react-i18next';
import { apiNodeAction } from "../api.js";
import useClusterStatus from "../hooks/ClusterStatus.jsx"

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';
import { useColorStyles } from "../styles.js";

const useStyles = makeStyles(theme => ({
	root: {
		marginTop: theme.spacing(3),
	},
	wrapper: {
		overflowX: "auto",
		marginLeft: -theme.spacing(2),
		marginRight: -theme.spacing(2),
	},
	chip: {
		margin: theme.spacing(1),
	},
}))


function Threads(props) {
	const { t, i18n } = useTranslation()
	const classes = useStyles()
	const { cstat } = useClusterStatus()
	if (!("monitor" in cstat)) {
		return null
	}
	var threads = ["listener", "dns", "monitor", "scheduler"]
	for (var section in cstat) {
		if (section.match(/^hb#/)) {
			threads.push(section)
		}
	}
	return (
		<Card id="threads" className={classes.root}>
			<CardHeader
				title={t("Threads")}
				subheader={cstat.cluster.name}
			/>
			<CardContent>
				<div className={classes.wrapper}>
					<Table>
						<TableHead>
							<TableRow className="text-secondary">
								<TableCell>{t("Name")}</TableCell>
								<TableCell>{t("State")}</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{threads.map((name) => (
								<Thread key={name} name={name} data={cstat[name]} />
							))}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	)
}

function Thread(props) {
	const classes = useColorStyles()
	if (!props.data) {
		return null
	}
	return (
		<TableRow>
			<TableCell>{props.name}</TableCell>
			<TableCell>
				<Typography className={classes[props.data.state]}>
					{props.data.state}
				</Typography>
			</TableCell>
		</TableRow>
	)
}

function ThreadActions(props) {
	const { oidcUser } = useReactOidc()
	function handleClick(e) {
		var action = e.target.getAttribute("value")
		apiNodeAction(props.node, action, {thread_id: props.thread_id}, oidcUser)
	}
	return (
		<div className="dropdown">
			<button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" data-boundary="window" aria-haspopup="true" aria-expanded="false"></button>
			<div className="dropdown-menu">
				<a className="dropdown-item" value="start" onClick={handleClick}>Start</a>
				<div className="dropdown-divider"></div>
				<a className="dropdown-item text-warning" value="stop" onClick={handleClick}>Stop</a>
			</div>
		</div>
	)
}


export {
	Threads,
	Thread
}
