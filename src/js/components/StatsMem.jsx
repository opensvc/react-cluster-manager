import React, { useState, Fragment } from "react"
import { splitPath, fancySizeMB } from "../utils.js"

import { makeStyles } from '@material-ui/core/styles'
import Typography from "@material-ui/core/Typography"
import Grid from "@material-ui/core/Grid"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"

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


function parseMem(last, prev, search) {
	var d = {
		nodes: {},
		sum: {
			namespaces: {},
			services: {},
		}
	}
	if (!last || last.nodes === undefined) {
		return d
	}
	for (var node in last.nodes) {
		var nlast = last.nodes[node].data
		for (var path in nlast.services) {
			if (search && !path.match(search)) {
				continue
			}
			var sp = splitPath(path)
			var plast = nlast.services[path]
			var pTotal = plast.mem.total
			if (!(node in d.nodes)) {
				d.nodes[node] = {
					namespaces: {},
					services: {},
				}
			}
			d.nodes[node].services[path] = pTotal
			if (sp.namespace in d.nodes[node].namespaces) {
				d.nodes[node].namespaces[sp.namespace] += pTotal
			} else {
				d.nodes[node].namespaces[sp.namespace] = pTotal
			}
			if (path in d.sum.services) {
				d.sum.services[path] += pTotal
			} else {
				d.sum.services[path] = pTotal
			}
			if (sp.namespace in d.sum.namespaces) {
				d.sum.namespaces[sp.namespace] += pTotal
			} else {
				d.sum.namespaces[sp.namespace] = pTotal
			}
		}
	}
	return d
}

function MemNodeMapItem(props) {
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

function MemNodeMap(props) {
	const classes = useStyles()
	const { data, name, agg } = props
	var nodes = Object.keys(data.nodes).sort()
	return (
		<Grid container className={classes.mapGrid} spacing={0}>
			{nodes.map((node) => (
				<MemNodeMapItem key={node} node={node} name={name} data={data} agg={agg} />
			))}
		</Grid>
	)
}

function MemTotal(props) {
	const { value } = props
	const classes = useStyles()
	return (
		<Typography component="div" className={classes.value}>
			{fancySizeMB(value/1048576)}
		</Typography>
	)
}

function StatsMem(props) {
	const {last, prev, sortKey, agg, setAgg, search, setSearch} = props
	const classes = useStyles()
	var mem = parseMem(last, prev, search)
	if (agg == "ns") {
		var data = mem.sum.namespaces
	} else {
		var data = mem.sum.services
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
						<Grid item xs={4}><MemNodeMap data={mem} agg={agg} name={name} /></Grid>
						<Grid item xs={4}><MemTotal value={data[name]} /></Grid>
					</Grid>
				</ListItem>
			))}
		</List>
	)
}

export default StatsMem
