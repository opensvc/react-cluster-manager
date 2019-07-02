import React, { Component } from "react";
import { useStateValue } from '../state.js';
import { apiObjGetConfig, apiObjCreate } from "../api.js";

function DeployButton(props) {
	//
	// props.setTab
	//
	const [ {}, dispatch ] = useStateValue()
	function handleClick(e) {
		dispatch({
			type: "setNav",
			page: "Deploy",
			links: ["Objects", "Deploy"]
		})
	}
	return (
		<div className="dropright">
			<button className="btn btn-outline-secondary" type="button" onClick={handleClick}>Deploy</button>
		</div>
	)
}

class Deploy extends Component {
	constructor(props) {
		super(props)
		this.state = {
			tab: "empty"
		}
		this.setTab = this.setTab.bind(this);
	}
	setTab(e) {
		this.setState({
			tab: e.target.id
		})
	}
	render() {
		return (
			<div>
				<h2>Deploy</h2>
				<nav>
					<div className="nav nav-tabs mb-3">
						<Tab active={this.state.tab} id="empty" text="Empty" setTab={this.setTab} />
						<Tab active={this.state.tab} id="clone" text="Clone" setTab={this.setTab} />
						<Tab active={this.state.tab} id="template" text="Template" setTab={this.setTab} />
					</div>
				</nav>
				<div className="tab-content">
					<div className="tab-pane show active">
						<DeployCurrentTab
							tab={this.state.tab}
						/>
					</div>
				</div>
			</div>
		)
	}
}

function Tab(props) {
	//
	// props.setTab
	// props.id
	// props.name
	// props.active
	//
	var cl = "nav-item nav-link"
	if (props.active == props.id) {
		cl += " active"
	} else {
		cl += " text-secondary"
	}
	return (
		<a className={cl} id={props.id} onClick={props.setTab}>{props.text}</a>
	)
}

function DeployCurrentTab(props) {
	if (props.tab == "empty") {
		return ( <DeployEmpty /> )
	} else if (props.tab == "clone") {
		return ( <DeployClone /> )
	} else if (props.tab == "template") {
		return ( <DeployTemplate /> )
	} else {
		return null
	}
}

function DeployEmpty(props) {
	const [{}, dispatch] = useStateValue();
	function createEmpty(e) {
		var namespace = e.target.parentNode.querySelector("input#namespace").value
		var name = e.target.parentNode.querySelector("input#name").value
		var path = [namespace, "svc", name].join("/")
		var data = {
			namespace: namespace,
			provision: false,
			restore: true,
			data: {}
		}
		data.data[path] = {}
		apiObjCreate(data, (data) => dispatch({type: "parseApiResponse", data: data}))
	}
	return (
		<div>
			<p className="text-secondary">Deploy an empty service to a single node, to configure later.</p>
			<div className="dropdown-divider"></div>
			<div className="form-group">
				<label htmlFor="namespace">Namespace</label>
				<input className="form-control" id="namespace" placeholder="test"/>
			</div>
			<div className="form-group">
				<label htmlFor="name">Name</label>
				<input className="form-control" id="name" placeholder="mysvc1"/>
			</div>
			<button className="btn btn-primary" onClick={createEmpty}>Submit</button>
		</div>
	)
}


function DeployClone(props) {
	const [{}, dispatch] = useStateValue();
	function createClone(e) {
		var namespace = e.target.parentNode.querySelector("input#namespace").value
		var name = e.target.parentNode.querySelector("input#name").value
		var srcpath = e.target.parentNode.querySelector("input#srcpath").value
		var path = [namespace, "svc", name].join("/")
		var data = {
			namespace: namespace,
			provision: true,
			restore: false,
			data: {}
		}
		apiObjGetConfig({svcpath: srcpath, format: "json"}, (cdata) => {
			if ("metadata" in cdata) {
				delete cdata["metadata"]
			}
			data.data[path] = cdata
			apiObjCreate(data, (data) => dispatch({type: "parseApiResponse", data: data}))
		})
	}
	return (
		<div>
			<p className="text-secondary">Deploy a service as a clone of another existing service. Beware if you have root privileges, cloning a service with fs or disk resources that were not designed for cloning might cause conflicts, source data corruption, end-user service disruption.</p>
			<div className="dropdown-divider"></div>
			<div className="form-group">
				<label htmlFor="srcpath">Path of the object to clone</label>
				<input className="form-control" id="srcpath" placeholder="test"/>
			</div>
			<div className="form-group">
				<label htmlFor="namespace">Namespace</label>
				<input className="form-control" id="namespace" placeholder="test"/>
			</div>
			<div className="form-group">
				<label htmlFor="name">Name</label>
				<input className="form-control" id="name" placeholder="mysvc1"/>
			</div>
			<button className="btn btn-primary" onClick={createClone}>Submit</button>
		</div>
	)
}

class DeployTemplate extends Component {
	constructor(props) {
		super(props)
		this.state = {
			uri: "",
			text: "",
			data: {}
		}
		this.handleLoad = this.handleLoad.bind(this);
		this.handleUriChange = this.handleUriChange.bind(this);
		this.handleTextChange = this.handleTextChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	handleUriChange(e) {
		this.setState({uri: e.target.value})
	}
	handleTextChange(e) {
		this.setState({text: e.target.value})
	}
	handleLoad(e) {
		fetch(this.state.uri)
			.then(res => res.text())
			.then(data => {
				this.setState({text: data})
				try {
					var d = JSON.parse(data)
					this.setState({data: d})
					return
				} catch(e) {
					console.log("not json")
				}
				try {
					var d = parseIni(data)
					this.setState({data: d})
					return
				} catch(e) {
					console.log("not ini")
			}
			})
	}
	handleSubmit(e) {
		event.preventDefault()
	}
	render() {
		return (
			<div>
				<p className="text-secondary">Deploy a service from a configuration, pasted or loaded from an <code>uri</code>.</p>
				<div className="dropdown-divider"></div>
				<div className="input-group mb-2">
					<input type="text" className="form-control" placeholder="https://git/project/app/deploy.json" aria-label="Deployment file uri" aria-describedby="basic-addon2" onChange={this.handleUriChange} value={this.state.uri} />
					<div className="input-group-append">
						<button className="btn btn-outline-secondary" type="button" onClick={this.handleLoad}>Load</button>
					</div>
				</div>
				<div className="form-group">
					<label htmlFor="data">Deployment Data</label>
					<textarea className="form-control" rows="20" id="data" onChange={this.handleTextChange} value={this.state.text} />
				</div>
				<button className="btn btn-primary" onClick={this.handleSubmit}>Submit</button>
			</div>
		)
	}
}

export {
	Deploy,
	DeployButton
}
