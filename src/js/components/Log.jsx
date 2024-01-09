import React, {Fragment, useState, useEffect} from "react"
import { useLog } from "../hooks/Log.jsx"
import { useTranslation } from "react-i18next"
import { TableToolbar } from "./TableToolbar.jsx"
import { stringToHslColor } from "../utils.js"

import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Chip from '@mui/material/Chip'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import clsx from 'clsx'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Skeleton from '@mui/material/Skeleton'
import FilterListIcon from '@mui/icons-material/FilterList'
import ClearIcon from '@mui/icons-material/Clear'
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight'
import useClasses from "../hooks/useClasses.jsx";

const styles = theme => ({
	content: {
		paddingTop: 0,
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
	},
	table: {
		marginLeft: -theme.spacing(2),
		marginRight: -theme.spacing(2),
	},
});

function Log(props) {
	const {title, subheader, hide, url, initialContext} = props
	const log = useLog(url)
	const [searchOpen, setSearchOpen] = useState(false)
	const [search, setSearch] = useState("")
	const [skip, setSkip] = useState()
	const [context, setContext] = useState(initialContext)
	const classes = useClasses(styles)
	const { t } = useTranslation()

	function handleClear() {
		setContext({})
	}
	function handleFilter() {
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
                                                        <IconButton aria-label="Filters" disabled={!!search} onClick={handleClear}>
                                                                <ClearIcon />
                                                        </IconButton>
                                                </Tooltip>
						}
                                                <Tooltip title={t("Filters")}>
                                                        <IconButton aria-label="Filters" disabled={!!search} onClick={handleFilter}>
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
	const classes = useClasses(styles)
	if (!log) {
		return ( <CircularProgress color="primary" /> )
	}
	let re
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
	const classes = useClasses(styles)
	if (!k || !v) {
		return null
	}
	if (hide && (hide.indexOf(k) >= 0)) {
		return null
	}
	function dropContextKey() {
		let newContext = {...context}
		delete newContext[k]
		setContext(newContext)
	}
	function negateContextKey() {
		let newContext = {...context}
		newContext[k] = {"value": v, "negate": true}
		setContext(newContext)
	}
	function setPositiveContextKey() {
		let newContext = {...context}
		newContext[k] = {"value": v}
		setContext(newContext)
	}
	function handleClick() {
		if (k in context) {
			if (context[k].negate) {
				if (context[k].value === v) {
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
	let label
	if (dense) {
		if (k in context && !context[k].negate) {
			return null
		} else if (k === "sc") {
			label = (v === "y") ? t("scheduled") : t("not scheduled")
		} else if (k === "sid") {
			label = "sid: " + v.slice(0, 4)
		} else {
			label = k + ": " + v
		}
	} else {
		if (k === "sc") {
			label = (v === "y") ? t("scheduled") : t("not scheduled")
		} else {
			label = k + ": " + v
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
			style={{
				"color": "black",
				"backgroundColor": stringToHslColor(v, 30, 80),
				"margin": dense ? "-8px 1em 0 0" : "0 1em 0 0"
			}}
		/>
	)
}

function PositiveContext(props) {
	const { context, setContext } = props
	const { t } = useTranslation()
	const classes = useClasses(styles)
	let positiveContext = {}
	for (let k in context) {
		if (!context[k].negate) {
			positiveContext[k] = context[k]
		}
	}
  	if (Object.keys(positiveContext).length === 0) {
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
	const classes = useClasses(styles)
	let negativeContext = {}
	for (let k in context) {
		if (context[k].negate) {
			negativeContext[k] = context[k]
		}
	}
	if (Object.keys(negativeContext).length === 0) {
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
	const classes = useClasses(styles)
	if (Object.keys(data).length === 0) {
		return null
	}
	function hasDisplayedMeta() {
		for (let k in data) {
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
	const classes = useClasses(styles)
	if (!data || (data.m === undefined)) {
		return <Skeleton />
	}
	let level = data.l
	let msg = data.m.join("\n")
	let date = new Date(data.t*1000)
	for (let k in context) {
		let v = context[k]
		if (v.negate) {
			if (data.x[k] === v.value) {
				return null
			}
		} else {
			if (data.x[k] !== v.value) {
				return null
			}
		}
	}
	if (re && !msg.match(re)) {
		return null
	}
	function handleClick() {
		setSearch("")
		setSkip(id)
	}
	return (
		<Fragment>
			{(!prev || (JSON.stringify(prev.x) !== JSON.stringify(data.x))) &&
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
