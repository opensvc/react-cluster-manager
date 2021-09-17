import React from "react";
import useClusterStatus from "../hooks/ClusterStatus.jsx"
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import { state, fancySizeMB } from "../utils.js";
import { useColorStyles } from "../styles.js";
import { nodeMemOverloadIssue, nodeSwapOverloadIssue, compatIssue, versionIssue } from "../issues.js";
import { NodeActions } from "./NodeActions.jsx";
import { TableToolbar } from "./TableToolbar.jsx";
import { NodeState } from "./NodeState.jsx";
import { Sparklines, SparklinesLine, SparklinesReferenceLine, SparklinesNormalBand } from 'react-sparklines';

import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Switch from '@material-ui/core/Switch';
import Link from '@material-ui/core/Link';
import Hidden from '@material-ui/core/Hidden';

import FilterListIcon from '@material-ui/icons/FilterList';

const useStyles = makeStyles(theme => ({
        root: {
                marginTop: theme.spacing(3),
        },
	wrapper: {
		overflowX: 'auto',
	},
	table: {
		marginLeft: -theme.spacing(2),
		marginRight: -theme.spacing(2),
	},
}))

function getNodeStat(cstat, node, key) {
	if (Object.entries(cstat.monitor.nodes[node]).length === 0) {
		return null
	}
	return cstat.monitor.nodes[node].stats[key]
}

function NodeCpuSparkline(props) {
	var sampleData = [3, 2, 2, 1, 3, 5, 2]
	return (
		<Sparklines data={sampleData} height={40} style={{ "maxWidth": "6em" }} >
			<SparklinesLine style={{ strokeWidth: 5, stroke: "#6c757d", fill: "none" }} />
			<SparklinesReferenceLine type="mean" style={{ strokeWidth: 2, stroke: "#dc3545" }} />
		</Sparklines>
	)
}

function NodeMetric(props) {
	const { cstat } = useClusterStatus()
	if (props.issue == state.WARNING) {
		var cl = "error"
	} else {
		var cl = "inherit"
	}
	var refer
	if (props.refer) {
		refer = (
			<React.Fragment>
				&nbsp;
				<Typography component="span" variant="caption" color="textSecondary">
					{props.refer}
				</Typography>
			</React.Fragment>
		)
	}
	return (
		<React.Fragment>
			<Typography component="span" color={cl}>
				{props.value}{props.unit}
			</Typography>
			{refer}
		</React.Fragment>
	)
}
function NodeScore(props) {
	const { cstat } = useClusterStatus()
	return (
		<NodeMetric
			label="Score"
			value={getNodeStat(cstat, props.node, "score")}
			unit=""
		/>
	)
}function NodeLoad(props) {
	const { cstat } = useClusterStatus()
	return (
		<NodeMetric
			label="Load15m"
			value={getNodeStat(cstat, props.node, "load_15m")}
			unit=""
		/>
	)
}
function NodeMem(props) {
	const { cstat } = useClusterStatus()
	var memIssue = nodeMemOverloadIssue(cstat, props.node)
	return (
		<NodeMetric
			label="Avail Mem"
			value={getNodeStat(cstat, props.node, "mem_avail")}
			unit="%"
			issue={memIssue}
			refer={fancySizeMB(getNodeStat(cstat, props.node, "mem_total"))}
		/>
	)
}
function NodeSwap(props) {
	const { cstat } = useClusterStatus()
	var swapIssue = nodeSwapOverloadIssue(cstat, props.node)
	return (
		<NodeMetric
			label="Avail Swap"
			value={getNodeStat(cstat, props.node, "mem_avail")}
			unit="%"
			issue={swapIssue}
			refer={fancySizeMB(getNodeStat(cstat, props.node, "swap_total"))}
		/>
	)
}

function Node(props) {
	const {index, node, selected, setSelected, withScalerSlaves } = props
	const { cstat } = useClusterStatus()
	const history = useHistory()
	if (cstat.monitor === undefined) {
		return null
	}
	var data = cstat.monitor.nodes[props.node]
	if (data == undefined) {
		return null
	}
        function handleClick(event) {
                event.stopPropagation()
                const selectedIndex = selected.indexOf(node)
                let newSelected = []

                if (selectedIndex === -1) {
                        newSelected = newSelected.concat(selected, node);
                } else if (selectedIndex === 0) {
                        newSelected = newSelected.concat(selected.slice(1));
                } else if (selectedIndex === selected.length - 1) {
                        newSelected = newSelected.concat(selected.slice(0, -1));
                } else if (selectedIndex > 0) {
                        newSelected = newSelected.concat(
                                selected.slice(0, selectedIndex),
                                selected.slice(selectedIndex + 1),
                        );
                }
                setSelected(newSelected);
        }
	function handleLineClick(e) {
		history.push("/node?name="+props.node)
	}
        const isItemSelected = selected.indexOf(node) !== -1
        const labelId = `nodes-checkbox-${index}`

	return (
		<TableRow
			onClick={handleLineClick}
                        hover
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={node}
                        selected={isItemSelected}
		>
                        <TableCell padding="checkbox" onClick={handleClick}>
                                <Checkbox
                                        checked={isItemSelected}
                                        inputProps={{ 'aria-labelledby': labelId }}
                                />
                        </TableCell>
			<TableCell>{props.node}</TableCell>
			<TableCell><NodeState data={data} /></TableCell>
			<Hidden smDown>
				<TableCell><NodeScore node={props.node} /></TableCell>
				<TableCell><NodeLoad node={props.node} /></TableCell>
				<TableCell><NodeMem node={props.node} /></TableCell>
				<TableCell><NodeSwap node={props.node} /></TableCell>
			</Hidden>
			<TableCell><NodeVersion data={data} compatIssue={props.compatIssue} versionIssue={props.versionIssue} /></TableCell>
		</TableRow>
	)
}

function NodeVersion(props) {
	const classes = useColorStyles()
	return (
		<React.Fragment>
			<Typography component="span" className={classes[props.compatIssue.name]}>
				{props.data.compat}
			</Typography>
			&nbsp;
			<Typography component="span" className={classes[props.versionIssue.name]} variant="caption">
				{props.data.agent}
			</Typography>
		</React.Fragment>
	)
}

function Nodes(props) {
	const { cstat } = useClusterStatus()
	const { t, i18n } = useTranslation()
	const classes = useStyles()
	const [selected, setSelected] = React.useState([]);

	if (cstat.monitor === undefined) {
		return null
	}

	var vissue = versionIssue(cstat)
	var cissue = compatIssue(cstat)
	var rowCount = Object.keys(cstat.monitor.nodes).length

        function handleSelectAllClick(event) {
                if (event.target.checked) {
                        const newSelecteds = Object.keys(cstat.monitor.nodes)
                        setSelected(newSelecteds);
                        return;
                }
                setSelected([]);
        }
	
	return (
		<Card className={classes.root}>
			<CardHeader
				title={t("Nodes")}
				subheader={cstat.cluster.name}
			/>
			<CardContent>
				<TableToolbar selected={selected} className={classes.table}>
					{selected.length > 0 ? (
						<NodeActions selected={selected} title="" />
					) : (
						<Tooltip title="Filter list">
							<IconButton aria-label="Filter list">
								<FilterListIcon />
							</IconButton>
						</Tooltip>
					)}
				</TableToolbar>
				<div className={clsx([classes.wrapper, classes.table])}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell padding="checkbox">
									<Checkbox
										indeterminate={selected.length > 0 && selected.length < rowCount}
										checked={selected.length === rowCount}
										onChange={handleSelectAllClick}
										inputProps={{ 'aria-label': 'Select all' }}
									/>
								</TableCell>
								<TableCell>{t("Name")}</TableCell>
								<TableCell>{t("State")}</TableCell>
								<Hidden smDown>
									<TableCell>Score</TableCell>
									<TableCell>{t("Load15m")}</TableCell>
									<TableCell>{t("Mem Avail")}</TableCell>
									<TableCell>{t("Swap Avail")}</TableCell>
								</Hidden>
								<TableCell>Version</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{cstat.cluster.nodes.map((node, i) => (
								<Node
									key={node}
									index={i}
									node={node}
									selected={selected}
									setSelected={setSelected}
									compatIssue={cissue}
									versionIssue={vissue}
								/>
							))}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	)
}

export {
	Nodes
}
