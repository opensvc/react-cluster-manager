import React from "react";
import { useStateValue } from '../state.js';
import { state } from "../utils.js";

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

const useStyles = makeStyles(theme => ({
        root: {
                padding: theme.spacing(3, 2),
                marginTop: theme.spacing(3),
                overflowX: 'auto',
        },
}))

function ArbitratorsDetails(props) {
	const classes = useStyles()
	const [{ cstat }, dispatch] = useStateValue();
	var arbitrators = {}
	var arbNames = []
	var arbAddr = {}
	function handleClick(e) {
		dispatch({
			type: "setNav",
			page: "Arbitrators",
			links: ["Arbitrators"]
		})
	}
	if (cstat.monitor === undefined) {
		return null
	}
	for (var node in cstat.monitor.nodes) {
		var ndata = cstat.monitor.nodes[node]
		if (!ndata.arbitrators) {
			continue
		}
		if (!(node in arbitrators)) {
			arbitrators[node] = {}
		}
		for (var arbitrator in ndata.arbitrators) {
			var adata = ndata.arbitrators[arbitrator]
			if (arbNames.indexOf(arbitrator) < 0) {
				arbNames.push(arbitrator)
				arbAddr[arbitrator] = adata.name
			}
			arbitrators[node][arbitrator] = adata
		}
	}

	if (!arbNames.length) {
		return null
	}

	return (
		<Paper className={classes.root} id="arbitrators">
			<Typography variant="h4" component="h3">
				<Link href="#" onClick={handleClick}>Arbitrators</Link>
			</Typography>
			<Table>
				<TableHead>
					<TableRow className="text-secondary">
						<TableCell>Nodes</TableCell>
						{arbNames.map((an, i) => (
							<TableCell key={i} title={an}>{arbAddr[an]}</TableCell>
						))}
					</TableRow>
				</TableHead>
				<TableBody>
					{Object.keys(arbitrators).map((node) => (
						<ArbitratorDetails key={node} node={node} arbitrators={arbitrators[node]} />
					))}
				</TableBody>
			</Table>
		</Paper>
	)
}

function ArbitratorDetails(props) {
	var ans = []
	var an
	for (an in props.arbitrators) {
		var adata = props.arbitrators[an]
		adata.an = an
		ans.push(adata)
	}

	return (
		<TableRow>
			<TableCell data-title="Node">{props.node}</TableCell>
			{ans.map((adata, i) => (
				<TableCell key={i} data-title={adata.name}>
					<Typography component="span" color={adata.status == "up" ? "primary" : "error"}>
						{adata.status}
					</Typography>
				</TableCell>
			))}
		</TableRow>
	)
}

export {
	ArbitratorsDetails
}
