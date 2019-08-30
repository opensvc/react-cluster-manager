import React from "react";
import { useStateValue } from '../state.js';
import { state, fancySizeMB } from '../utils.js';
import { threadsIssue, arbitratorsIssue, heartbeatsIssue, nodesIssue } from "../issues.js";
import { splitPath } from "../utils.js";

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(theme => ({
        root: {
                padding: theme.spacing(3, 2),
                marginTop: theme.spacing(3),
                overflowX: 'auto',
        },
        grid: {
                marginTop: theme.spacing(2),
	},
}))

function ClusterDigest(props) {
        const [{ cstat }, dispatch] = useStateValue();
        const classes = useStyles()
	var counts = {
		svc: 0,
		vol: 0,
		usr: 0,
		sec: 0,
		cfg: 0,
		ccfg: 0,
	}
	var namespaces = {}
	var stats = {
		memAvail: 0,
		memTotal: 0,
		memAvailMin: null,
		memAvailMax: null,
		swapAvail: 0,
		swapTotal: 0,
		swapAvailMin: null,
		swapAvailMax: null,
		loadAvg: 0,
		loadAvgMin: null,
		loadAvgMax: null,
	}
        if (cstat.monitor === undefined) {
                return null
        }
	for (var node in cstat.monitor.nodes) {
		var n = cstat.monitor.nodes[node]
		var memAvail = n.stats.mem_avail * n.stats.mem_total / 100
		var swapAvail = n.stats.swap_avail * n.stats.swap_total / 100
		stats.memTotal += n.stats.mem_total
		stats.memAvail += memAvail
		stats.swapTotal += n.stats.swap_total
		stats.swapAvail += swapAvail
		stats.loadAvg += n.stats.load_15m
		stats.memAvailMin = stats.memAvailMin === null ? memAvail : Math.min(memAvail, stats.memAvailMin)
		stats.memAvailMax = stats.memAvailMax === null ? memAvail : Math.max(memAvail, stats.memAvailMax)
		stats.swapAvailMin = stats.swapAvailMin === null ? swapAvail : Math.min(swapAvail, stats.swapAvailMin)
		stats.swapAvailMax = stats.swapAvailMax === null ? swapAvail : Math.max(swapAvail, stats.swapAvailMax)
		stats.loadAvgMin = stats.loadAvgMin === null ? n.stats.load_15m : Math.min(n.stats.load_15m, stats.loadAvgMin)
		stats.loadAvgMax = stats.loadAvgMax === null ? n.stats.load_15m : Math.max(n.stats.load_15m, stats.loadAvgMax)
	}
	for (var path in cstat.monitor.services) {
		var sp = splitPath(path)
		counts[sp.kind]++
		namespaces[sp.namespace] = null
	}
	counts.nodes = cstat.cluster.nodes.length
	counts.namespaces = Object.keys(namespaces).length
	stats.memUse = 100*(stats.memTotal-stats.memAvail)/stats.memTotal
	stats.swapUse = 100*(stats.swapTotal-stats.swapAvail)/stats.swapTotal

	return (
                <Paper id="nodes" className={classes.root}>
                        <Typography variant="h4" component="h3">
                                <Link href="#">Digest</Link>
                        </Typography>
			<Grid container spacing={3} className={classes.grid}>
				<Grid item xs>
					<Typography variant="subtitle1" component="h3">
						Memory
					</Typography>
					<Typography variant="h4" color="primary" component="h3">
						{stats.memUse.toFixed(0)}%
					</Typography>
					<Typography variant="caption" color="textSecondary" component="h3">
						<div>Used: {fancySizeMB(stats.memTotal-stats.memAvail)}</div>
						<div>Total: {fancySizeMB(stats.memTotal)}</div>
						<div>MinAvail: {fancySizeMB(stats.memAvailMin)}</div>
						<div>MaxAvail: {fancySizeMB(stats.memAvailMax)}</div>
					</Typography>
				</Grid>
				<Grid item xs>
					<Typography variant="subtitle1" component="h3">
						Swap
					</Typography>
					<Typography variant="h4" color="primary" component="h3">
						{stats.swapUse.toFixed(0)}%
					</Typography>
					<Typography variant="caption" color="textSecondary" component="h3">
						<div>Used: {fancySizeMB(stats.swapTotal-stats.swapAvail)}</div>
						<div>Total: {fancySizeMB(stats.swapTotal)}</div>
						<div>MinAvail: {fancySizeMB(stats.swapAvailMin)}</div>
						<div>MaxAvail: {fancySizeMB(stats.swapAvailMax)}</div>
					</Typography>
				</Grid>
				<Grid item xs>
					<Typography variant="subtitle1" component="h3">
						Load
					</Typography>
					<Typography variant="h4" color="primary" component="h3">
						{stats.loadAvg.toFixed(1)}
					</Typography>
					<Typography variant="caption" color="textSecondary" component="h3">
						<div>15min average</div>
						<div>Min: {stats.loadAvgMin.toFixed(1)}</div>
						<div>Max: {stats.loadAvgMax.toFixed(1)}</div>
					</Typography>
				</Grid>
				<Grid item xs>
					<Table>
						<TableBody>
							<TableRow>
								<TableCell>Nodes</TableCell>
								<TableCell>{counts.nodes}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Namespaces</TableCell>
								<TableCell>{counts.namespaces}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Services</TableCell>
								<TableCell>{counts.svc}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Volumes</TableCell>
								<TableCell>{counts.vol}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Configs</TableCell>
								<TableCell>{counts.cfg}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Secrets</TableCell>
								<TableCell>{counts.sec}</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Users</TableCell>
								<TableCell>{counts.usr}</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</Grid>
			</Grid>
		</Paper>
	)
}

export {
        ClusterDigest
}

