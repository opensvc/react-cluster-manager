import React, { useState } from "react";
import { useReactOidc } from '@axa-fr/react-oidc-context'
import { useStateValue } from '../state.js';
import { useCatalogs } from '../hooks/Catalogs.jsx';
import { useCatalogTemplates } from '../hooks/CatalogTemplates.jsx';
import { apiPostAny } from "../api.js";
import { nameValid, namespaceValid, parseIni, createDataHasPathKey } from "../utils.js";
import { Typeahead } from 'react-bootstrap-typeahead';
import { NamespaceSelector } from './NamespaceSelector.jsx';
import { TemplateSelector } from './TemplateSelector.jsx';
import { CatalogSelector } from './CatalogSelector.jsx';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
        desc: {
                padding: theme.spacing(3, 0),
        },
        textarea: {
                fontFamily: "monospace",
		width: "100%",
        },
        formcontrol: {
                margin: theme.spacing(2, 0),
        },
}))

function DeployCatalog(props) {
	const {data, set} = props
	const { oidcUser } = useReactOidc()
	const classes = useStyles()
	const catalogs = useCatalogs()
	if ((catalogs.length > 0) && !data.catalog) {
		set({...data, catalog: catalogs[0]})
	}
	const templates = useCatalogTemplates(data.catalog ? data.catalog.name : null)

	function loadTemplate(template) {
		apiPostAny("/get_template", {catalog: data.catalog.name, template: template.id}, (buff) => {
			console.log(buff)
			set({...data, template: template, text: buff, data: toData(buff)})
		}, oidcUser)
	}
	function handleCatalogChange(selected) {
		console.log("selected catalog:", selected)
		set({...data, catalog: selected})
	}
	function handleCatalogTemplateChange(selected) {
		console.log("selected template:", selected)
		if (selected.id !== undefined) {
			loadTemplate(selected)
		}
	}
	function handleNameChange(e) {
		var oldpath = data.namespace+"/svc/"+data.name
		var newpath = data.namespace+"/svc/"+e.target.value
		var newEnvs = {...data["envs"]}
		if (path in data.envs) {
			newEnvs[newpath] = data.envs[oldpath]
			delete newEnvs[oldpath]
		}
		set({...data, name: e.target.value, envs: newEnvs})
	}
	function toData(buff) {
		try {
			return JSON.parse(buff)
		} catch(e) {}
		try {
			return parseIni(buff)
		} catch(e) {}
	}
	function submitDisabled() {
		if (!data.data) {
			return true
		}
		if (!namespaceValid(data.namespace)) {
			return true
		}
		if (!createDataHasPathKey()) {
			if (!nameValid(data.name)) {
				return true
			}
		}
		return false
	}

	function objEnv(path, envSection) {
		var c = []
		if (envSection === undefined) {
			return []
		}
		for (var key in envSection) {
			if (key.match(/\./)) {
				continue
			}
			var commentKey = key + ".comment"
			var requiredKey = key + ".required"
			var defaultValue = envSection[key] ? envSection[key] : ""
			try {
				var value = data.envs[path][key]
			} catch(e) {}
			if (value === undefined) {
				value = defaultValue
				var newEnvs = {...data.envs}
				if (!(path in newEnvs)) {
					newEnvs[path] = {}
				}
				newEnvs[path][key] = value
				set({...data, envs: newEnvs})
			}
			var label = key
			var id = path + "-" + key

			if (commentKey in envSection) {
				label = envSection[commentKey]
			}
			c.push(
				<FormControl key={id} className={classes.formcontrol} fullWidth>
					<TextField
						id={id}
						label={label}
						inputProps={{
							kw: key,
							path: path,
						}}
						value={value}
						onChange={(e) => {
							var newEnvs = {...data.envs}
							var key = e.target.getAttribute("kw")
							var path = e.target.getAttribute("path")
							if (!(path in newEnvs)) {
								newEnvs[path] = {}
							}
							newEnvs[path][key] = e.target.value
							set({...data, envs: newEnvs})
						}}
					/>
				</FormControl>
			)
		}
		if (c.length) {
			var item = (
				<Typography variant="h6" component="h2" key={path}>
					{path} customization
				</Typography>
			)
			c.splice(0, 0, item)
		}
		return c
	}

	var env = []
	if (data.data) {
		if (createDataHasPathKey()) {
			for (var path in data.data) {
				env = env.concat(objEnv(path, data.data[path].env))
			}
		} else if (data.namespace && data.name) {
			var path = data.namespace+"/svc/"+data.name
			env = env.concat(objEnv(path, data.data.env))
		}
	}

	return (
		<div>
                        <Typography className={classes.desc} component="p" color="textSecondary">
				Deploy a service from a template served by a catalog. Templates served by the <code>collector</code> catalog are read-only except for the <code>env</code> section.
			</Typography>
			<div className="dropdown-divider"></div>
			<FormControl className={classes.formcontrol} fullWidth>
				<CatalogSelector
					options={catalogs}
					onChange={handleCatalogChange}
					selected={data.catalog}
				/>
			</FormControl>
			{(templates.length > 0) &&
			<FormControl className={classes.formcontrol} fullWidth>
				<TemplateSelector
					options={templates}
					onChange={handleCatalogTemplateChange}
					selected={data.template}
				/>
			</FormControl>
			}
			{data.text &&
			<FormControl className={classes.formcontrol} fullWidth>
                                <Typography variant="caption" color="textSecondary">Definition</Typography>
				<TextareaAutosize
					placeholder="Deployment Data"
					disabled={true}
					className={classes.textarea}
					rowsMax={20}
					id="data"
					value={data.text}
					onChange={(e) => {}}
				/>
				{(data.data == null) && <FormHelperText color="error">This deployment data is not recognized as valid ini nor json dataset.</FormHelperText>}
			</FormControl>
			}
			<FormControl className={classes.formcontrol} fullWidth>
				<NamespaceSelector
					id="namespace"
					role="admin"
					placeholder="test"
					onChange={($) => set({...data, namespace: $})}
					selected={data.namespace}
				/>
			</FormControl>
			{!createDataHasPathKey() &&
                        <FormControl className={classes.formcontrol} fullWidth>
                                <TextField
                                        fullWidth
                                        error={!nameValid(data.name)}
                                        id="name"
                                        label="Name"
                                        onChange={handleNameChange}
                                        autoComplete="off"
				        value={data.name}
                                        helperText={!nameValid(name) && "Must start with an aplha and continue with aplhanum, dot, underscore or hyphen."}
                                />
                        </FormControl>
			}
			{env}
		</div>
	)
}

export {
	DeployCatalog
}
