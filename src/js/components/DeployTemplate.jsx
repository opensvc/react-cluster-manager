import React, { useState } from "react";
import { useStateValue } from '../state.js';
import { apiPostAny, apiObjGetConfig, apiObjCreate } from "../api.js";
import { nameValid, namespaceValid, parseIni } from "../utils.js";
import { Form, Button, FormGroup, FormFeedback, Label, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import { NamespaceSelector } from './NamespaceSelector.jsx'

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
				"namespace": deployTemplateNamespace[0],
				"data": deployTemplateData
			}
			var nObj = Object.keys(data).length
			if (nObj > 1) {
				var ok = "Objects " + Object.keys(data) + " deployed."
			} else {
				var ok = "Object " + Object.keys(data) + " deployed."
			}
		} else {
			var path = deployTemplateNamespace[0]+"/svc/"+deployTemplateName
			var data = {
				"provision": true,
				"namespace": deployTemplateNamespace[0],
				"data": {
					[path]: deployTemplateData
				}
			}
			var ok = "Object " + path + " deployed."
		}
		console.log("submit", data)
		apiObjCreate(data, (data) => dispatch({
			type: "parseApiResponse",
			ok: ok,
			data: data
		}))
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
	function submitDisabled() {
		if (!deployTemplateData) {
			return true
		}
		if (!namespaceValid(deployTemplateNamespace)) {
			return true
		}
		if (!hasPathKey()) {
			if (!nameValid(deployTemplateName)) {
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
				<Input
					id="name"
					placeholder="mysvc1"
					invalid={!nameValid(deployTemplateName)}
					valid={nameValid(deployTemplateName)}
					onChange={handleNameChange}
					value={deployTemplateName}
					autoComplete="off"
				/>
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
				<InputGroup>
					<Input
						type="text"
						id="uri"
						placeholder="https://git/project/app/deploy.json"
						onChange={handleUriChange}
						value={deployTemplateUri}
					/>
					<InputGroupAddon addonType="append">
						<Button color="outline-secondary" type="button" onClick={handleLoad}>Load</Button>
					</InputGroupAddon>
				</InputGroup>
			</FormGroup>
			<FormGroup>
				<Label for="data">Deployment Data</Label>
				<Input
					type="textarea"
					className="text-monospace"
					rows="20"
					id="data"
					invalid={!deployTemplateData == null}
					valid={deployTemplateData != null}
					onChange={handleTextChange}
					value={deployTemplateText}
				/>
				<FormFeedback>This deployment data is not recognized as valid ini nor json dataset.</FormFeedback>
			</FormGroup>
			<FormGroup>
				<Label for="namespace">Namespace</Label>
				<NamespaceSelector
					id="namespace"
					role="admin"
					placeholder="test"
					selected={deployTemplateNamespace}
					onChange={($) => dispatch({"type": "setDeployTemplateNamespace", "value": $})}
				/>
				<FormFeedback>Must start with an aplha and continue with aplhanum, dot, underscore or hyphen.</FormFeedback>
			</FormGroup>
			{name}
			<Button color="primary" disabled={submitDisabled()} onClick={handleSubmit}>Submit</Button>
		</Form>
	)
}

export {
	DeployTemplate
}
