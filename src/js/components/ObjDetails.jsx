import React, { useState } from "react";

import { useStateValue } from '../state.js';
import { useObjConfig } from "../hooks/ObjConfig.jsx";
import { splitPath } from "../utils.js";
import { ObjAvail } from "./ObjAvail.jsx";
import { ObjDigest } from "./ObjDigest.jsx";
import { Log } from "./Log.jsx"
import { ObjInstances } from "./ObjInstances.jsx"
import { ObjKeys } from "./ObjKeys.jsx"
import { apiInstanceAction } from "../api.js"

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
        root: {
                padding: theme.spacing(3, 2),
                marginTop: theme.spacing(3),
        },
        tabContent: {
                paddingTop: theme.spacing(2),
        },
	tabSection: {
                marginBottom: theme.spacing(3),
	}
}))

const tabs = [
	{
		name: "Main",
		disabled: false,
	},
	{
		name: "Config",
		disabled: false,
	},
	{
		name: "Log",
		disabled: false,
	},
]

function Title(props) {
	return (
		<Typography variant="h4" component="p">
			<Link href="#">
				{props.path}
			</Link>
		</Typography>
	)
}

function ObjDetails(props) {
	//
	// props.path
	//
	const classes = useStyles()
        const [nodeData, setNodeData] = useState()
        const [active, setActive] = useState(0)
        const [{user}, dispatch] = useStateValue()

        const handleChange = (event, newValue) => {
                setActive(newValue)
        }

	return (
		<Paper className={classes.root}>
			<Title path={props.path} />
                        <Tabs
                                value={active}
                                onChange={handleChange}
                                indicatorColor="primary"
                                textColor="primary"
                                variant="scrollable"
                                scrollButtons="auto"
                        >
                                {tabs.map((tab, i) => (
                                        <Tab key={i} href="#" label={tab.name} disabled={tab.disabled} />
                                ))}
                        </Tabs>
                        <Box className={classes.tabContent}>
                                {active === 0 && <ObjMain active={active} path={props.path} />}
                                {active === 1 && <ObjConfig active={active} path={props.path} />}
                                {active === 2 && <ObjLog active={active} path={props.path} />}
                        </Box>
		</Paper>
	)
}

function ObjMain(props) {
	const sp = splitPath(props.path)
	if ((sp.kind == "svc") || (sp.kind == "vol")) {
		return <SvcMain path={props.path} />
	} else if ((sp.kind == "cfg") || (sp.kind == "sec") || (sp.kind == "ccfg")) {
		return <CfgMain path={props.path} />
	} else if ((sp.kind == "usr") || (sp.kind == "sec") || (sp.kind == "ccfg")) {
		return <UsrMain path={props.path} />
	} else {
		return null
	}
}

function CfgMain(props) {
	const classes = useStyles()
	const sp = splitPath(props.path)
	return (
		<React.Fragment>
			<Typography variant="h5" component="h3">
				Keys
			</Typography>
			<ObjKeys path={props.path} />
		</React.Fragment>
	)
}

function SvcMain(props) {
	const sp = splitPath(props.path)
	const [{ cstat }, dispatch] = useStateValue();
	const classes = useStyles()

	if (cstat.monitor === undefined) {
		return null
	}
	if ("scale" in cstat.monitor.services[props.path]) {
		var title = "Scaler"
	} else if (cstat.monitor.services[props.path].scaler_slave) {
		var title = "Scaler Slice"
	} else {
		var title = "Object"
	}
	return (
		<div>
			<Typography variant="h5" component="h3">
				{title}
			</Typography>
			<div className={classes.tabSection}>
				<ObjDigest path={props.path} />
			</div>
			<div className={classes.tabSection}>
				<ObjInstances path={props.path} />
			</div>
		</div>
	)
}

function ObjConfig(props) {
	//
	// props.path
	//
	const data = useObjConfig(props.path)
	if (!data) {
		return ( <CircularProgress /> )
	}
	const date = new Date(data.mtime * 1000)

	return (
		<div>
			<Typography variant="caption" color="textSecondary">Last Modified {date.toLocaleString()}</Typography>
			<pre style={{overflowX: "scroll"}}>{data.data}</pre>
		</div>
	)
}

function ObjLog(props) {
	return (
		<Log url={"/object/"+props.path} />
	)
}

function ObjLogButton(props) {
	return (
		<Button
			color="outline-secondary"
			size="sm"
			onClick={(e) => setNav({
				"page": props.path + " Log",
				"links": ["Objects", props.path, "Log"]
			})}
		>Log</Button>
	)
}

export {
	ObjDetails
}
