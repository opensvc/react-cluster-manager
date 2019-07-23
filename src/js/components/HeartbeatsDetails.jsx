import React from "react";
import { useStateValue } from '../state.js';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import { useColorStyles } from "../styles.js"

const useStyles = makeStyles(theme => ({
        root: {
                padding: theme.spacing(3, 2),
                marginTop: theme.spacing(3),
                overflowX: 'auto',
        },
}))

function HeartbeatsDetails(props) {
	const classes = useStyles()
	const [{ cstat }, dispatch] = useStateValue();
	if (cstat.monitor === undefined) {
		return null
	}
	var hbNames = []
	function handleClick(e) {
		dispatch({
			type: "setNav",
			page: "Heartbeats",
			links: ["Heartbeats"]
		})
	}
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
		<Paper id="heartbeats" className={classes.root}>
			<Typography variant="h4" component="h3">
				<Link className="text-dark" href="#" onClick={handleClick}>Heartbeats</Link>
			</Typography>
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
		</Paper>
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
