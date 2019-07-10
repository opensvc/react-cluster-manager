import React, { useState } from "react";
import { useStateValue } from '../state.js';
import { apiPostAny, apiObjGetConfig, apiObjCreate } from "../api.js";
import { nameValid, namespaceValid, parseIni } from "../utils.js";
import { Form, Button, FormGroup, FormFeedback, Label, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import { NamespaceSelector } from './NamespaceSelector.jsx';

function DeployCatalog(props) {
	const [{
		catalogs,
		deployCatalogCatalog,
		deployCatalogTemplates,
		deployCatalogTemplate,
		deployCatalogText,
		deployCatalogData,
		deployCatalogName,
		deployCatalogNamespace
	}, dispatch] = useStateValue()
	const [envs, setEnvs] = useState({})

	function loadCatalog(catalog) {
		apiPostAny("/get_templates", {catalog: catalog[0].name}, (data) => {
			dispatch({"type": "setDeployCatalogTemplates", "value": data})
		})
	}
	function loadTemplate(template) {
		apiPostAny("/get_template", {catalog: deployCatalogCatalog[0].name, template: template[0].id}, (buff) => {
			dispatch({"type": "setDeployCatalogText", "value": buff})
			dispatch({"type": "setDeployCatalogData", "value": toData(buff)})
		})
	}
	function templateValid(template) {
		if (template[0] === undefined) {
			return false
		}
		if (deployCatalogTemplates.filter(t => t.name==template[0].name).length > 0) {
			return true
		}
		return false
	}
	function catalogValid(catalog) {
		if (catalog[0] === undefined) {
			return false
		}
		if (catalogs.filter(c => c.name==catalog[0].name).length > 0) {
			return true
		}
		return false
	}
	function handleCatalogChange(selected) {
		dispatch({"type": "setDeployCatalogCatalog", "value": selected})
		if (catalogValid(selected)) {
			loadCatalog(selected)
		}
	}
	function handleCatalogTemplateChange(selected) {
		dispatch({"type": "setDeployCatalogTemplate", "value": selected})
		if (templateValid(selected)) {
			loadTemplate(selected)
		}
	}
	function handleNameChange(e) {
		dispatch({"type": "setDeployCatalogName", "value": e.target.value})
	}
	function handleSubmit(e) {
		event.preventDefault()
		if (hasPathKey()) {
			var data = {
				"provision": true,
				"namespace": deployCatalogNamespace[0],
				"template": deployCatalogTemplate[0].id,
				"data": envs
			}
			var nObj = Object.keys(data).length
			if (nObj > 1) {
				var ok = "Objects " + Object.keys(data) + " deployed."
			} else {
				var ok = "Object " + Object.keys(data) + " deployed."
			}
		} else {
			var path = deployCatalogNamespace[0]+"/svc/"+deployCatalogName
			var data = {
				"path": path,
				"provision": true,
				"namespace": deployCatalogNamespace[0],
				"template": deployCatalogTemplate[0].id,
				"data": envs
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
			return Object.keys(deployCatalogData)[0].match(/^[a-z]+[a-z0-9_\-\.]*\/[a-z]+\/[a-z]+[a-z0-9_\-\.]*$/i)
		} catch(e) {
			return false
		}
	}
	function submitDisabled() {
		if (!deployCatalogData) {
			return true
		}
		if (!namespaceValid(deployCatalogNamespace)) {
			return true
		}
		if (!hasPathKey()) {
			if (!nameValid(deployCatalogName)) {
				return true
			}
		}
		return false
	}
	function renderCatalogItem(option, props, index) {
		if (option.desc) {
			var desc = options.desc
		} else {
			var desc = "-"
		}
		return [
			<div key="name" search={props.text}>
				{option.name}
			</div>,
			<p key="desc" className="text-secondary small text-wrap">
				{desc}
			</p>,
		]
	}

	function renderTemplateItem(option, props, index) {
		return [
			<div key="name" search={props.text}>
				{option.name}
			</div>,
			<p key="desc" className="text-secondary small text-wrap">
				{option.desc}
			</p>,
		]
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
					invalid={!nameValid(deployCatalogName)}
					valid={nameValid(deployCatalogName)}
					onChange={handleNameChange}
					value={deployCatalogName}
					autoComplete="off"
				/>
				<FormFeedback>Must start with an aplha and continue with aplhanum, dot, underscore or hyphen.</FormFeedback>
			</FormGroup>
		)
	}

	if (deployCatalogTemplates) {
		var templates = (
			<FormGroup>
				<Label for="template">Template</Label>
				<Typeahead
					id="template"
					labelKey="name"
					renderMenuItemChildren={renderTemplateItem}
					options={deployCatalogTemplates}
					onChange={handleCatalogTemplateChange}
					selected={deployCatalogTemplate}
					className="flex-grow-1"
					highlightOnlyResult={true}
					selectHintOnEnter={true}
				/>
			</FormGroup>
		)
	} else {
		var templates
	}

	function objEnv(path, data) {
		var c = []
		if (data === undefined) {
			return []
		}
		for (var key in data) {
			if (key.match(/\./)) {
				continue
			}
			var commentKey = key + ".comment"
			var requiredKey = key + ".required"
			var defaultValue = data[key] ? data[key] : ""
			try {
				var value = envs[path][key]
			} catch(e) {
				var value = defaultValue
			}
			if (value === undefined) {
				value = ""
			}
			var label = key
			var id = path + "-" + key

			if (commentKey in data) {
				label = data[commentKey]
			}
			c.push(
				<FormGroup key={id}>
					<Label for={id}>{label}</Label>
					<Input
						id={id}
						kw={key}
						path={path}
						value={value}
						onChange={(e) => {
							var newEnvs = {...envs}
							var key = e.target.getAttribute("kw")
							var path = e.target.getAttribute("path")
							if (!(path in newEnvs)) {
								newEnvs[path] = {}
							}
							newEnvs[path][key] = e.target.value
							setEnvs(newEnvs)
						}}
					/>
				</FormGroup>
			)
		}
		if (c.length) {
			var item = (
				<legend key={path}>
					{path} customization
				</legend>
			)
			c.splice(0, 0, item)
		}
		return c
	}

	var env = []
	if (deployCatalogData) {
		if (hasPathKey()) {
			for (var path in deployCatalogData) {
				env = env.concat(objEnv(path, deployCatalogData[path].env))
			}
		} else if (deployCatalogNamespace && deployCatalogName) {
			var path = deployCatalogNamespace+"/svc/"+deployCatalogName
			env = env.concat(objEnv(path, deployCatalogData.env))
		}
	}

	return (
		<Form>
			<p className="text-secondary">Deploy a service from a template served by a catalog. Templates served by the <code>collector</code> catalog are read-only except for the <code>env</code> section.</p>
			<div className="dropdown-divider"></div>
			<FormGroup>
				<Label for="catalog">Catalog</Label>
				<Typeahead
					id="catalog"
					labelKey="name"
					renderMenuItemChildren={renderCatalogItem}
					options={catalogs}
					onChange={handleCatalogChange}
					selected={deployCatalogCatalog}
					className="flex-grow-1"
					highlightOnlyResult={true}
					selectHintOnEnter={true}
				/>
			</FormGroup>
			{templates}
			<FormGroup>
				<Label for="data">Deployment Data</Label>
				<Input
					disabled={true}
					type="textarea"
					className="text-monospace"
					rows="20"
					id="data"
					invalid={deployCatalogData == null}
					valid={deployCatalogData != null}
					value={deployCatalogText}
					onChange={(e) => {}}
				/>
				<FormFeedback>This deployment data is not recognized as valid ini nor json dataset.</FormFeedback>
			</FormGroup>
			<FormGroup>
				<Label for="namespace">Namespace</Label>
				<NamespaceSelector
					id="namespace"
					role="admin"
					placeholder="test"
					selected={deployCatalogNamespace}
					onChange={($) => dispatch({"type": "setDeployCatalogNamespace", "value": $})}
				/>
				<FormFeedback>Must start with an aplha and continue with aplhanum, dot, underscore or hyphen.</FormFeedback>
			</FormGroup>
			{name}
			{env}
			<Button color="primary" disabled={submitDisabled()} onClick={handleSubmit}>Submit</Button>
		</Form>
	)
}

export {
	DeployCatalog
}
