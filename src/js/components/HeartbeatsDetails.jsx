import React from "react";
import { useStateValue } from '../state.js';
import { useTranslation } from 'react-i18next';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
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
	const [{ cstat }, dispatch] = useStateValue();
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
								<TableCell>Nodes</TableCell>
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
	const [{ cstat }, dispatch] = useStateValue();
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
