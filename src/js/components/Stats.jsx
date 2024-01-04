import React, { useState, Fragment } from "react"
import { useTranslation } from "react-i18next"
import useDaemonStats from "../hooks/DaemonStats.jsx"
import StatsCpu from "./StatsCpu.jsx"
import StatsMem from "./StatsMem.jsx"
import StatsTasks from "./StatsTasks.jsx"
import StatsDiskIops from "./StatsDiskIops.jsx"
import StatsDiskBandwidth from "./StatsDiskBandwidth.jsx"
import StatsNetIops from "./StatsNetIops.jsx"
import StatsNetBandwidth from "./StatsNetBandwidth.jsx"

import { makeStyles } from '@mui/styles'
import Card from "@mui/material/Card"
import CardHeader from "@mui/material/CardHeader"
import CardContent from "@mui/material/CardContent"
import AppBar from "@mui/material/AppBar"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import Tooltip from "@mui/material/Tooltip"

import IconButton from "@mui/material/IconButton"
import PauseIcon from "@mui/icons-material/Pause"
import PlayArrowIcon from "@mui/icons-material/PlayArrow"
import SortIcon from "@mui/icons-material/Sort"
import SortByAlphaIcon from "@mui/icons-material/SortByAlpha"
import ViewStreamIcon from "@mui/icons-material/ViewStream"
import ViewHeadlineIcon from "@mui/icons-material/ViewHeadline"
import FilterListIcon from "@mui/icons-material/FilterList"

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
	const { t } = useTranslation()
	function handleClick(e) {
		if (search) {
			return
		}
		setSearchOpen(!searchOpen)
	}
	return (
		<Tooltip title={t("Filter")}>
			<IconButton onClick={handleClick}>
				<FilterListIcon />
			</IconButton>
		</Tooltip>
	)
}

function AggStats(props) {
	const { agg, setAgg } = props
	const { t } = useTranslation()
	return (
		<Tooltip title={(agg == "ns") ? t("Toggle object aggregation") : t("Toggle namespace aggregation")}>
			<IconButton
				onClick={() => { (agg == "ns") ? setAgg("path") : setAgg("ns") }}
			>
				{(agg == "ns") ? <ViewStreamIcon /> : <ViewHeadlineIcon />}
			</IconButton>
		</Tooltip>
	)
}

function PlayStats(props) {
	const { playing, play, pause } = props
	const { t } = useTranslation()
	return (
		<Tooltip title={playing ? t("Pause feed") : t("Resume feed")}>
			<IconButton
				onClick={() => { playing ? pause() : play() }}
			>
				{playing ? <PauseIcon /> : <PlayArrowIcon />}
			</IconButton>
		</Tooltip>
	)
}

function SortStats(props) {
	const { sortKey, setSortKey } = props
	const { t } = useTranslation()
	function handleClick(e) {
		if (sortKey == "value") {
			setSortKey("alpha")
		} else {
			setSortKey("value")
		}
	}
	return (
		<Tooltip title={(sortKey == "value") ? t("Toggle sort by name") : t("Toggle sort by metric")}>
			<IconButton
				onClick={(e) => handleClick(e)}
			>
				{(sortKey == "value") ? <SortIcon /> : <SortByAlphaIcon />}
			</IconButton>
		</Tooltip>
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
					variant="scrollable"
				>
					<Tab label="Mem" {...a11yProps(0)} />
					<Tab label="Cpu" {...a11yProps(1)} />
					<Tab label="Tasks" {...a11yProps(2)} />
					<Tab label="Disk I/O" {...a11yProps(3)} />
					<Tab label="Disk B/W" {...a11yProps(4)} />
					<Tab label="Net I/O" {...a11yProps(5)} />
					<Tab label="Net B/W" {...a11yProps(6)} />
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
				<TabPanel value={tab} index={5}>
					<StatsNetIops prev={prev} last={last} sortKey={sortKey} agg={agg} setAgg={setAgg} search={search} setSearch={setSearch} />
				</TabPanel>
				<TabPanel value={tab} index={6}>
					<StatsNetBandwidth prev={prev} last={last} sortKey={sortKey} agg={agg} setAgg={setAgg} search={search} setSearch={setSearch} />
				</TabPanel>
			</CardContent>
		</Card>
	)
}

export default Stats
