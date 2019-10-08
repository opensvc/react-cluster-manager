import React, { useState } from "react";

import { useStateValue } from '../state.js';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router'
import { fmtPath, splitPath } from "../utils.js";
import { ObjInstanceState } from "./ObjInstanceState.jsx";
import { ObjInstanceActions } from "./ObjInstanceActions.jsx";
import { TableToolbar } from "./TableToolbar.jsx";

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';

import FilterListIcon from '@material-ui/icons/FilterList';

const useStyles = makeStyles(theme => ({
        tableWrapper: {
                overflowX: 'auto',
        },
	        card: {
                height: "100%",
        },
        content: {
                margin: -theme.spacing(2),
        },
}))

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
	for (var node in cstat.monitor.nodes) {
		var instance = cstat.monitor.nodes[node].services.status[path]
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
	const classes = useStyles()
	const [{ cstat }, dispatch] = useStateValue();
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
				subheader={props.path}
                        />
                        <CardContent className={classes.content}>
				<TableToolbar selected={selected}>
					{selected.length > 0 ? (
						<ObjInstanceActions selected={selected} title="" />
					) : (
						<Tooltip title="Filter list">
							<IconButton aria-label="Filter list">
								<FilterListIcon />
							</IconButton>
						</Tooltip>
					)}
				</TableToolbar>
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
								<TableCell>Node</TableCell>
								<TableCell>State</TableCell>
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
	const [{ cstat }, dispatch] = useStateValue();
	const {index, path, instance, selected, setSelected} = props
	const history = useHistory()
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
		history.push({
			pathname: "/instance",
			search: "?path=" + instance.path + "&node=" + instance.node,
			state: loc.state,
		})
	}
        const isItemSelected = selected.some(item => {return (item.path==instance.path) && (item.node==instance.node)})
        const labelId = `nodes-checkbox-${index}`

	return (
		<TableRow onClick={handleLineClick}>
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
