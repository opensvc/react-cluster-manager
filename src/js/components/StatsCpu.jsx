import React, { useState, Fragment } from "react"
import { splitPath } from "../utils.js"

import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import {isEmpty} from "lodash";
import useClasses from "../hooks/useClasses.jsx";

const styles = theme => ({
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
})


function parseCpu(last, prev, search) {
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
		let nCpuTime = nlast.node.cpu.time
		let nElapsed = 1
		let nprev
		try {
			nprev = prev.nodes[node].data
			let nPrevCpuTime = nprev.node.cpu.time
			nElapsed = nCpuTime - nPrevCpuTime
		} catch(e) {
			continue
		}
		for (let path in nlast.services) {
			if (search && !path.match(search)) {
				continue
			}
			let sp = splitPath(path)
			let plast = nlast.services[path]
			let pCpuTime = 0
			let pPrevCpuTime = 0
			try {
				pCpuTime = plast.cpu.time
				let pprev = nprev.services[path]
				pPrevCpuTime = pprev.cpu.time
			} catch(e) {
				continue
			}
			let pct = (pCpuTime - pPrevCpuTime) / nElapsed
			if (!(node in d.nodes)) {
				d.nodes[node] = {
					namespaces: {},
					services: {},
				}
			}
			d.nodes[node].services[path] = pct
			if (sp.namespace in d.nodes[node].namespaces) {
				d.nodes[node].namespaces[sp.namespace] += pct
			} else {
				d.nodes[node].namespaces[sp.namespace] = pct
			}
			if (path in d.sum.services) {
				d.sum.services[path] += pct
			} else {
				d.sum.services[path] = pct
			}
			if (sp.namespace in d.sum.namespaces) {
				d.sum.namespaces[sp.namespace] += pct
			} else {
				d.sum.namespaces[sp.namespace] = pct
			}
		}
	}
	return d
}

function CpuNodeMapItem(props) {
	const { data, node, name, agg } = props
	const classes = useClasses(styles)
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

function CpuNodeMap(props) {
	const classes = useClasses(styles)
	const { data, name, agg } = props
	var nodes = Object.keys(data.nodes).sort()
	return (
		<Grid container className={classes.mapGrid} spacing={0}>
			{nodes.map((node) => (
				<CpuNodeMapItem key={node} node={node} name={name} data={data} agg={agg} />
			))}
		</Grid>
	)
}

function CpuPct(props) {
	const { value } = props
	const classes = useClasses(styles)
	var pct = (value*100).toFixed(2)
	return (
		<Typography component="div" className={classes.value}>
			{pct}%
		</Typography>
	)
}

function StatsCpu(props) {
	const {last, prev, sortKey, agg, setAgg, search, setSearch} = props
	const classes = useClasses(styles)
	var cpu = parseCpu(last, prev, search)
	if (agg == "ns") {
		var data = cpu.sum.namespaces
	} else {
		var data = cpu.sum.services
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
						<Grid item xs={4}><CpuNodeMap data={cpu} agg={agg} name={name} /></Grid>
						<Grid item xs={4}><CpuPct value={data[name]} /></Grid>
					</Grid>
				</ListItem>
			))}
		</List>
	)
}

export default StatsCpu
