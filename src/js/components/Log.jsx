import React, {Fragment, useState, useEffect} from "react"
import { useLog } from "../hooks/Log.jsx"
import { useTranslation } from "react-i18next"
import { TableToolbar } from "./TableToolbar.jsx"
import { stringToHslColor } from "../utils.js"

import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'
import Chip from '@material-ui/core/Chip'
import Avatar from '@material-ui/core/Avatar'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import clsx from 'clsx'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import Skeleton from '@material-ui/lab/Skeleton'
import FilterListIcon from '@material-ui/icons/FilterList'
import ClearIcon from '@material-ui/icons/Clear'
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight'

const useStyles = makeStyles(theme => ({
	content: {
		paddingTop: 0,
	},
	context: {
		padding: "0 0 1em 0",
	},
	textField: {
		width: "100%",
	},
	caption: {
		marginLeft: -theme.spacing(1),
	},
	context: {
		paddingBottom: theme.spacing(1),
		paddingTop: theme.spacing(1),
		width: "100%",
		opacity: "0.7",
	},
	date: {
		fontFamily: "monospace",
		fontSize: "1em",
		height: "1em",
	},
	logLine: {
		width: "100%",
		wordBreak: "break-all",
		fontFamily: "monospace",
	},
	log: {
		display: "flex",
		flexDirection: "column-reverse",
		wordWrap: "break-word",
		paddingTop: theme.spacing(2),
	},
	ERROR: {
		color: theme.status.danger,
	},
	WARNING: {
		color: theme.status.warning,
	},
	chip: {
		border: "none",
	}
}))

function Log(props) {
	const {title, subheader, hide, url, initialContext} = props
	const log = useLog(url)
	const [searchOpen, setSearchOpen] = useState(false)
	const [search, setSearch] = useState("")
	const [skip, setSkip] = useState()
	const [context, setContext] = useState(initialContext)
	const classes = useStyles()
	const { t } = useTranslation()

	function handleClear(e) {
		setContext({})
	}
	function handleFilter(e) {
		(!search) && setSearchOpen(!searchOpen)
	}
	function handleChange(e) {
		setSearch(e.target.value)
		location.href = "#"
		setSkip(null)
	}
	useEffect(() => {
		if (skip && (!location.href.match(RegExp("#"+skip+"$")))) {
			location.href = "#"+skip
		}
	})
	return (
                <Card id="Log">
                        <CardHeader
                                title={title}
                                subheader={subheader}
				action={
                                        <TableToolbar selected={[]} className={classes.table}>
						{(Object.keys(context).length > 0) &&
                                                <Tooltip title={t("Clear Filters")}>
                                                        <IconButton aria-label="Filters" disabled={search?true:false} onClick={handleClear}>
                                                                <ClearIcon />
                                                        </IconButton>
                                                </Tooltip>
						}
                                                <Tooltip title={t("Filters")}>
                                                        <IconButton aria-label="Filters" disabled={search?true:false} onClick={handleFilter}>
                                                                <FilterListIcon />
                                                        </IconButton>
                                                </Tooltip>
                                        </TableToolbar>
				}
                        />
                        <CardContent className={classes.content}>
				{(searchOpen || search) &&
				<TextField
					className={classes.textField}
					id="search"
					label={t("Search Regular Expression")}
					type="search"
					margin="normal"
					variant="outlined"
					onChange={handleChange}
					value={search}
				/>
				}
				<PositiveContext
					setContext={setContext}
					context={context}
				/>
				<NegativeContext
					setContext={setContext}
					context={context}
				/>
				<LogLines
					log={log}
					search={search}
					setSearch={setSearch}
					setSkip={setSkip}
					setContext={setContext}
					context={context}
					hide={hide}
				/>
			</CardContent>
                </Card>

	)
}

function LogLines(props) {
	const { log, search, setSearch, setSkip, setContext, context, hide } = props
	const classes = useStyles()
	if (!log) {
		return ( <CircularProgress color="primary" /> )
	}
	var re
	if (search && (search.length>1)) {
		try {
			re = RegExp(search, "i")
		} catch(e) {}
	}
	return (
		<div className={classes.log}>
			{log.map((line, i) => (
				<LogLine
					key={i}
					id={i}
					data={line}
				        prev={i ? log[i-1] : null}
					re={re}
					setSearch={setSearch}
					setSkip={setSkip}
					setContext={setContext}
					context={context}
					hide={hide}
				/>
			))}
		</div>
	)	
}

function LogLineContextKey(props) {
	const { k, v, context, setContext, dense, hide } = props
	const { t } = useTranslation()
	const classes = useStyles()
	if (!k || !v) {
		return null
	}
	if (hide && (hide.indexOf(k) >= 0)) {
		return null
	}
	function dropContextKey() {
		var newContext = {...context}
		delete newContext[k]
		setContext(newContext)
	}
	function negateContextKey() {
		var newContext = {...context}
		newContext[k] = {"value": v, "negate": true}
		setContext(newContext)
	}
	function setPositiveContextKey() {
		var newContext = {...context}
		newContext[k] = {"value": v}
		setContext(newContext)
	}
	function handleClick(e) {
		if (k in context) {
			if (context[k].negate) {
				if (context[k].value == v) {
					dropContextKey()
				} else {
					setPositiveContextKey()
				}
			} else {
				negateContextKey()
			}
		} else {
			setPositiveContextKey()
		}
	}
	if (dense) {
		if (k in context && !context[k].negate) {
			return null
		} else if (k == "sc") {
			var label = (v == "y") ? t("scheduled") : t("not scheduled")
		} else if (k == "sid") {
			var label = "sid: " + v.slice(0, 4)
		} else {
			var label = k + ": " + v
		}
	} else {
		if (k == "sc") {
			var label = (v == "y") ? t("scheduled") : t("not scheduled")
		} else {
			var label = k + ": " + v
		}
	}
	return (
		<Chip
			className={classes.chip}
			variant="outlined"
			size="small"
			//color={color}
			//avatar={<Avatar style={{"backgroundColor": stringToHslColor(v, 30, 80)}}>{k}</Avatar>}
			label={label}
			onClick={handleClick}
			style={{"backgroundColor": stringToHslColor(v, 30, 80), "margin": dense ? "-8px 1em 0 0" : "0 1em 0 0"}}
		/>
	)
}

function PositiveContext(props) {
	const { context, setContext } = props
	const { t } = useTranslation()
	const classes = useStyles()
	var positiveContext = {}
	for (var k in context) {
		if (!context[k].negate) {
			positiveContext[k] = context[k]
		}
	}
	if (Object.keys(positiveContext).length == 0) {
		return null
	}
	return (
		<div className={classes.context}>
			<Typography>
				{t("Show lines with")}
			</Typography>
			&nbsp;
			{Object.keys(positiveContext).map((k) => (
				<LogLineContextKey
					key={k}
					k={k}
					v={context[k].value}
					context={context}
					setContext={setContext}
					dense={false}
				/>
			))}
		</div>
	)
}

function NegativeContext(props) {
	const { context, setContext } = props
	const { t } = useTranslation()
	const classes = useStyles()
	var negativeContext = {}
	for (var k in context) {
		if (context[k].negate) {
			negativeContext[k] = context[k]
		}
	}
	if (Object.keys(negativeContext).length == 0) {
		return null
	}
	return (
		<div className={classes.context}>
			<Typography>
				{t("Show lines without")}
			</Typography>
			&nbsp;
			{Object.keys(negativeContext).map((k) => (
				<LogLineContextKey
					key={k}
					k={k}
					v={context[k].value}
					context={context}
					setContext={setContext}
					dense={false}
				/>
			))}
		</div>
	)
}

function LogLineContext(props) {
	const { data, context, setContext, hide } = props
	const classes = useStyles()
	if (Object.keys(data).length == 0) {
		return null
	}
	function hasDisplayedMeta() {
		for (var k in data) {
			if ((!(k in context) || context[k].negate) && (hide.indexOf(k) < 0)) {
				 return true
			}
		}
		return false
	}
	return (
		<div className={classes.context}>
			{hasDisplayedMeta() && <SubdirectoryArrowRightIcon />}
			{Object.keys(data).map((k) => (
				<LogLineContextKey
					key={k}
					k={k}
					v={data[k]}
					context={context}
					setContext={setContext}
					dense={true}
					hide={hide}
				/>
			))}
		</div>
	)
}

function LogLine(props) {
	const { re, data, prev, context, setContext, setSearch, setSkip, id, hide } = props
	const classes = useStyles()
	if (!data) {
		return <Skeleton />
	}
	var level = data.l
	var msg = data.m.join("\n")
	var date = new Date(data.t*1000)
	for (var k in context) {
		var v = context[k]
		if (v.negate) {
			if (data.x[k] == v.value) {
				return null
			}
		} else {
			if (data.x[k] != v.value) {
				return null
			}
		}
	}
	if (re && !msg.match(re)) {
		return null
	}
	function handleClick(e) {
		setSearch("")
		setSkip(id)
	}
	return (
		<Fragment>
			{(!prev || (JSON.stringify(prev.x) != JSON.stringify(data.x))) &&
			<LogLineContext
				data={data.x}
				setContext={setContext}
				context={context}
				hide={hide}
			/>
			}
			<div className={classes.logLine} id={id}>
				<div className={classes[level]}>
					<Chip
						className={clsx(classes.chip, classes.caption, classes.date)}
						color="primary"
						variant="outlined"
						size="small"
						//avatar={<Avatar>t</Avatar>}
						label={date.toLocaleString()}
						onClick={handleClick}
					/>
					{data.m.map((line, i) => (
						<span key={i}>{line}</span>
					))}
				</div>
			</div>
		</Fragment>
	)
}

export {
	Log
}
