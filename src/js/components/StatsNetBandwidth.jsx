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
		width: "0.3em",
		marginRight: "3px",
       		background: theme.palette.primary.main,
		borderBottomWidth: "1px",
		borderBottomStyle: "solid",
		borderBottomColor: theme.palette.primary.main,
		transition: "height 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
	},
})


function parseNetBandwidth(last, prev, search) {
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
				m.rb = (plast.net.rb - pprev.net.rb) / elapsed
				m.wb = (plast.net.wb - pprev.net.wb) / elapsed
				m.rwb = m.rb + m.wb
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
				d.nodes[node].namespaces[sp.namespace].rb += m.rb
				d.nodes[node].namespaces[sp.namespace].wb += m.wb
				d.nodes[node].namespaces[sp.namespace].rwb += m.rwb
			} else {
				d.nodes[node].namespaces[sp.namespace] = m
			}
			if (path in d.sum.services) {
				d.sum.services[path].rb += m.rb
				d.sum.services[path].wb += m.wb
				d.sum.services[path].rwb += m.rwb
			} else {
				d.sum.services[path] = m
			}
			if (sp.namespace in d.sum.namespaces) {
				d.sum.namespaces[sp.namespace].rb += m.rb
				d.sum.namespaces[sp.namespace].wb += m.wb
				d.sum.namespaces[sp.namespace].rwb += m.rwb
			} else {
				d.sum.namespaces[sp.namespace] = m
			}
		}
	}
	return d
}

function NetBandwidthNodeMapItem(props) {
	const { data, node, name, agg } = props
	const classes = useClasses(styles)
	try {
		if (agg == "ns") {
			var value = data.nodes[node].namespaces[name].rwb
			var pct = 100 * value / data.sum.namespaces[name].rwb
		} else {
			var value = data.nodes[node].services[name].rwb
			var pct = 100 * value / data.sum.services[name].rwb
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
		height: height,
	}
	return (
		<Grid item style={style} className={classes.bar}>
			&nbsp;
		</Grid>
	)
}

function NetBandwidthNodeMap(props) {
	const classes = useClasses(styles)
	const { data, name, agg } = props
	var nodes = Object.keys(data.nodes).sort()
	return (
		<Grid container className={classes.mapGrid} spacing={0}>
			{nodes.map((node) => (
				<NetBandwidthNodeMapItem key={node} node={node} name={name} data={data} agg={agg} />
			))}
		</Grid>
	)
}

function NetBandwidth(props) {
	const { value } = props
	const classes = useClasses(styles)
	return (
		<Typography component="div" className={classes.value}>
			{fancySizeMB(value.rwb/1048576)}b/s
		</Typography>
	)
}

function NetBandwidthBias(props) {
	const { value } = props
	var values = [
		{
			label: "r",
			value: value.rb,
		},
		{
			label: "w",
			value: value.wb,
		},
	]
	return (
		<HorizontalBars values={values} />
	)
}

function StatsNetBandwidth(props) {
	const {last, prev, sortKey, agg, setAgg, search, setSearch} = props
	const classes = useClasses(styles)
	var bw = parseNetBandwidth(last, prev, search)
	if (agg == "ns") {
		var data = bw.sum.namespaces
	} else {
		var data = bw.sum.services
	}
	var names = Object.keys(data)
	if (sortKey == "value") {
		names.sort(function(a, b) {
			return data[b].rwb - data[a].rwb
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
					<Grid container alignItems="center" className={classes.itemGrid} spacing={1}>
						<Grid item xs={12} sm={6} className={classes.itemTitle}>{name}</Grid>
						<Grid item xs={4} sm={2}><NetBandwidthNodeMap data={bw} agg={agg} name={name} /></Grid>
						<Grid item xs={4} sm={2}><NetBandwidthBias value={data[name]} /></Grid>
						<Grid item xs={4} sm={2}><NetBandwidth value={data[name]} /></Grid>
					</Grid>
				</ListItem>
			))}
		</List>
	)
}

export default StatsNetBandwidth
