import React from "react";
import { useStateValue } from '../state.js';
import { parseIni, splitPath } from '../utils.js';
import { ObjAvail } from "./ObjAvail.jsx";
import { ObjProvisioned } from "./ObjProvisioned.jsx";
import { ObjInstanceResourceActions } from "./ObjInstanceResourceActions.jsx";
import { TableToolbar } from "./TableToolbar.jsx";
import { SectionEdit } from "./SectionEdit.jsx";
import { useObjConfig } from "../hooks/ObjConfig.jsx";
import { useColorStyles } from '../styles.js'

import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
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
                overflowX: "auto",
        },
	iconText: {
		display: "flex",
	},
}))

function ObjInstanceResources(props) {
	//
	// props.path
	// props.node
	//
	const [{ cstat }, dispatch] = useStateValue();
	if (cstat.monitor === undefined) {
		return null
	}
	const conf = useObjConfig(props.path)
	const classes = useStyles()
	const rdata = cstat.monitor.nodes[props.node].services.status[props.path].resources
	const [selected, setSelected] = React.useState([])
	const sp = splitPath(props.path)
	var rowCount = Object.keys(rdata).length
        if (!conf || !conf.data) {
		var configData = {}
        } else {
		var configData = parseIni(conf.data)
	}

        function handleSelectAllClick(event) {
                if (event.target.checked) {
                        const newSelecteds = Object.keys(rdata)
                        setSelected(newSelecteds);
                        return;
                }
                setSelected([]);
        }

	return (
		<React.Fragment>
			<Typography variant="h5" component="h2">
				Resources
			</Typography>
                        <TableToolbar selected={selected}>
                                {selected.length > 0 ? (
                                        <ObjInstanceResourceActions path={props.path} node={props.node} rids={selected} title="" />
                                ) : (
                                        <Tooltip title="Filter list">
                                                <IconButton aria-label="Filter list">
                                                        <FilterListIcon />
                                                </IconButton>
                                        </Tooltip>
                                )}
                        </TableToolbar>
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
						<TableCell>Id</TableCell>
						<TableCell>Availability</TableCell>
						<TableCell>State</TableCell>
						<TableCell>Desc</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{Object.keys(rdata).sort().map((rid, i) => (
						<ObjInstanceResourceLine
							key={i}
							index={i}
							rid={rid}
							node={props.node}
							path={props.path}
							selected={selected}
							setSelected={setSelected}
							conf={configData}
							sp={sp}
						/>
					))}
				</TableBody>
			</Table>
		</React.Fragment>
	)
}

function ObjInstanceResourceLine(props) {
	const [{ cstat, user }, dispatch] = useStateValue();
	const {index, node, path, rid, selected, setSelected, conf, sp} = props
	const classes = useStyles()
	if (cstat.monitor === undefined) {
		return null
	}
	const rdata = cstat.monitor.nodes[node].services.status[path].resources[rid]
	if (!rdata.status) {
		return null
	}
        function handleClick(event) {
                event.stopPropagation()
                var selectedIndex = selected.indexOf(rid)
                let newSelected = []

                if (selectedIndex === -1) {
                        newSelected = newSelected.concat(selected, rid);
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
        const isItemSelected = selected.indexOf(rid) > -1
        const labelId = `rid-checkbox-${index}`
	return (
		<TableRow>
                        <TableCell padding="checkbox" onClick={handleClick}>
                                <Checkbox
                                        checked={isItemSelected}
                                        inputProps={{ 'aria-labelledby': labelId }}
                                />
                        </TableCell>
			<TableCell>
				<Typography component="div" noWrap className={classes.iconText}>
					{(user.grant.admin.indexOf(sp.namespace) > -1) &&
					<SectionEdit path={path} rid={rid} conf={conf} />
					}
					{rid}
				</Typography>
			</TableCell>
			<TableCell><ObjAvail avail={rdata.status} /></TableCell>
			<TableCell><ObjInstanceResourceState rid={rid} node={node} path={path} /></TableCell>
			<TableCell><ObjInstanceResourceDesc data={rdata} /></TableCell>
		</TableRow>
	)
}

function ObjInstanceResourceDesc(props) {
	const {data} = props
	const classes = useColorStyles()
	var log = []
	if (data.log) {
		for (var i=0; i<data.log.length; i++) {
			var line = data.log[i]
			if (line.match(/^warn:/)) {
				var color = "warn"
			} else if (line.match(/^error:/)) {
				var color = "error"
			} else {
				var color = "n/a"
			}
			log.push((
				<Typography key={i} component="div" variant="caption" className={clsx(props.className, classes[color])}>
					{line}
				</Typography>
			))
		}
	}
	return (
		<React.Fragment>
			{data.label}
			{log}
		</React.Fragment>
	)
}

function ObjInstanceResourceState(props) {
	//
	// props.path
	// props.node
	// props.rid
	//
	const [{ cstat }, dispatch] = useStateValue();
	if (cstat.monitor === undefined) {
		return null
	}
	const rdata = cstat.monitor.nodes[props.node].services.status[props.path].resources[props.rid]
	// disabled
	return (
		<ObjProvisioned provisioned={rdata.provisioned && rdata.provisioned.state} />
	)
}

export {
	ObjInstanceResources,
}
