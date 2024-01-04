import React from "react"
import { splitPath, fancySizeMB } from "../utils.js"
import HorizontalBars from "./HorizontalBars.jsx"

import { makeStyles } from '@mui/styles'
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import {isEmpty} from "lodash";

const useStyles = makeStyles(theme => ({
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
}))


function parseDiskBandwidth(last, prev, search) {
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
		let nprev
		let elapsed
		try {
			nprev = prev.nodes[node].data
			elapsed = nlast.timestamp - nprev.timestamp
		} catch(e) {
			continue
		}
		for (let path in nlast.services) {
			if (search && !path.match(search)) {
				continue
			}
			let sp = splitPath(path)
			let plast = nlast.services[path]
			let m = {}
			try {
				let pprev = nprev.services[path]
				m.rb = (plast.blk.rb - pprev.blk.rb) / elapsed
				m.wb = (plast.blk.wb - pprev.blk.wb) / elapsed
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

function DiskBandwidthNodeMapItem(props) {
	const { data, node, name, agg } = props
	const classes = useStyles()
	let value, pct, height
	try {
		if (agg === "ns") {
			value = data.nodes[node].namespaces[name].rwb
			pct = 100 * value / data.sum.namespaces[name].rwb
		} else {
			value = data.nodes[node].services[name].rwb
			pct = 100 * value / data.sum.services[name].rwb
		}
	} catch(e) {
		value = undefined
	}
	if (value === undefined) {
		height = "1px"
	} else {
		height = pct.toFixed(0)+"%"
	}
	let style = {
		height: height,
	}
	return (
		<Grid item style={style} className={classes.bar}>
			&nbsp;
		</Grid>
	)
}

function DiskBandwidthNodeMap(props) {
	const classes = useStyles()
	const { data, name, agg } = props
	let nodes = Object.keys(data.nodes).sort()
	return (
		<Grid container className={classes.mapGrid} spacing={0}>
			{nodes.map((node) => (
				<DiskBandwidthNodeMapItem key={node} node={node} name={name} data={data} agg={agg} />
			))}
		</Grid>
	)
}

function DiskBandwidth(props) {
	const { value } = props
	const classes = useStyles()
	return (
		<Typography component="div" className={classes.value}>
			{fancySizeMB(value.rwb/1048576)}b/s
		</Typography>
	)
}

function DiskBandwidthBias(props) {
	const { value } = props
	let values = [
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

function StatsDiskBandwidth(props) {
	const {last, prev, sortKey, agg, setAgg, search, setSearch} = props
	const classes = useStyles()
	let bw = parseDiskBandwidth(last, prev, search)
	let data
	if (agg === "ns") {
		data = bw.sum.namespaces
	} else {
		data = bw.sum.services
	}
	let names = Object.keys(data)
	if (sortKey === "value") {
		names.sort(function(a, b) {
			return data[b].rwb - data[a].rwb
		})
	} else {
		names.sort()
	}
	const handleClick = (name) => (e) => {
		if (agg === "ns") {
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
						<Grid item xs={4} sm={2}><DiskBandwidthNodeMap data={bw} agg={agg} name={name} /></Grid>
						<Grid item xs={4} sm={2}><DiskBandwidthBias value={data[name]} /></Grid>
						<Grid item xs={4} sm={2}><DiskBandwidth value={data[name]} /></Grid>
					</Grid>
				</ListItem>
			))}
		</List>
	)
}

export default StatsDiskBandwidth
