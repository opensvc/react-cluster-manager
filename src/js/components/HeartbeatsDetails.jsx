import React from "react";
import useClusterStatus from "../hooks/ClusterStatus.jsx"
import { useTranslation } from 'react-i18next';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useColorStyles } from "../styles.js"

const useStyles = makeStyles(theme => ({
        root: {
                marginTop: theme.spacing(3),
        },
	wrapper: {
                overflowX: 'auto',
                marginLeft: -theme.spacing(2),
                marginRight: -theme.spacing(2),
	},
}))

function HeartbeatsDetails(props) {
	const classes = useStyles()
	const { cstat } = useClusterStatus()
	const { t, i18n } = useTranslation()
	if (cstat.monitor === undefined) {
		return null
	}
	var hbNames = []
        for (var hbName in cstat) {
		if (!/^hb#/.test(hbName)) {
			continue
		}
		if (hbName.match(/rx$/)) {
			hbNames.push(hbName.slice(0, -3))
		}
	}
	var nodes = Object.keys(cstat.monitor.nodes)

	return (
		<Card id="heartbeats" className={classes.root}>
			<CardHeader
				title={t("Heartbeats")}
				subheader={cstat.cluster.name}
			/>
			<CardContent>
				<div className={classes.wrapper}>
					<Table>
						<TableHead>
							<TableRow className="text-secondary">
								<TableCell>{t("Nodes")}</TableCell>
								{hbNames.map((hbName, i) => (
									<TableCell key={i}>{hbName}</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{cstat.cluster.nodes.map((node, i) => (
								<NodeHeartbeats key={i} node={node} hbNames={hbNames} />
							))}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	)
}

function NodeHeartbeats(props) {
	return (
		<TableRow>
			<TableCell data-title="Node">{props.node}</TableCell>
			{props.hbNames.map((hbName, i) => (
				<NodeHeartbeat key={i} node={props.node} hbName={hbName} />
			))}
		</TableRow>
	)
}

function NodeHeartbeat(props) {
	const classes = useColorStyles()
	const { cstat } = useClusterStatus()
	if (cstat.monitor === undefined) {
		return null
	}
	function badge(beating) {
		var cl = "undef"
		if (beating == false) {
			cl = "down"
		} else if (beating == true) {
			cl = "up"
		}
		return cl
	}
	return (
		<TableCell>
			<Typography component="span" className={classes[badge(cstat[props.hbName+".rx"].peers[props.node].beating)]}>rx</Typography>
			&nbsp;/&nbsp;
			<Typography component="span" className={classes[badge(cstat[props.hbName+".tx"].peers[props.node].beating)]}>tx</Typography>
		</TableCell>
	)
}


export {
	HeartbeatsDetails
}
