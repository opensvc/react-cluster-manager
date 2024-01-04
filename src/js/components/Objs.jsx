import React, { useState, useReducer } from "react"
import isEqual from "lodash.isequal"
import ObjIcon from "./ObjIcon.jsx"
import { useStateValue } from '../state.js'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { splitPath } from "../utils.js"
import { ObjActions } from "./ObjActions.jsx"
import { TableToolbar } from "./TableToolbar.jsx"
import { DeployButton } from "./DeployButton.jsx"
import { ObjActive } from "./ObjActive.jsx"
import { ObjOverall } from "./ObjOverall.jsx"
import { ObjFrozen } from "./ObjFrozen.jsx"
import { ObjPlacement } from "./ObjPlacement.jsx"
import { ObjProvisioned } from "./ObjProvisioned.jsx"
import { ObjInstanceCounts } from "./ObjInstanceCounts.jsx"

import useDebouncedValue from "../hooks/DebouncedValue.jsx"

import { makeStyles } from '@mui/styles'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Container from '@mui/material/Container'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import TextField from '@mui/material/TextField'
import Hidden from '@mui/material/Hidden'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'

import FilterListIcon from '@mui/icons-material/FilterList'



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
	list: {
		paddingLeft: 0,
		paddingRight: 0,
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
	const { kind, search, withScalerSlaves, cstat, selected } = props
	var lines = []
	if (!cstat.monitor) {
		return lines
	}
	if (search) {
		var rePath = RegExp(search, "i")
	} else {
		var rePath = null
	}
	for (var path of Object.keys(cstat.monitor.services).sort()) {
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
		lines.push({
			...cstat.monitor.services[path],
			path: path,
			selected: selected.has(path)
		})
	}
	return lines
}

function getTitle(kind) {
	const titles = {
		svc: "Services",
		vol: "Volumes",
		cfg: "Configs",
		sec: "Secrets",
		usr: "Users",
	}
	var s = titles[kind]
	if (s) {
		return s
	}
	return "Objects"
}

function Objs(props) {
	const classes = useStyles()
	const [{ cstat }, dispatch] = useStateValue()
	const [search, setSearch] = useState("")
	const debouncedSearch = useDebouncedValue(search, 400)
	const [searchOpen, setSearchOpen] = useState(false)
	const { kind, withScalerSlaves } = props
	const { t, i18n } = useTranslation()
	const navigate = useNavigate()
	const title = getTitle(props.kind)
	const [selected, setSelected] = useReducer((state, path) => {
		try {
			path.has("foo")
			return path
		} catch {}
		let newSelected = new Set(state)
		if (newSelected.has(path)) {
			newSelected.delete(path)
		} else {
			newSelected.add(path)
		}
		return newSelected
	}, new Set())

	if (!cstat.monitor) {
		return null
	}

	console.log("getlines")
	var lines = getLines({kind: props.kind, search: debouncedSearch, cstat: cstat, selected: selected})
	var linesCount = lines.length

	function handleSelectAllClick(event) {
		if (event.target.checked) {
			setSelected(new Set(lines.map(x => x.path)))
		} else {
			setSelected(new Set())
		}
	}
	function handleLineClick(path) {
		navigate({
			pathname: "/object",
			search: "?path="+path,
			state: {kind: title},
		})
	}

	console.log("table")

	return (
		<Card className={classes.root}>
			<CardHeader
				title={t(title)}
				subheader={cstat.cluster.name}
				action={
					<TableToolbar selected={Array.from(selected)} className={classes.table}>
						{(selected.size > 0) && <ObjActions selected={Array.from(selected)} title="" />}
						<DeployButton kind={props.kind} />
						<Tooltip title={t("Filters")}>
							<IconButton aria-label="Filters" disabled={search?true:false} onClick={() => {(!search) && setSearchOpen(!searchOpen)}}>
								<FilterListIcon />
							</IconButton>
						</Tooltip>
						<Checkbox
							indeterminate={selected.size > 0 && selected.size < linesCount}
							checked={selected.size === linesCount}
							disableRipple
							onChange={handleSelectAllClick}
							inputProps={{ 'aria-label': t("Select all") }}
						/>
					</TableToolbar>
				}
			/>
			<CardContent className={classes.content}>
				{(searchOpen || search) && <ObjsFilter search={search} setSearch={setSearch} />}
				<ObjLines
					lines={lines}
					setSelected={setSelected}
					handleLineClick={handleLineClick}
				/>
			</CardContent>
		</Card>
	)
}

function ObjLines(props) {
	const classes = useStyles()
	const {lines, setSelected, handleLineClick} = props
	return (
		<List className={classes.list}>
			{lines.map((line, index) => (
				<ObjLine
					key={index}
					line={line}
					setSelected={setSelected}
					handleLineClick={handleLineClick}
				/>
			))}
		</List>
	)
}

const ObjLine = React.memo(({line, setSelected, handleLineClick}) => {
	const handleClick = (event) => {
		event.stopPropagation()
		handleSelect(line.path)
	}
	const style = {
		paddingTop: "6px"
	}
	console.log("line")
	return (
		<ListItem button disableRipple onClick={(e) => handleLineClick(line.path)}>
			<ListItemIcon>
				<ObjIcon path={line.path} avail={line.avail} />
			</ListItemIcon>
			<ListItemText primary={line.path} />
                        <ListItemSecondaryAction>
				<Grid container alignItems="center" alignContent="center" spacing={0}>
					<Grid item style={style}>
						<ObjActive path={line.path} />
					</Grid>
					<Grid item style={style}>
						<ObjOverall overall={line.overall} />
					</Grid>
					<Grid item style={style}>
						<ObjPlacement placement={line.placement} />
					</Grid>
					<Grid item style={style}>
						<ObjFrozen frozen={line.frozen} />
					</Grid>
					<Grid item style={style}>
						<ObjProvisioned provisioned={line.provisioned} />
					</Grid>
					<Grid item style={style}>
					</Grid>
					<Grid item>
						<Checkbox
							checked={line.selected}
							onChange={(e) => setSelected(line.path)}
							edge="end"
							disableRipple
						/>
					</Grid>
				</Grid>
                        </ListItemSecondaryAction>

		</ListItem>
	)
},
function compare(p, n) {
	return isEqual(p.line, n.line)
})

export {
	Objs
}
