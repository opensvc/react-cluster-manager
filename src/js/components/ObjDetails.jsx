import React, { useState } from "react";

import { useStateValue } from '../state.js';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { splitPath } from "../utils.js";
import { ObjAvail } from "./ObjAvail.jsx";
import { ObjDigest } from "./ObjDigest.jsx";
import { Log } from "./Log.jsx"
import { ObjInstances } from "./ObjInstances.jsx"
import { ObjKeys } from "./ObjKeys.jsx"
import ObjConfig from "./ObjConfig.jsx"

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import useClasses from "../hooks/useClasses.jsx";

const styles = theme => ({
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
})

function ObjDetails(props) {
        const loc = useLocation()
        let params = new URLSearchParams(loc.search)
        const path = params.get("path")
	const classes = useClasses(styles)
        const [nodeData, setNodeData] = useState()
        const [active, setActive] = useState(0)
        const [{user}, dispatch] = useStateValue()

        const handleChange = (event, newValue) => {
                setActive(newValue)
        }

	return (
		<Grid container className={classes.root}>
			<ObjMain active={active} path={path} />
                        <Grid item xs={12} lg={6} className={classes.section}>
                                <ObjConfig active={active} path={path} />
			</Grid>
                        <Grid item xs={12} lg={6} className={classes.section}>
                                <ObjLog active={active} path={path} />
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
	const classes = styles()
	const sp = splitPath(props.path)
	return (
		<Grid item xs={12} className={classes.section}>
			<ObjKeys path={props.path} />
		</Grid>
	)
}

function UsrMain(props) {
	const classes = styles()
	const sp = splitPath(props.path)
	return (
		<Grid item xs={12} className={classes.section}>
			<ObjKeys path={props.path} />
		</Grid>
	)
}

function SvcMain(props) {
	const sp = splitPath(props.path)
	const [{ cstat }, dispatch] = useStateValue();
	const classes = styles()

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
		<React.Fragment>
			<Grid item xs={12} md={6} className={classes.section}>
				<ObjDigest path={props.path} />
			</Grid>
			<Grid item xs={12} md={6} className={classes.section}>
				<ObjInstances path={props.path} />
			</Grid>
		</React.Fragment>
	)
}

function ObjLog(props) {
	const { t, i18n } = useTranslation()
	return (
		<Log
			title={t("Log")}
			subheader={props.path}
			url={"/object/"+props.path}
			hide={["o"]}
			initialContext={{"sc": {value: "n"}}}
		/>
	)
}

export {
	ObjDetails
}
