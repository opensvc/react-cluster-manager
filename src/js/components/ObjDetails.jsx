import React, { useState } from "react";

import { useStateValue } from '../state.js';
import { useTranslation } from 'react-i18next';
import { useObjConfig } from "../hooks/ObjConfig.jsx";
import { splitPath } from "../utils.js";
import { ObjAvail } from "./ObjAvail.jsx";
import { ObjDigest } from "./ObjDigest.jsx";
import { Log } from "./Log.jsx"
import { ObjInstances } from "./ObjInstances.jsx"
import { ObjKeys } from "./ObjKeys.jsx"
import { apiInstanceAction } from "../api.js"

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
        root: {
                flewGrow: 1,
        },
	section: {
		padding: theme.spacing(1),
	},
        tabContent: {
                paddingTop: theme.spacing(2),
        },
	tabSection: {
                marginBottom: theme.spacing(3),
	},
	card: {
		height: "100%",
	},
}))

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
		<Grid container className={classes.root}>
                        <Grid item xs={12} lg={6} className={classes.section}>
                                <ObjMain active={active} path={props.path} />
			</Grid>
                        <Grid item xs={12} lg={6} className={classes.section}>
                                <ObjConfig active={active} path={props.path} />
			</Grid>
                        <Grid item xs={12} className={classes.section}>
                                <ObjLog active={active} path={props.path} />
			</Grid>
		</Grid>
	)
}

function ObjMain(props) {
	const sp = splitPath(props.path)
	if ((sp.kind == "svc") || (sp.kind == "vol")) {
		return <SvcMain path={props.path} />
	} else if ((sp.kind == "cfg") || (sp.kind == "sec") || (sp.kind == "ccfg")) {
		return <CfgMain path={props.path} />
	} else if ((sp.kind == "usr") || (sp.kind == "ccfg")) {
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
			<ObjKeys path={props.path} />
		</React.Fragment>
	)
}

function UsrMain(props) {
	const classes = useStyles()
	const sp = splitPath(props.path)
	return (
		<React.Fragment>
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
	if (cstat.monitor.services[props.path] === undefined) {
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
	const { t, i18n } = useTranslation()
	const classes = useStyles()

	if (!data) {
		var content = ( <CircularProgress /> )
	} else {
		var date = new Date(data.mtime * 1000)
		var content = (
			<React.Fragment>
				<Typography variant="caption" color="textSecondary">Last Modified {date.toLocaleString()}</Typography>
				<pre style={{overflowX: "scroll"}}>{data.data}</pre>
			</React.Fragment>
		)
	}

	return (
		<Card className={classes.card}>
			<CardHeader
				title={t("Configuration")}
				subheader={props.path}
			/>
			<CardContent>
				{content}
			</CardContent>
		</Card>
	)
}

function ObjLog(props) {
	const { t, i18n } = useTranslation()
	return (
		<Card>
			<CardHeader
				title={t("Log")}
				subheader={props.path}
			/>
			<CardContent>
				<Log url={"/object/"+props.path} />
			</CardContent>
		</Card>
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
