import React, { useState } from "react";

import { useStateValue } from '../state.js';
import { useObjConfig } from "../hooks/ObjConfig.jsx";
import { parseIni, splitPath } from "../utils.js";
import { ObjAvail } from "./ObjAvail.jsx";
import { ObjDigest } from "./ObjDigest.jsx";
import { ObjInstanceState } from "./ObjInstanceState.jsx";
import { ObjInstanceActions } from "./ObjInstanceActions.jsx";
import { Log } from "./Log.jsx"
import { ObjInstances } from "./ObjInstances.jsx"
import { apiPostAny, apiInstanceAction } from "../api.js"

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles(theme => ({
        root: {
                padding: theme.spacing(3, 2),
                marginTop: theme.spacing(3),
        },
        tabContent: {
                paddingTop: theme.spacing(2),
        },
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
		<Typography variant="h5" component="h3">
			{props.path}
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
			<ObjKeyAdd path={props.path} />
			<ObjKeys path={props.path} />
		</React.Fragment>
	)
}

function ObjKeyAdd(props) {
	const [isOpen, setIsOpen] = useState(false)
	const source = {
		"INPUT": "User Input",
		"LOCAL": "Local File",
		"REMOTE": "Remote Location",
	}
	const [active, setActive] = useState(source.INPUT)
	const [inputValue, setInputValue] = useState("")
	const [urlValue, setUrlValue] = useState("")
	const [fileValue, setFileValue] = useState("")
	const [keyName, setKeyName] = useState("")
	function handleToggle(e) {
		setIsOpen(isOpen ? false : true)
	}
	function handleSourceChange(e) {
		setActive(e.target.value)
	}
	function handleSubmit(e) {
		if (active == source.INPUT) {
			apiPostAny("/set_key", {path: props.path, key: keyName, data: inputValue}, (data) => {
				// reload config custom hook
				console.log(data)
			})
		}
	}
	return (
		<div>
			<Button
				variant="contained"
				color="primary"
				onClick={handleToggle}
			>
				Add Key
			</Button>
			<div hidden={!isOpen}>
				<FormGroup>
					<TextField
						label="Key Name"
						id="name"
						value={keyName}
						onChange={(e) => setKeyName(e.target.value)}
					/>
				</FormGroup>
				<FormGroup>
					<Select
						label="Value Source"
						value={active}
						onChange={handleSourceChange}
						inputProps={{
							name: 'source',
							id: 'source',
						}}
					>
						<MenuItem value={source.INPUT}>{source.INPUT}</MenuItem>
						<MenuItem value={source.LOCAL}>{source.LOCAL}</MenuItem>
						<MenuItem value={source.REMOTE}>{source.REMOTE}</MenuItem>
					</Select>
				</FormGroup>
				<FormGroup hidden={active!=source.INPUT}>
					<TextField
						label="Key Value"
						id="name"
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
					/>
				</FormGroup>
				<FormGroup hidden={active!=source.REMOTE}>
					<TextField
						label="Remote Location"
						id="url"
						type="url"
						value={urlValue}
						onChange={(e) => setUrlValue(e.target.value)}
					/>
				</FormGroup>
				<FormGroup hidden={active!=source.LOCAL}>
					<TextField
						label="File"
						id="file"
						type="file"
						label={fileValue}
						onChange={(e) => setFileValue(e.target.uploadFile)}
					/>
				</FormGroup>
				<Button
					variant="contained"
					color="secondary"
					onClick={handleSubmit}
				>
					Submit
				</Button>
			</div>
		</div>
	)
}

function ObjKeys(props) {
	const conf = useObjConfig(props.path)
	if (!conf || !conf.data) {
		return null
	}
	var confData = parseIni(conf.data)
	if (confData.data === undefined) {
		return (<div>"This configuration hosts no key yet."</div>)
	}
	return (
		<Table>
			<TableHead>
				<TableRow className="text-secondary">
					<TableCell>Key</TableCell>
					<TableCell>Type</TableCell>
					<TableCell>Value</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{Object.keys(confData.data).sort().map((keyName) => (
					<ObjKey key={keyName} keyValue={confData.data[keyName]} keyName={keyName} />
				))}
			</TableBody>
		</Table>
	)
}

function ObjKey(props) {
	var i = props.keyValue.indexOf(":")
	var valueType = props.keyValue.slice(0, i)
	var value = props.keyValue.slice(i+1)
	console.log(valueType, value)
	if (valueType != "literal") {
		var value = ( <Button>Decode</Button> )
	}
	return (
		<TableRow>
			<TableCell>{props.keyName}</TableCell>
			<TableCell><span className="badge badge-secondary mr-2">{valueType}</span></TableCell>
			<TableCell>{value}</TableCell>
		</TableRow>
	)
}

function SvcMain(props) {
	const sp = splitPath(props.path)
	const [{ cstat }, dispatch] = useStateValue();

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
			<ObjDigest path={props.path} />
			<ObjScale path={props.path} />
			<ObjInstances path={props.path} />
		</div>
	)
}

function ObjScale(props) {
	const [{ cstat }, dispatch] = useStateValue();

	if (cstat.monitor === undefined) {
		return null
	}
	if (!("scale" in cstat.monitor.services[props.path])) {
		return null
	}
	const [ scale, setScale] = useState(cstat.monitor.services[props.path].scale)
	function handleChange(e) {
		setScale(e.target.value)
	}
	function handleSubmit() {
		apiInstanceAction(
			"ANY",
			props.path,
			"scale",
			{"to": scale},
			(data) => dispatch({type: "parseApiResponse", data: data})
		)
	}
	return (
		<FormGroup row>
			<TextField
				label="Key Name"
				id="name"
				value={scale}
				onChange={handleChange}
				type="number"
			>
				Scale Target
			</TextField>
			<Button
				variant="contained"
				color="secondary"
				onClick={handleSubmit}>
				Submit
			</Button>
		</FormGroup>
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
			<p className="text-secondary">Last Modified {date.toLocaleString()}</p>
			<pre>{data.data}</pre>
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
