import React, { Component, useState } from "react";
import { useStateValue } from '../state.js';
import { apiObjGetConfig, apiObjCreate } from "../api.js";
import { parseIni } from "../utils.js";
import { Col, Row, Form, Button, FormGroup, FormFeedback, Label, Input } from 'reactstrap';


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
			<Button color="outline-secondary" type="button" onClick={handleClick}>Deploy</Button>
		</div>
	)
}

function Deploy(props) {
	const [tab, setTab] = useState("empty")
	var title
	if ((props.noTitle === undefined) || !props.noTitle) {
		title = (
			<h2>Deploy</h2>
		)
	}

	return (
		<div>
			{title}
			<nav>
				<div className="nav nav-tabs mb-3">
					<Tab active={tab} id="empty" text="Empty" setTab={setTab} />
					<Tab active={tab} id="clone" text="Clone" setTab={setTab} />
					<Tab active={tab} id="template" text="Template" setTab={setTab} />
				</div>
			</nav>
			<div className="tab-content">
				<div className="tab-pane show active">
					<DeployCurrentTab
						tab={tab}
					/>
				</div>
			</div>
		</div>
	)
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
		<a className={cl} id={props.id} onClick={() => {props.setTab(props.id)}}>{props.text}</a>
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
			<FormGroup>
				<Label for="namespace">Namespace</Label>
				<Input id="namespace" placeholder="test"/>
			</FormGroup>
			<FormGroup>
				<Label for="name">Name</Label>
				<Input id="name" placeholder="mysvc1"/>
			</FormGroup>
			<Button color="primary" onClick={createEmpty}>Submit</Button>
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
			<FormGroup>
				<Label for="srcpath">Path of the object to clone</Label>
				<Input id="srcpath" placeholder="test"/>
			</FormGroup>
			<FormGroup>
				<Label for="namespace">Namespace</Label>
				<Input id="namespace" placeholder="test"/>
			</FormGroup>
			<FormGroup>
				<Label for="name">Name</Label>
				<Input id="name" placeholder="mysvc1"/>
			</FormGroup>
			<Button color="primary" onClick={createClone}>Submit</Button>
		</div>
	)
}

function DeployTemplate(props) {
	const [{
		deployTemplateUri,
		deployTemplateText,
		deployTemplateData,
		deployTemplateName,
		deployTemplateNamespace
	}, dispatch] = useStateValue()

	function handleUriChange(e) {
		dispatch({"type": "setDeployTemplateUri", "value": e.target.value})
	}
	function handleTextChange(e) {
		dispatch({"type": "setDeployTemplateText", "value": e.target.value})
		dispatch({"type": "setDeployTemplateData", "value": toData(e.target.value)})
	}
	function handleNameChange(e) {
		dispatch({"type": "setDeployTemplateName", "value": e.target.value})
	}
	function handleNamespaceChange(e) {
		dispatch({"type": "setDeployTemplateNamespace", "value": e.target.value})
	}
	function handleLoad(e) {
		fetch(deployTemplateUri)
			.then(res => res.text())
			.then(buff => {
				dispatch({"type": "setDeployTemplateText", "value": buff})
				dispatch({"type": "setDeployTemplateData", "value": toData(buff)})
			})
	}
	function handleSubmit(e) {
		event.preventDefault()
		if (hasPathKey()) {
			var data = {
				"provision": true,
				"namespace": deployTemplateNamespace,
				"data": deployTemplateData
			}
		} else {
			var path = deployTemplateNamespace+"/svc/"+deployTemplateName
			var data = {
				"provision": true,
				"namespace": deployTemplateNamespace,
				"data": {
					[path]: deployTemplateData
				}
			}
		}
		console.log("submit", data)
		apiObjCreate(data, (data) => dispatch({type: "parseApiResponse", data: data}))
	}
	function toData(buff) {
		try {
			return JSON.parse(buff)
		} catch(e) {}
		try {
			return parseIni(buff)
		} catch(e) {}
	}
	function hasPathKey() {
		try {
			return Object.keys(deployTemplateData)[0].match(/^[a-z]+[a-z0-9_\-\.]*\/[a-z]+\/[a-z]+[a-z0-9_\-\.]*$/i)
		} catch(e) {
			return false
		}
	}
	function nameValid() {
		if (deployTemplateName === undefined) {
			return false
		}
		if (!deployTemplateName.match(/^[a-z]+[a-z0-9_\-\.]*$/i)) {
			return false
		}
		return true
	}
	function namespaceValid() {
		if (deployTemplateNamespace === undefined) {
			return false
		}
		if (!deployTemplateNamespace.match(/^[a-z]+[a-z0-9_\-\.]*$/i)) {
			return false
		}
		return true
	}
	function submitDisabled() {
		if (!deployTemplateData) {
			return true
		}
		if (!namespaceValid()) {
			return true
		}
		if (!hasPathKey()) {
			if (!nameValid()) {
				return true
			}
		}
		return false
	}

	if (hasPathKey()) {
		var name
	} else {
		var name = (
			<FormGroup>
				<Label for="name">Name</Label>
				<Input id="name" placeholder="mysvc1" invalid={!nameValid()} valid={nameValid()} onChange={handleNameChange} value={deployTemplateName} />
				<FormFeedback>Must start with an aplha and continue with aplhanum, dot, underscore or hyphen.</FormFeedback>
			</FormGroup>
		)
	}
	return (
		<Form>
			<p className="text-secondary">Deploy a service from a configuration, pasted or loaded from an <code>uri</code>.</p>
			<div className="dropdown-divider"></div>
			<FormGroup>
				<Label for="uri">Deployment Data URI</Label>
				<div className="input-group mb-2">
					<Input type="text" id="uri" placeholder="https://git/project/app/deploy.json" onChange={handleUriChange} value={deployTemplateUri} />
					<div className="input-group-append">
						<Button color="outline-secondary" type="button" onClick={handleLoad}>Load</Button>
					</div>
				</div>
			</FormGroup>
			<FormGroup>
				<Label for="data">Deployment Data</Label>
				<Input type="textarea" className="text-monospace" rows="20" id="data" invalid={!deployTemplateData} valid={deployTemplateData} onChange={handleTextChange} value={deployTemplateText} />
				<FormFeedback>This deployment data is not recognized as valid ini nor json dataset.</FormFeedback>
			</FormGroup>
			<FormGroup>
				<Label for="namespace">Namespace</Label>
				<Input id="namespace" placeholder="test" invalid={!namespaceValid()} valid={namespaceValid()} onChange={handleNamespaceChange} value={deployTemplateNamespace} />
				<FormFeedback>Must start with an aplha and continue with aplhanum, dot, underscore or hyphen.</FormFeedback>
			</FormGroup>
			{name}
			<Button color="primary" disabled={submitDisabled()} onClick={handleSubmit}>Submit</Button>
		</Form>
	)
}

export {
	Deploy,
	DeployButton
}
