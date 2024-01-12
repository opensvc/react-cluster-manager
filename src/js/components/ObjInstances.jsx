import React from "react";

import useClusterStatus from "../hooks/ClusterStatus.jsx"
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom'
import { fmtPath, splitPath } from "../utils.js";
import { ObjInstanceState } from "./ObjInstanceState.jsx";
import { ObjInstanceActions } from "./ObjInstanceActions.jsx";
import { TableToolbar } from "./TableToolbar.jsx";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
import useClasses from "../hooks/useClasses.jsx";
import ObjInstanceCounts from "./ObjInstanceCounts.jsx"

const styles = theme => ({
	tableWrapper: {
		overflowX: 'auto',
	},
		card: {
		height: "100%",
	},
	content: {
		margin: -theme.spacing(2),
	},
	row: {
		'&:hover': {
			cursor: "pointer",
		},
	},
});

function getInstances(path, cstat, isSlice) {
	var instances = []
	const sp = splitPath(path)
	if (cstat.monitor === undefined) {
		return instances
	}
	if (isSlice) {
		var sliceNum = sp.name.replace(/\..*$/, "")
	} else {
		var sliceNum = null
	}
	for (var node of cstat.cluster.nodes) {
		try {
			var instance = cstat.monitor.nodes[node].services.status[path]
		} catch(e) {
			continue
		}
		if (!instance) {
			continue
		}
		if ("scaler_slaves" in instance) {
			var slavePaths = []
			const re = RegExp("^"+fmtPath("[0-9]+\."+sp.name, sp.namespace, sp.kind)+"$")
			for (var path in cstat.monitor.services) {
				if (path.match(re)) {
					slavePaths.push(path)
				}
			}
			for (var slavePath of slavePaths.sort()) {
				instances = instances.concat(getInstances(slavePath, cstat, true))
			}
		} else {
			instances.push({
				node: node,
				path: path,
				slice: sliceNum,
				instance: instance,
			})
		}
	}
	return instances
}

function ObjInstances(props) {
	//
	// props.path
	//
	const classes = useClasses(styles)
	const { cstat } = useClusterStatus()
	const [selected, setSelected] = React.useState([]);
	const { t, i18n } = useTranslation()

	if (cstat.monitor === undefined) {
		return null
	}
	if (cstat.monitor.services[props.path] === undefined) {
		return null
	}
	const instances = getInstances(props.path, cstat)
	var rowCount = instances.length

	function handleSelectAllClick(event) {
		if (event.target.checked) {
			const newSelecteds = instances
			setSelected(newSelecteds);
			return;
		}
		setSelected([]);
	}

	if ("scale" in cstat.monitor.services[props.path]) {
		var slice = <TableCell>Slice</TableCell>
	} else {
		var slice
	}
	return (
		<Card className={classes.card}>
			<CardHeader
				title={t("Instances")}
				subheaderTypographyProps=<ObjInstanceCounts path={props.path} />
			action={
			<TableToolbar selected={selected}>
				{(selected.length > 0) && <ObjInstanceActions selected={selected} title="" />}
			</TableToolbar>
		}
			/>
			<CardContent className={classes.content}>
				<div className={classes.tableWrapper}>
					<Table>
						<TableHead>
							<TableRow className="text-secondary">
								<TableCell padding="checkbox">
									<Checkbox
										indeterminate={selected.length > 0 && selected.length < rowCount}
										checked={selected.length === rowCount}
										onChange={handleSelectAllClick}
										inputProps={{ 'aria-label': 'Select all' }}
									/>
								</TableCell>
								{slice}
								<TableCell>{t("Node")}</TableCell>
								<TableCell>{t("State")}</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{instances.map((i, j) => (
								<InstanceLine
									key={j}
									index={j}
									path={props.path}
									instance={i}
									selected={selected}
									setSelected={setSelected}
								/>
							))}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	)
}

function InstanceLine(props) {
	const loc = useLocation()
	const classes = useClasses(styles)
	const { cstat } = useClusterStatus()
	const {index, path, instance, selected, setSelected} = props
	const navigate = useNavigate()
	if (cstat.monitor === undefined) {
		return null
	}
	if (!instance) {
		return null
	}
	function handleClick(event) {
		event.stopPropagation()
		var key = {
			node: instance.node,
			path: instance.path
		}
		var selectedIndex = -1
		for (var i=0; i<selected.length; i++) {
			var item = selected[i]
			if ((item.path==instance.path) && (item.node==instance.node)) {
				selectedIndex = i
				break
			}
		}
		let newSelected = []

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, key);
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
		navigate({
			pathname: "/instance",
			search: "?path=" + instance.path + "&node=" + instance.node,
			state: loc.state,
		})
	}
	const isItemSelected = selected.some(item => {return (item.path==instance.path) && (item.node==instance.node)})
	const labelId = `nodes-checkbox-${index}`

	return (
		<TableRow onClick={handleLineClick} className={classes.row}>
			<TableCell padding="checkbox" onClick={handleClick}>
				<Checkbox
					checked={isItemSelected}
					inputProps={{ 'aria-labelledby': labelId }}
				/>
			</TableCell>
			{instance.slice !== null && <TableCell>{instance.slice}</TableCell>}
			<TableCell>{instance.node}</TableCell>
			<TableCell><ObjInstanceState node={instance.node} path={path} /></TableCell>
		</TableRow>
	)
}

export {
	ObjInstances,
}
