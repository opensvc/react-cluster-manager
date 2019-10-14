import React, { useState, useEffect } from "react"
import { useStateValue } from '../state.js'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'
import { apiPostNode } from "../api.js"
import { Log } from "./Log.jsx"
import { NodeActions } from "./NodeActions.jsx"
import { NodeNetwork } from "./NodeNetwork.jsx"
import { NodeHardware } from "./NodeHardware.jsx"
import { NodeInitiators } from "./NodeInitiators.jsx"
import { NodeStateList } from "./NodeStateList.jsx"
import { NodeDigest } from "./NodeDigest.jsx"
import PropGroup from "./PropGroup.jsx"
import Prop from "./Prop.jsx"
import NodeLabels from "./NodeLabels.jsx"

import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'

const useStyles = makeStyles(theme => ({
        root: {
                marginTop: theme.spacing(3),
		flexGrow: 1,
        },
}))

function NodeDetails(props) {
	const classes = useStyles()
        const loc = useLocation()
	const [nodeData, setNodeData] = useState()
        let params = new URLSearchParams(loc.search)
        const name = params.get("name")

	useEffect(() => {
		if (nodeData) {
			return
		}
		apiPostNode(name, "/get_node", {}, (data) => {
			setNodeData(data)
		})
	})

	return (
		<Grid container spacing={2} className={classes.root}>
			<Grid item xs={12} sm={6} md={4}>
				<NodeDigest name={name} nodeData={nodeData} />
			</Grid>
			<NodeLabels name={name} />
			<Main nodeData={nodeData} />
			<NodeNetwork nodeData={nodeData} />
			<NodeInitiators nodeData={nodeData} />
			<NodeHardware nodeData={nodeData} />
			<Grid item xs={12}>
				<NodeLog node={name} />
			</Grid>
		</Grid>
	)
}

function Main(props) {
	if (!props.nodeData) {
		return null
	}
	return (
		<React.Fragment>
			<PropGroup title="Server">
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
			<PropGroup title="System">
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
		</React.Fragment>
	)
}

function NodeLog(props) {
	const { i18n, t } = useTranslation()
	const [{user}, dispatch] = useStateValue()
	if (!user.grant || !("root" in user.grant)) {
		return null
	}
	return (
		<Log title={t("Log")} url={"/node/"+props.node} />
	)
}

export {
	NodeDetails
}
