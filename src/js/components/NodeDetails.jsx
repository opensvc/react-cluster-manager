import React, { useState, useEffect } from "react";
import { useStateValue } from '../state.js';
import { apiPostNode } from "../api.js";
import { Log } from "./Log.jsx"

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
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(theme => ({
        root: {
                padding: theme.spacing(3, 2),
                marginTop: theme.spacing(3),
        },
	tabContent: {
                paddingTop: theme.spacing(2),
	},
	tableWrapper: {
                overflowX: 'auto',
	},
}))

const tabs = [
	{
		name: "Main",
		disabled: false,
	},
	{
		name: "Network",
		disabled: false,
	},
	{
		name: "Initiators",
		disabled: false,
	},
	{
		name: "Hardware",
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
			{props.node}
		</Typography>
	)
}

function NodeDetails(props) {
	const classes = useStyles()
	const [nodeData, setNodeData] = useState()
	const [active, setActive] = useState(0)
	const [{user}, dispatch] = useStateValue()

	useEffect(() => {
		if (nodeData) {
			return
		}
		apiPostNode(props.node, "/get_node", {}, (data) => {
			setNodeData(data)
		})
	})

	const handleChange = (event, newValue) => {
		setActive(newValue)
	}

	if (!("root" in user.grant)) {
		tabs[4].disabled = true
	}

	return (
		<Paper className={classes.root}>
			<Title node={props.node} />
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
				{active === 0 && <Main nodeData={nodeData} />}
				{active === 1 && <Network nodeData={nodeData} />}
				{active === 2 && <Initiators nodeData={nodeData} />}
				{active === 3 && <Hardware nodeData={nodeData} />}
				{active === 4 && <NodeLog node={props.node} />}
			</Box>
		</Paper>
	)
}

function PropGroup(props) {
	return (
		<Grid item xs={12} sm={6} md={4}>
			<Typography variant="h5" component="h3">
				{props.title}
			</Typography>
			<Table>
				<TableBody>
					{props.children}
				</TableBody>
			</Table>
		</Grid>
	)
}

function Prop(props) {
	return (
		<TableRow>
			<TableCell style={{width: "40%"}}>
				<Typography variant="caption" component="h3">
					{props.title}
				</Typography>
			</TableCell>
			<TableCell style={{width: "60%"}}>
				{props.value}
			</TableCell>
		</TableRow>
	)
}

function Main(props) {
	if (!props.nodeData) {
		return <CircularProgress />
	}
	return (
		<Grid container container spacing={2}>
			<PropGroup title="Main">
				<Prop title="Manufacturer" value={props.nodeData.manufacturer.value} />
				<Prop title="Model" value={props.nodeData.model.value} />
				<Prop title="Serial" value={props.nodeData.serial.value} />
				<Prop title="SP Version" value={props.nodeData.sp_version.value} />
				<Prop title="Bios Version" value={props.nodeData.bios_version.value} />
				<Prop title="Enclosure" value={props.nodeData.enclosure.value} />
				<Prop title="Timezone" value={props.nodeData.tz.value} />
			</PropGroup>
			<PropGroup title="Processor">
				<Prop title="Dies" value={props.nodeData.cpu_dies.value} />
				<Prop title="Cores" value={props.nodeData.cpu_cores.value} />
				<Prop title="Threads" value={props.nodeData.cpu_threads.value} />
				<Prop title="Frequency" value={props.nodeData.cpu_freq.value} />
				<Prop title="Model" value={props.nodeData.cpu_model.value} />
			</PropGroup>
			<PropGroup title="Memory">
				<Prop title="Size" value={props.nodeData.mem_bytes.formatted_value} />
				<Prop title="Banks" value={props.nodeData.mem_banks.value} />
				<Prop title="Slots" value={props.nodeData.mem_slots.value} />
			</PropGroup>
			<PropGroup title="OS">
				<Prop title="Name" value={props.nodeData.os_name.value} />
				<Prop title="Vendor" value={props.nodeData.os_vendor.value} />
				<Prop title="Release" value={props.nodeData.os_release.value} />
				<Prop title="Arch" value={props.nodeData.os_arch.value} />
				<Prop title="Kernel" value={props.nodeData.os_kernel.value} />
				<Prop title="Last Boot" value={props.nodeData.last_boot.value} />
			</PropGroup>
			<PropGroup title="Agent">
				<Prop title="Version" value={props.nodeData.version.value} />
				<Prop title="Env" value={props.nodeData.node_env.value} />
			</PropGroup>
		</Grid>
	)
}

function NetworkInterface(props) {
	return props.data.map((e, i) => (
		<NetworkLine key={props.mac+"-"+i} mac={props.mac} data={e} />
	))
}

function NetworkLine(props) {
	return (
		<TableRow>
			<TableCell data-title="Interface" style={{"flexBasis": "11rem"}}>{props.data.intf}</TableCell>
			<TableCell data-title="L2 Address" style={{"flexBasis": "11rem"}}>{props.mac}</TableCell>
			<TableCell data-title="L3 Address" style={{"flexBasis": "11rem"}}>{props.data.addr}</TableCell>
			<TableCell data-title="L3 Mask" style={{"flexBasis": "11rem"}}>{props.data.mask}</TableCell>
		</TableRow>
	)
}

function Network(props) {
	const classes = useStyles()
	if (props.nodeData.lan === undefined) {
		return <CircularProgress />
	}
	return (
		<Box className={classes.tableWrapper}>
			<Table>
				<TableHead>
					<TableRow className="text-secondary">
						<TableCell>Interface</TableCell>
						<TableCell>L2 Address</TableCell>
						<TableCell>L3 Address</TableCell>
						<TableCell>L3 Mask</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{Object.keys(props.nodeData.lan).map((mac) => (
						<NetworkInterface key={mac} mac={mac} data={props.nodeData.lan[mac]} />
					))}
				</TableBody>
			</Table>
		</Box>
	)
}

function InitiatorsLine(props) {
	return (
		<TableRow>
			<TableCell data-title="Id">{props.data.hba_id}</TableCell>
			<TableCell data-title="Type">{props.data.hba_type}</TableCell>
			<TableCell data-title="Host">{props.data.host}</TableCell>
		</TableRow>
	)
}

function Initiators(props) {
	const classes = useStyles()
	if (props.nodeData.hba === undefined) {
		return <CircularProgress />
	}
	return (
		<Box className={classes.tableWrapper}>
			<Table>
				<TableHead>
					<TableRow className="text-secondary">
						<TableCell>Id</TableCell>
						<TableCell>Type</TableCell>
						<TableCell>Host</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{props.nodeData.hba.map((e, i) => (
						<InitiatorsLine key={i} data={e} />
					))}
				</TableBody>
			</Table>
		</Box>
	)
}

function HardwareLine(props) {
	return (
		<TableRow>
			<TableCell data-title="Type">{props.data.type}</TableCell>
			<TableCell data-title="Path">{props.data.path}</TableCell>
			<TableCell data-title="Class">{props.data.class}</TableCell>
			<TableCell data-title="Driver">{props.data.driver}</TableCell>
			<TableCell data-title="Description"  style={{"flexBasis": "100%"}} >{props.data.description}</TableCell>
		</TableRow>
	)
}

function Hardware(props) {
	const classes = useStyles()
	if (props.nodeData.hardware === undefined) {
		return <CircularProgress />
	}
	return (
		<Box className={classes.tableWrapper}>
			<Table>
				<TableHead>
					<TableRow className="text-secondary">
						<TableCell>Type</TableCell>
						<TableCell>Path</TableCell>
						<TableCell>Class</TableCell>
						<TableCell>Driver</TableCell>
						<TableCell>Description</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{props.nodeData.hardware.map((e, i) => (
						<HardwareLine key={i} data={e} />
					))}
				</TableBody>
			</Table>
		</Box>
	)
}

function NodeLog(props) {
	return (
		<Log url={"/node/"+props.node} />
	)
}

function NodeLogButton(props) {
	return (
		<Button
			color="outline-secondary"
			size="sm"
			onClick={(e) => setNav({
				"page": props.node + " Log",
				"links": ["Nodes", props.node, "Log"]
			})}
		>Log</Button>
	)
}

export {
	NodeDetails
}
