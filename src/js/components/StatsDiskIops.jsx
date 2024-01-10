import React, { useState, Fragment } from "react"
import { splitPath, fancySizeMB } from "../utils.js"
import HorizontalBars from "./HorizontalBars.jsx"

import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import useClasses from "../hooks/useClasses.jsx";

const styles = theme => ({
	itemGrid: {
		flexWrap: "wrap",
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
})


function parseDiskIops(last, prev, search) {
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
		try {
			var nprev = prev.nodes[node].data
		} catch(e) {
			continue
		}
		var elapsed = nlast.timestamp - nprev.timestamp
		for (var path in nlast.services) {
			if (search && !path.match(search)) {
				continue
			}
			var sp = splitPath(path)
			var plast = nlast.services[path]
			try {
				var pprev = nprev.services[path]
				var m = {}
				m.r = (plast.blk.r - pprev.blk.r) / elapsed
				m.w = (plast.blk.w - pprev.blk.w) / elapsed
				m.rw = m.r + m.w
			} catch(e) {
				continue
			}
			if (!(node in d.nodes)) {
				d.nodes[node] = {
					namespaces: {},
					services: {},
				}
			}
			d.nodes[node].services[path] = m
			if (sp.namespace in d.nodes[node].namespaces) {
				d.nodes[node].namespaces[sp.namespace].r += m.r
				d.nodes[node].namespaces[sp.namespace].w += m.w
				d.nodes[node].namespaces[sp.namespace].rw += m.rw
			} else {
				d.nodes[node].namespaces[sp.namespace] = m
			}
			if (path in d.sum.services) {
				d.sum.services[path].r += m.r
				d.sum.services[path].w += m.w
				d.sum.services[path].rw += m.rw
			} else {
				d.sum.services[path] = m
			}
			if (sp.namespace in d.sum.namespaces) {
				d.sum.namespaces[sp.namespace].r += m.r
				d.sum.namespaces[sp.namespace].w += m.w
				d.sum.namespaces[sp.namespace].rw += m.rw
			} else {
				d.sum.namespaces[sp.namespace] = m
			}
		}
	}
	return d
}

function DiskIopsNodeMapItem(props) {
	const { data, node, name, agg } = props
	const classes = useClasses(styles)
	try {
		if (agg == "ns") {
			var value = data.nodes[node].namespaces[name].rw
			var pct = 100 * value / data.sum.namespaces[name].rw
		} else {
			var value = data.nodes[node].services[name].rw
			var pct = 100 * value / data.sum.services[name].rw
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

function DiskIopsNodeMap(props) {
	const classes = useClasses(styles)
	const { data, name, agg } = props
	var nodes = Object.keys(data.nodes).sort()
	return (
		<Grid container className={classes.mapGrid} spacing={0}>
			{nodes.map((node) => (
				<DiskIopsNodeMapItem key={node} node={node} name={name} data={data} agg={agg} />
			))}
		</Grid>
	)
}

function DiskIopsBias(props) {
	const { value } = props
	var values = [
		{
			label: "r",
			value: value.r,
		},
		{
			label: "w",
			value: value.w,
		},
	]
	return (
		<HorizontalBars values={values} />
	)
}

function DiskIops(props) {
	const { value } = props
	const classes = useClasses(styles)
	return (
		<Typography component="div" className={classes.value}>
			{fancySizeMB(value.rw/1048576)}rw/s
		</Typography>
	)
}

function StatsDiskIops(props) {
	const {last, prev, sortKey, agg, setAgg, search, setSearch} = props
	const classes = useClasses(styles)
	var iops = parseDiskIops(last, prev, search)
	if (agg == "ns") {
		var data = iops.sum.namespaces
	} else {
		var data = iops.sum.services
	}
	var names = Object.keys(data)
	if (sortKey == "value") {
		names.sort(function(a, b) {
			return data[b].rw - data[a].rw
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
						<Grid item xs={12} sm={6} className={classes.itemTitle}>{name}</Grid>
						<Grid item xs={4} sm={2}><DiskIopsNodeMap data={iops} agg={agg} name={name} /></Grid>
						<Grid item xs={4} sm={2}><DiskIopsBias value={data[name]} /></Grid>
						<Grid item xs={4} sm={2}><DiskIops value={data[name]} /></Grid>
					</Grid>
				</ListItem>
			))}
		</List>
	)
}

export default StatsDiskIops
