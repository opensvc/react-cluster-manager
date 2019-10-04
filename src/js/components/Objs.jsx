import React, { useState } from "react";
import { useStateValue } from '../state.js';
import { useTranslation } from 'react-i18next';
import { splitPath, kindName } from "../utils.js";
import { ObjActions } from "./ObjActions.jsx";
import { ObjState } from "./ObjState.jsx";
import { ObjInstanceCounts } from "./ObjInstanceCounts.jsx";
import { TableToolbar } from "./TableToolbar.jsx";

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles, lighten } from '@material-ui/core/styles';
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
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Hidden from '@material-ui/core/Hidden';
import Toolbar from '@material-ui/core/Toolbar';

import FilterListIcon from '@material-ui/icons/FilterList';


const useStyles = makeStyles(theme => ({
	root: {
		marginTop: theme.spacing(3),
	},
	tools: {
		alignItems: "flex-end",
	},
	table: {
		marginLeft: -theme.spacing(2),
		marginRight: -theme.spacing(2),
	},
}))

function ObjsKindFilter(props) {
	const [{ kinds }, dispatch] = useStateValue();
	const { t, i18n } = useTranslation()
	function handleChange(e) {
		dispatch({"type": "setKindFilter", "data": e.target.value})
	}
	return (
		<FormGroup row>
			<FormControl>
				<InputLabel htmlFor="select-multiple-checkbox">{t("Kinds")}</InputLabel>
				<Select
					multiple
					value={kinds}
					onChange={handleChange}
					input={<Input id="select-multiple-checkbox" />}
					renderValue={selected => selected.join(', ')}
				>
				{["svc", "vol", "cfg", "sec", "usr", "ccfg"].map(kind => (
					<MenuItem key={kind} value={kind}>
						<Checkbox checked={kinds.indexOf(kind) > -1} />
						<ListItemText primary={kind} />
					</MenuItem>
				))}
				</Select>
			</FormControl>
		</FormGroup>
	)
}

function ObjsFilter(props) {
	const [{ filters }, dispatch] = useStateValue()
	const { t, i18n } = useTranslation()
	function handleChange(e) {
		var t = e.target.getAtTableRowibute("t")
		dispatch({"type": "setFilter", "filter_type": t, "filter_value": e.target.value})
	}
	function handleTypeChange(e) {
		var t = e.target.value
		var currentType = Object.keys(filters)[0]
		var v = filters[currentType]
		dispatch({"type": "setFilter", "filter_type": t, "filter_value": v})
	}
	function handleChange(e) {
		var t = Object.keys(filters)[0]
		var v = e.target.value
		dispatch({"type": "setFilter", "filter_type": t, "filter_value": v})
	}
	var currentType = Object.keys(filters)[0]
	return (
		<FormGroup row>
			<FormControl>
				<InputLabel htmlFor="obj-search-type">{t("Search In")}</InputLabel>
				<Select
					value={currentType}
					onChange={handleTypeChange}
					inputProps={{
						name: 'obj-search-type',
						id: 'obj-search-type',
					}}
				>
					<MenuItem value="name">{t("Name")}</MenuItem>
					<MenuItem value="namespace">{t("Namespace")}</MenuItem>
					<MenuItem value="path">{t("Path")}</MenuItem>
				</Select>
			</FormControl>
			<FormControl>
				<TextField
					id="obj-search"
					label={t("Regular Expression")}
					value={filters[currentType]}
					onChange={handleChange}
					margin="none"
				/>
			</FormControl>
		</FormGroup>
	)
}

function getLines(props) {
	const [{ cstat, kinds, filters }, dispatch] = useStateValue();
	const { kind, withScalerSlaves } = props
	var lines = []
	if (cstat.monitor === undefined) {
		return lines
	}
	if (filters.name) {
		var reName = RegExp(filters.name, "i")
	} else {
		var reName = null
	}
	if (filters.namespace) {
		var reNamespace = RegExp(filters.namespace, "i")
	} else {
		var reNamespace = null
	}
	if (filters.path) {
		var rePath = RegExp(filters.path, "i")
	} else {
		var rePath = null
	}
	for (var path in cstat.monitor.services) {
		var sp = splitPath(path)

		// Apply filters
		if (kind) {
			if (sp.kind != kind) {
				continue
			}
		} else {
			if (kinds.indexOf(sp.kind) < 0) {
				continue
			}
		}
		try {
			if (reName && !reName.test(sp.name)) {
				continue
			}
		} catch (e) {}
		try {
			if (reNamespace && !reNamespace.test(sp.namespace)) {
				continue
			}
		} catch (e) {}
		try {
			if (rePath && !rePath.test(path)) {
				continue
			}
		} catch (e) {}

		if (!withScalerSlaves && sp.name.match(/^[0-9]+\./)) {
			// discard scaler slaves
			continue
		}
		lines.push(path)
	}
	return lines
}

function Objs(props) {
	const classes = useStyles()
	const [{ cstat }, dispatch] = useStateValue();
	const [selected, setSelected] = React.useState([]);
	const { kind, withScalerSlaves } = props
	const { t, i18n } = useTranslation()
	var lines = getLines({kind: props.kind})

	if (cstat.monitor === undefined) {
		return lines
	}

	function handleSelectAllClick(event) {
		if (event.target.checked) {
			const newSelecteds = lines
			setSelected(newSelecteds)
			return;
		}
		setSelected([]);
	}

	function handleTitleClick(e) {
		dispatch({
			type: "setNav",
			page: "Objects",
			links: ["Objects"],
		})
	}

	var rowCount = lines.length
	var title = "Objects"
	if (props.kind == "svc") {
		title = "Services"
	} else if (props.kind == "vol") {
		title = "Volumes"
	} else if (props.kind == "cfg") {
		title = "Configs"
	} else if (props.kind == "sec") {
		title = "Secrets"
	} else if (props.kind == "usr") {
		title = "Users"
	}

	return (
		<Card className={classes.root}>
			<CardHeader
				title={t(title)}
				subheader={cstat.cluster.name}
				onClick={handleTitleClick}
			/>
			<CardContent>
				<Grid container className={classes.tools} spacing={1}>
					{!props.kind &&
					<Grid item>
						<ObjsKindFilter />
					</Grid>
					}
					<Grid item>
						<ObjsFilter />
					</Grid>
				</Grid>
				<TableToolbar selected={selected} className={classes.table}>
					{selected.length > 0 ? (
						<ObjActions selected={selected} title="" />
					) : (
						<Tooltip title={t("Filters")}>
							<IconButton aria-label="Filters">
								<FilterListIcon />
							</IconButton>
						</Tooltip>
					)}
				</TableToolbar>
				<div style={{overflowX: "auto"}} className={classes.table}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell padding="checkbox">
									<Checkbox
										indeterminate={selected.length > 0 && selected.length < rowCount}
										checked={selected.length === rowCount}
										onChange={handleSelectAllClick}
										inputProps={{ 'aria-label': t("Select all") }}
									/>
								</TableCell>
								<Hidden mdUp>
									<TableCell>{t("Path")}</TableCell>
								</Hidden>
								<Hidden smDown>
									<TableCell>{t("Namespace")}</TableCell>
									<TableCell>{t("Kind")}</TableCell>
									<TableCell>{t("Name")}</TableCell>
								</Hidden>
								<TableCell>{t("State")}</TableCell>
								<TableCell>Instances</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{lines.sort().map((path, i) => (
								<ObjLine key={path} index={i} path={path} selected={selected} setSelected={setSelected} title={title} />
							))}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	)
}

function ObjLine(props) {
	const {index, path, selected, setSelected, withScalerSlaves, title } = props
	const [{ cstat, kinds, filters }, dispatch] = useStateValue();
	const sp = splitPath(path)
	function handleClick(event) {
		event.stopPropagation()
		const selectedIndex = selected.indexOf(path)
		let newSelected = []

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, path);
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
		dispatch({
			type: "setNav",
			page: title,
			links: [title, path]
		})
	}
	const isItemSelected = selected.indexOf(path) !== -1
	const labelId = `objs-checkbox-${index}`

	return (
		<TableRow
			onClick={handleLineClick}
			hover
			role="checkbox"
			aria-checked={isItemSelected}
			tabIndex={-1}
			key={path}
			selected={isItemSelected}
		>
			<TableCell padding="checkbox" onClick={handleClick}>
				<Checkbox
					checked={isItemSelected}
					inputProps={{ 'aria-labelledby': labelId }}
				/>
			</TableCell>

			<Hidden mdUp>
				<TableCell>{path}</TableCell>
			</Hidden>
			<Hidden smDown>
				<TableCell>{sp.namespace}</TableCell>
				<TableCell>{sp.kind}</TableCell>
				<TableCell>{sp.name}</TableCell>
			</Hidden>
			<TableCell><ObjState path={path} /></TableCell>
			<TableCell><ObjInstanceCounts path={path} /></TableCell>
		</TableRow>
	)
}

export {
	Objs
}
