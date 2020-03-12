import React, { useState } from "react";
import useClusterStatus from "../hooks/ClusterStatus.jsx"
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { splitPath } from "../utils.js";
import { ObjActions } from "./ObjActions.jsx";
import { ObjState } from "./ObjState.jsx";
import { ObjInstanceCounts } from "./ObjInstanceCounts.jsx";
import { TableToolbar } from "./TableToolbar.jsx";
import { DeployButton } from "./DeployButton.jsx";

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
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';
import Hidden from '@material-ui/core/Hidden';

import FilterListIcon from '@material-ui/icons/FilterList';


const useStyles = makeStyles(theme => ({
	root: {
		marginTop: theme.spacing(3),
	},
	tools: {
		alignItems: "flex-end",
	},
	row: {
		'&:hover': {
			cursor: "pointer",
		},
	},
	table: {
		marginLeft: -theme.spacing(2),
		marginRight: -theme.spacing(2),
	},
	content: {
		paddingTop: 0,
	},
}))

function ObjsFilter(props) {
	const {search, setSearch} = props
	const { t, i18n } = useTranslation()
	return (
		<TextField
			id="obj-filter"
			label={t("Filter")}
			value={search}
			onChange={(e) => {setSearch(e.target.value)}}
			margin="none"
			variant="outlined"
			type="search"
			fullWidth
			autoFocus
		/>
	)
}

function getLines(props) {
	const { kind, search, withScalerSlaves, cstat } = props
	var lines = []
	if (cstat.monitor === undefined) {
		return lines
	}
	if (search) {
		var rePath = RegExp(search, "i")
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
		}
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
	const { cstat } = useClusterStatus()
	const [selected, setSelected] = useState([])
	const [search, setSearch] = useState("")
	const [searchOpen, setSearchOpen] = useState(false)
	const { kind, withScalerSlaves } = props
	const { t, i18n } = useTranslation()
	var lines = getLines({kind: props.kind, search: search, cstat: cstat})

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
				action={
					<TableToolbar selected={selected} className={classes.table}>
						{(selected.length > 0) && <ObjActions selected={selected} title="" />}
						<DeployButton kind={props.kind} />
						<Tooltip title={t("Filters")}>
							<IconButton aria-label="Filters" disabled={search?true:false} onClick={() => {(!search) && setSearchOpen(!searchOpen)}}>
								<FilterListIcon />
							</IconButton>
						</Tooltip>
					</TableToolbar>
				}
			/>
			<CardContent className={classes.content}>
				{(searchOpen || search) && <ObjsFilter search={search} setSearch={setSearch} />}
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
								<ObjLine key={path} index={i} path={path} selected={selected} setSelected={setSelected} title={title} cstat={cstat} />
							))}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	)
}

function ObjLine(props) {
	const history = useHistory()
	const classes = useStyles()
	const {index, path, selected, setSelected, withScalerSlaves, title, cstat } = props
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
		history.push({
			pathname: "/object",
			search: "?path="+path,
			state: {kind: title},
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
			className={classes.row}
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
