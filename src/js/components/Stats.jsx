import React, { useState, Fragment } from "react"
import { useTranslation } from "react-i18next"
import useDaemonStats from "../hooks/DaemonStats.jsx"
import StatsCpu from "./StatsCpu.jsx"
import StatsMem from "./StatsMem.jsx"
import StatsTasks from "./StatsTasks.jsx"
import StatsDiskIops from "./StatsDiskIops.jsx"
import StatsDiskBandwidth from "./StatsDiskBandwidth.jsx"

import { makeStyles } from '@material-ui/core/styles'
import Card from "@material-ui/core/Card"
import CardHeader from "@material-ui/core/CardHeader"
import CardContent from "@material-ui/core/CardContent"
import AppBar from "@material-ui/core/AppBar"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import Typography from "@material-ui/core/Typography"
import Box from "@material-ui/core/Box"
import TextField from "@material-ui/core/TextField"

import IconButton from "@material-ui/core/IconButton"
import PauseIcon from "@material-ui/icons/Pause"
import PlayArrowIcon from "@material-ui/icons/PlayArrow"
import SortIcon from "@material-ui/icons/Sort"
import SortByAlphaIcon from "@material-ui/icons/SortByAlpha"
import ViewStreamIcon from "@material-ui/icons/ViewStream"
import ViewHeadlineIcon from "@material-ui/icons/ViewHeadline"
import FilterListIcon from "@material-ui/icons/FilterList"

const useStyles = makeStyles(theme => ({
        root: {
                marginTop: theme.spacing(3),
        },
	tabs: {
		marginBottom: theme.spacing(2),
	},
}))

function FilterButton(props) {
	const { search, searchOpen, setSearchOpen } = props
	function handleClick(e) {
		if (search) {
			return
		}
		setSearchOpen(!searchOpen)
	}
	return (
		<IconButton onClick={handleClick}>
			<FilterListIcon />
		</IconButton>
	)
}

function AggStats(props) {
	const { agg, setAgg } = props
	return (
		<IconButton
			onClick={() => { (agg == "ns") ? setAgg("path") : setAgg("ns") }}
		>
			{(agg == "ns") ? <ViewStreamIcon /> : <ViewHeadlineIcon />}
		</IconButton>
	)
}

function PlayStats(props) {
	const { playing, play, pause } = props
	return (
		<IconButton
			onClick={() => { playing ? pause() : play() }}
		>
			{playing ? <PauseIcon /> : <PlayArrowIcon />}
		</IconButton>
	)
}

function SortStats(props) {
	const { sortKey, setSortKey } = props
	function handleClick(e) {
		if (sortKey == "value") {
			setSortKey("alpha")
		} else {
			setSortKey("value")
		}
	}
	return (
		<IconButton
			onClick={(e) => handleClick(e)}
		>
			{(sortKey == "value") ? <SortIcon /> : <SortByAlphaIcon />}
		</IconButton>
	)
}

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	}
}

function TabPanel(props) {
	const { children, value, index, ...other } = props
	if (value !== index) {
		return null
	}

	return (
		<Typography
			component="div"
			role="tabpanel"
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			<Box p={0}>{children}</Box>
		</Typography>
	)
}

function Filter(props) {
        const {search, setSearch} = props
        const { t, i18n } = useTranslation()
        return (
                <TextField
                        id="filter"
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

function Stats(props) {
	const {last, prev, pause, play, playing } = useDaemonStats()
	const [sortKey, setSortKey] = useState("value")
	const [agg, setAgg] = useState("ns")
	const [tab, setTab] = useState(0)
	const [search, setSearch] = useState("")
	const [searchOpen, setSearchOpen] = useState(false)
	const { i18n, t } = useTranslation()
	const classes = useStyles()

	const handleChange = (event, newValue) => {
		setTab(newValue);
	}

	return (
		<Card className={classes.root}>
			<CardHeader
				title={t("Statistics")}
				subheader={t("Aggregation by {{agg}}", {agg: agg})}
				action={
					<Fragment>
						<FilterButton search={search} searchOpen={searchOpen} setSearchOpen={setSearchOpen} />
						<AggStats agg={agg} setAgg={setAgg} />
						<SortStats sortKey={sortKey} setSortKey={setSortKey} />
						<PlayStats play={play} pause={pause} playing={playing} />
					</Fragment>
				}
			/>
			<CardContent>
				{(search || searchOpen) && <Filter search={search} setSearch={setSearch} />}
				<Tabs
					value={tab}
					onChange={handleChange}
					aria-label="Statistic selector"
					indicatorColor="primary"
					textColor="primary"
					className={classes.tabs}
				>
					<Tab label="Mem" {...a11yProps(0)} />
					<Tab label="Cpu" {...a11yProps(1)} />
					<Tab label="Tasks" {...a11yProps(2)} />
					<Tab label="Disk I/O" {...a11yProps(3)} />
					<Tab label="Disk B/W" {...a11yProps(4)} />
				</Tabs>
				<TabPanel value={tab} index={0}>
					<StatsMem prev={prev} last={last} sortKey={sortKey} agg={agg} setAgg={setAgg} search={search} setSearch={setSearch} />
				</TabPanel>
				<TabPanel value={tab} index={1}>
					<StatsCpu prev={prev} last={last} sortKey={sortKey} agg={agg} setAgg={setAgg} search={search} setSearch={setSearch} />
				</TabPanel>
				<TabPanel value={tab} index={2}>
					<StatsTasks prev={prev} last={last} sortKey={sortKey} agg={agg} setAgg={setAgg} search={search} setSearch={setSearch} />
				</TabPanel>
				<TabPanel value={tab} index={3}>
					<StatsDiskIops prev={prev} last={last} sortKey={sortKey} agg={agg} setAgg={setAgg} search={search} setSearch={setSearch} />
				</TabPanel>
				<TabPanel value={tab} index={4}>
					<StatsDiskBandwidth prev={prev} last={last} sortKey={sortKey} agg={agg} setAgg={setAgg} search={search} setSearch={setSearch} />
				</TabPanel>
			</CardContent>
		</Card>
	)
}

export default Stats
