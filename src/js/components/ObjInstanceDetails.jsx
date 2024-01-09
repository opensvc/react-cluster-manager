import React, {useState} from "react"
import { useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { splitPath } from "../utils.js"
import { ObjDigest } from "./ObjDigest.jsx"
import { ObjInstanceDigest } from "./ObjInstanceDigest.jsx"
import { ObjInstanceResources } from "./ObjInstanceResources.jsx"
import { Log } from "./Log.jsx"
import Grid from '@mui/material/Grid'
import useClasses from "../hooks/useClasses.jsx";

const styles = theme => ({
	root: {
		flexGrow: 1,
	},
	section: {
		padding: theme.spacing(1),
		overflowX: "auto",
	}
});

function ObjInstanceDetails(props) {
	const [active, setActive] = useState(0)
	const loc = useLocation()
	let params = new URLSearchParams(loc.search)
	const path = params.get("path")
	const node = params.get("node")
	const classes = useClasses(styles)
	const sp = splitPath(path)

	const handleChange = (event, newValue) => {
		setActive(newValue)
	}

	return (
		<Grid container className={classes.root}>
			<Grid item xs={12} md={6} className={classes.section}>
				<ObjDigest path={path} />
			</Grid>
			<Grid item xs={12} md={6} className={classes.section}>
				<ObjInstanceDigest path={path} node={node} />
			</Grid>
			<Grid item xs={12} className={classes.section}>
				<ObjInstanceResources path={path} node={node} />
			</Grid>
			<Grid item xs={12} className={classes.section}>
				<ObjInstanceLog active={active} path={path} node={node} />
			</Grid>
		</Grid>
	)
}

function ObjInstanceLog(props) {
	const { t, i18n } = useTranslation()
	return (
		<Log
			title={t("Log")}
			subheader={props.path + "@" + props.node}
			url={"/object/"+props.path}
			hide={["o"]}
			initialContext={{"sc": {value: "n"}, "n": {value: props.node}}}
		/>
	)
}

export {
	ObjInstanceDetails
}
