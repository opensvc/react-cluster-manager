import React, { useState, useEffect } from "react";
import { useStateValue } from '../state.js';
import { apiPostNode } from "../api.js";
import { Button, Spinner, Nav, NavItem, NavLink, Dropdown, DropdownMenu, DropdownItem, DropdownToggle } from "reactstrap"
import { Log } from "./Log.jsx"

const tabs = {
	INFO: ["Main", "Network", "Initiators", "Hardware", "Users", "Groups"],
	MAIN: "Main",
	NET: "Network",
	HBA: "Initiators",
	HW: "Hardware",
	USR: "Users",
	GRP: "Groups",
	LOG: "Log",
}

function Title(props) {
	if (props.noTitle) {
		return null
	}
	return (
		<h2>{props.node}</h2>
	)
}

function NodeDetails(props) {
	const [nodeData, setNodeData] = useState()
	const [infoOpen, setInfoOpen] = useState()
	const [active, setActive] = useState(tabs.MAIN)
	const [{user}, dispatch] = useStateValue()

	useEffect(() => {
		if (nodeData) {
			return
		}
		apiPostNode(props.node, "/get_node", {}, (data) => {
			setNodeData(data)
		})
	})

	const handleClick = (e) => {
		setActive(e.target.textContent)
	}
	const toggleInfo = (e) => {
		setInfoOpen(infoOpen ? false : true)
	}

	return (
		<div>
			<Title node={props.node} noTitle={props.noTitle} />
			<Nav tabs>
				<Dropdown nav isOpen={infoOpen} toggle={toggleInfo}>
					<DropdownToggle nav caret className={tabs.INFO.includes(active) ? "active" : null} >
						{tabs.INFO.includes(active) ? active : "Info"}
					</DropdownToggle>
					<DropdownMenu>
						<DropdownItem href="#" active={active == tabs.MAIN} onClick={handleClick}>{tabs.MAIN}</DropdownItem>
						<DropdownItem href="#" active={active == tabs.NET} onClick={handleClick}>{tabs.NET}</DropdownItem>
						<DropdownItem href="#" active={active == tabs.HBA} onClick={handleClick}>{tabs.HBA}</DropdownItem>
						<DropdownItem href="#" active={active == tabs.HW} onClick={handleClick}>{tabs.HW}</DropdownItem>
					</DropdownMenu>
				</Dropdown>
				<NavItem>
					<NavLink href="#" active={active == tabs.LOG} onClick={handleClick} disabled={!("root" in user.grant)}>{tabs.LOG}</NavLink>
				</NavItem>
			</Nav>
			<div>
				<Main active={active} nodeData={nodeData} />
				<Network active={active} nodeData={nodeData} />
				<Initiators active={active} nodeData={nodeData} />
				<Hardware active={active} nodeData={nodeData} />
				<NodeLog active={active} node={props.node} />
			</div>
		</div>
	)
}

function Props(props) {
	return (
		<div className="row">
			{props.children}
		</div>
	)
}

function PropGroup(props) {
	return (
		<div className="col-xs-12 col-sm-6 col-lg-4 py-3">
			<h4>{props.title}</h4>
			{props.children}
		</div>
	)
}

function Prop(props) {
	return (
		<div className="row">
			<small className="text-muted col-6">{props.title}</small>
			<div className="col-6">{props.value}</div>
		</div>
	)
}

function Main(props) {
	if (props.active != tabs.MAIN) {
		return null
	}
	if (!props.nodeData) {
		return ( <Spinner type="grow" color="primary" size="sm" /> )
	}
	return (
		<Props>
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
		</Props>
	)
}

function NetworkInterface(props) {
	return props.data.map((e, i) => (
		<NetworkLine key={props.mac+"-"+i} mac={props.mac} data={e} />
	))
}

function NetworkLine(props) {
	return (
		<tr>
			<td data-title="Interface" style={{"flexBasis": "11rem"}}>{props.data.intf}</td>
			<td data-title="L2 Address" style={{"flexBasis": "11rem"}}>{props.mac}</td>
			<td data-title="L3 Address" style={{"flexBasis": "11rem"}}>{props.data.addr}</td>
			<td data-title="L3 Mask" style={{"flexBasis": "11rem"}}>{props.data.mask}</td>
		</tr>
	)
}

function Network(props) {
	if (props.active != tabs.NET) {
		return null
	}
	if (props.nodeData.lan === undefined) {
		return ( <Spinner type="grow" color="primary" size="sm" /> )
	}
	return (
		<table className="table table-adaptative">
			<thead>
				<tr className="text-secondary">
					<td>Interface</td>
					<td>L2 Address</td>
					<td>L3 Address</td>
					<td>L3 Mask</td>
				</tr>
			</thead>
			<tbody>
				{Object.keys(props.nodeData.lan).map((mac) => (
					<NetworkInterface key={mac} mac={mac} data={props.nodeData.lan[mac]} />
				))}
			</tbody>
		</table>
	)
}

function InitiatorsLine(props) {
	return (
		<tr>
			<td data-title="Id">{props.data.hba_id}</td>
			<td data-title="Type">{props.data.hba_type}</td>
			<td data-title="Host">{props.data.host}</td>
		</tr>
	)
}

function Initiators(props) {
	if (props.active != tabs.HBA) {
		return null
	}
	if (props.nodeData.hba === undefined) {
		return ( <Spinner type="grow" color="primary" size="sm" /> )
	}
	return (
		<table className="table table-adaptative">
			<thead>
				<tr className="text-secondary">
					<td>Id</td>
					<td>Type</td>
					<td>Host</td>
				</tr>
			</thead>
			<tbody>
				{props.nodeData.hba.map((e, i) => (
					<InitiatorsLine key={i} data={e} />
				))}
			</tbody>
		</table>
	)
}

function HardwareLine(props) {
	return (
		<tr>
			<td data-title="Type">{props.data.type}</td>
			<td data-title="Path">{props.data.path}</td>
			<td data-title="Class">{props.data.class}</td>
			<td data-title="Driver">{props.data.driver}</td>
			<td data-title="Description"  style={{"flexBasis": "100%"}} >{props.data.description}</td>
		</tr>
	)
}

function Hardware(props) {
	if (props.active != tabs.HW) {
		return null
	}
	if (props.nodeData.hardware === undefined) {
		return ( <Spinner type="grow" color="primary" size="sm" /> )
	}
	return (
		<table className="table table-adaptative">
			<thead>
				<tr className="text-secondary">
					<td>Type</td>
					<td>Path</td>
					<td>Class</td>
					<td>Driver</td>
					<td>Description</td>
				</tr>
			</thead>
			<tbody>
				{props.nodeData.hardware.map((e, i) => (
					<HardwareLine key={i} data={e} />
				))}
			</tbody>
		</table>
	)
}

function NodeLog(props) {
	if (props.active != tabs.LOG) {
		return null
	}
	return (
		<div className="pt-3">
			<Log url={"/node/"+props.node} noTitle />
		</div>
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
