import React, { useState, Fragment } from "react"
import { splitPath } from "../utils.js"

import { makeStyles } from '@mui/styles'
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import {isEmpty} from "lodash";

const useStyles = makeStyles(theme => ({
	itemGrid: {
		flexWrap: "nowrap",
	},
	itemTitle: {
		whiteSpace: "nowrap",
	},
	mapGrid: {
		flexWrap: "nowrap",
		justifyContent: "center",
		alignItems: "flex-end",
		height: "1.5em",
	},
	value: {
		textAlign: "right",
	},
	bar: {
		background: theme.palette.primary.main,
		borderBottomWidth: "1px",
		borderBottomStyle: "solid",
		borderBottomColor: theme.palette.primary.main,
		transition: "height 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
	},
}))


function parseTasks(last, prev, search) {
	let d = {
		nodes: {},
		sum: {
			namespaces: {},
			services: {},
		}
	}
	if (!last || last.nodes === undefined) {
		return d
	}
	for (let node in last.nodes) {
		let nlast = last.nodes[node].data
		if (isEmpty(nlast)) {
			continue
		}
		for (let path in nlast.services) {
			if (search && !path.match(search)) {
				continue
			}
			let sp = splitPath(path)
			let plast = nlast.services[path]
			let pTasks = plast.tasks
			if (pTasks === undefined) {
				continue
			}
			if (!(node in d.nodes)) {
				d.nodes[node] = {
					namespaces: {},
					services: {},
				}
			}
			d.nodes[node].services[path] = pTasks
			if (sp.namespace in d.nodes[node].namespaces) {
				d.nodes[node].namespaces[sp.namespace] += pTasks
			} else {
				d.nodes[node].namespaces[sp.namespace] = pTasks
			}
			if (path in d.sum.services) {
				d.sum.services[path] += pTasks
			} else {
				d.sum.services[path] = pTasks
			}
			if (sp.namespace in d.sum.namespaces) {
				d.sum.namespaces[sp.namespace] += pTasks
			} else {
				d.sum.namespaces[sp.namespace] = pTasks
			}
		}
	}
	return d
}

function TasksNodeMapItem(props) {
	const { data, node, name, agg } = props
	const classes = useStyles()
	try {
		if (agg == "ns") {
			var value = data.nodes[node].namespaces[name]
			var pct = 100 * value / data.sum.namespaces[name]
		} else {
			var value = data.nodes[node].services[name]
			var pct = 100 * value / data.sum.services[name]
		}
	} catch(e) {
		var value = undefined
	}
	if (value === undefined) {
		var height = "1px"
	} else {
		var height = pct.toFixed(0)+"%"
	}
	var style = {
		width: "0.3em",
		marginRight: "3px",
		height: height,
	}
	return (
		<Grid item style={style} className={classes.bar}>
			&nbsp;
		</Grid>
	)
}

function TasksNodeMap(props) {
	const classes = useStyles()
	const { data, name, agg } = props
	var nodes = Object.keys(data.nodes).sort()
	return (
		<Grid container className={classes.mapGrid} spacing={0}>
			{nodes.map((node) => (
				<TasksNodeMapItem key={node} node={node} name={name} data={data} agg={agg} />
			))}
		</Grid>
	)
}

function Tasks(props) {
	const { value } = props
	const classes = useStyles()
	return (
		<Typography component="div" className={classes.value}>
			{value}
		</Typography>
	)
}

function StatsTasks(props) {
	const {last, prev, sortKey, agg, setAgg, search, setSearch} = props
	const classes = useStyles()
	var tasks = parseTasks(last, prev, search)
	if (agg == "ns") {
		var data = tasks.sum.namespaces
	} else {
		var data = tasks.sum.services
	}
	var names = Object.keys(data)
	if (sortKey == "value") {
		names.sort(function(a, b) {
			return data[b] - data[a]
		})
	} else {
		names.sort()
	}
	const handleClick = (name) => (e) => {
		if (agg == "ns") {
			setSearch("^"+name+"/")
		} else {
			setSearch(name)
		}
		setAgg("path")
	}

	return (
		<List>
			{names.map((name) => (
				<ListItem key={name} onClick={handleClick(name)}>
					<Grid container className={classes.itemGrid} spacing={1}>
						<Grid item xs={4} className={classes.itemTitle}>{name}</Grid>
						<Grid item xs={4}><TasksNodeMap data={tasks} agg={agg} name={name} /></Grid>
						<Grid item xs={4}><Tasks value={data[name]} /></Grid>
					</Grid>
				</ListItem>
			))}
		</List>
	)
}

export default StatsTasks
