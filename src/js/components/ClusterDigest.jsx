import React from "react";
import useClusterStatus from "../hooks/ClusterStatus.jsx"
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import { state, fancySizeMB } from '../utils.js';
import { arbitratorsIssue, heartbeatsIssue, nodesIssue, objectsIssue } from "../issues.js";
import { splitPath } from "../utils.js";
import { usePoolsStatus } from "../hooks/PoolsStatus.jsx"
import { useNetworksStatus } from "../hooks/NetworksStatus.jsx"
import { ClusterActions } from "./ClusterActions.jsx"
import { DeployButton } from "./DeployButton.jsx"

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import WarningIcon from '@mui/icons-material/Warning';
import {isEmpty} from "lodash";
import useClasses from "../hooks/useClasses.jsx";

const styles = theme => ({
	root: {
		height: "100%",
	},
	item: {
		minWidth: "10em",
	},
        warn: {
                color: theme.status.warning,
        },
});

function ClusterDigest(props) {
	const { t, i18n } = useTranslation()
        const { cstat } = useClusterStatus()
        const classes = useClasses(styles)
	const pools = usePoolsStatus()
	const networks = useNetworksStatus()
	const navigate = useNavigate()

	let counts = {
		svc: 0,
		vol: 0,
		usr: 0,
		sec: 0,
		cfg: 0,
		ccfg: 0,
	};
	let namespaces = {};
	let stats = {
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
	};
	if (cstat.monitor === undefined) {
                return null
        }
	for (let node in cstat.monitor.nodes) {
		let n = cstat.monitor.nodes[node]
		if (isEmpty(n) || (n.stats === undefined)) {
			continue
		}
		let memAvail = n.stats.mem_avail * n.stats.mem_total / 100
		let swapAvail = n.stats.swap_avail * n.stats.swap_total / 100
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
	for (let path in cstat.monitor.services) {
		let sp = splitPath(path)
		counts[sp.kind]++
		namespaces[sp.namespace] = null
	}
	counts.nodes = cstat.cluster.nodes.length
	counts.namespaces = Object.keys(namespaces).length
	counts.pools = pools ? Object.keys(pools).length : "-"
	counts.networks = networks ? Object.keys(networks).length : "-"
	counts.heartbeats = Object.keys(cstat).filter(k=>k.match(/^hb#/)).length / 2
	stats.memUse = 100*(stats.memTotal-stats.memAvail)/stats.memTotal
	stats.swapUse = 100*(stats.swapTotal-stats.swapAvail)/stats.swapTotal

	return (
                <Card className={classes.root}>
			<CardHeader
				title={t("Cluster")}
				subheader={cstat.cluster.name}
				action={
					<React.Fragment>
						<DeployButton />
						<ClusterActions />
					</React.Fragment>
				}
			/>
			<CardContent>
				<Grid container spacing={3}>
					<Grid item xs
						className={classes.item}
						onClick={() => navigate("/stats")}
					>
						<Typography variant="subtitle1" component="h3">
							{t("Memory")}
						</Typography>
						<Typography variant="h4" color="primary" component="h3">
							{stats.memUse.toFixed(0)}%
						</Typography>
						<Typography variant="caption" color="textSecondary" component="h3">
							<div>{t("Used")}: {fancySizeMB(stats.memTotal-stats.memAvail)}</div>
							<div>{t("Total")}: {fancySizeMB(stats.memTotal)}</div>
							<div>{t("MinAvail")}: {fancySizeMB(stats.memAvailMin)}</div>
							<div>{t("MaxAvail")}: {fancySizeMB(stats.memAvailMax)}</div>
						</Typography>
					</Grid>
					<Grid item xs
						className={classes.item}
						onClick={() => navigate("/stats")}
					>
						<Typography variant="subtitle1" component="h3">
							{t("Swap")}
						</Typography>
						<Typography variant="h4" color="primary" component="h3">
							{stats.swapTotal ? stats.swapUse.toFixed(0) + "%" : "-"}
						</Typography>
						<Typography variant="caption" color="textSecondary" component="h3">
							<div>{t("Used")}: {fancySizeMB(stats.swapTotal-stats.swapAvail)}</div>
							<div>{t("Total")}: {fancySizeMB(stats.swapTotal)}</div>
							<div>{t("MinAvail")}: {fancySizeMB(stats.swapAvailMin)}</div>
							<div>{t("MaxAvail")}: {fancySizeMB(stats.swapAvailMax)}</div>
						</Typography>
					</Grid>
					<Grid item xs
						className={classes.item}
						onClick={() => navigate("/stats")}
					>
						<Typography variant="subtitle1" component="h3">
							{t("Load")}
						</Typography>
						<Typography variant="h4" color="primary" component="h3">
							{stats.loadAvg.toFixed(1)}
						</Typography>
						<Typography variant="caption" color="textSecondary" component="h3">
							<div>{t("15min average")}</div>
							<div>{t("Min")}: {stats.loadAvgMin.toFixed(1)}</div>
							<div>{t("Max")}: {stats.loadAvgMax.toFixed(1)}</div>
						</Typography>
					</Grid>
					<Grid item xs
						className={classes.item}
						onClick={() => navigate("/nodes")}
					>
						<Typography variant="subtitle1" component="h3">
							{t("Nodes")}
						</Typography>
						<Typography variant="h4" color="primary" component="h3">
							{counts.nodes}
							{nodesIssue(cstat) !== state.OPTIMAL ? ( <WarningIcon className={classes.warn} /> ) : null}
						</Typography>
					</Grid>
					<Grid item xs
						className={classes.item}
						onClick={() => navigate("/heartbeats")}
					>
						<Typography variant="subtitle1" component="h3">
							{t("Heartbeats")}
						</Typography>
						<Typography variant="h4" color="primary" component="h3">
							{counts.heartbeats}
							{heartbeatsIssue(cstat) !== state.OPTIMAL ? ( <WarningIcon className={classes.warn} /> ) : null}
						</Typography>
					</Grid>
					<Grid item xs
						className={classes.item}
						onClick={() => navigate("/pools")}
					>
						<Typography variant="subtitle1" component="h3">
							{t("Pools")}
						</Typography>
						<Typography variant="h4" color="primary" component="h3">
							{counts.pools}
						</Typography>
					</Grid>
					<Grid item xs
						className={classes.item}
						onClick={() => navigate("/networks")}
					>
						<Typography variant="subtitle1" component="h3">
							{t("Networks")}
						</Typography>
						<Typography variant="h4" color="primary" component="h3">
							{counts.networks}
						</Typography>
					</Grid>
					<Grid item xs className={classes.item}>
						<Typography variant="subtitle1" component="h3">
							{t("Namespaces")}
						</Typography>
						<Typography variant="h4" color="primary" component="h3">
							{counts.namespaces}
						</Typography>
					</Grid>
					<Grid item xs
						className={classes.item}
						onClick={() => navigate("/objects")}
					>
						<Typography variant="subtitle1" component="h3">
							{t("Objects")}
						</Typography>
						<Typography variant="h4" color="primary" component="h3">
							{counts.svc+counts.vol+counts.cfg+counts.sec+counts.usr}
							{objectsIssue(cstat) != state.OPTIMAL ? ( <WarningIcon className={classes.warn} /> ) : null}
						</Typography>
						<Typography variant="caption" color="textSecondary" component="h3">
							<div>svc: {counts.svc}</div>
							<div>vol: {counts.vol}</div>
							<div>cfg: {counts.cfg}</div>
							<div>sec: {counts.sec}</div>
							<div>usr: {counts.usr}</div>
						</Typography>
					</Grid>
				</Grid>
			</CardContent>
		</Card>
	)
}

export default ClusterDigest

