import React, { useState } from "react";
import { useStateValue } from '../state.js';
import { apiPostAny, apiObjGetConfig, apiObjCreate } from "../api.js";
import { nameValid, namespaceValid, parseIni } from "../utils.js";
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
import Button from '@material-ui/core/Button';

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
	const classes = useStyles()

	function loadCatalog(catalog) {
		apiPostAny("/get_templates", {catalog: deployCatalogCatalog.name}, (data) => {
			dispatch({"type": "setDeployCatalogTemplates", "value": data})
		})
	}
	function loadTemplate(template) {
		apiPostAny("/get_template", {catalog: deployCatalogCatalog.name, template: template.id}, (buff) => {
			dispatch({"type": "setDeployCatalogText", "value": buff})
			dispatch({"type": "setDeployCatalogData", "value": toData(buff)})
		})
	}
	function templateValid(template) {
		if (template.id === undefined) {
			return false
		}
		return true
	}
	function catalogValid(catalog) {
		console.log("validation catalog", catalog)
		if (catalog === undefined) {
			return false
		}
		return true
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
		var oldpath = deployCatalogNamespace+"/svc/"+deployCatalogName
		var newpath = deployCatalogNamespace+"/svc/"+e.target.value
		if (path in envs) {
			var newEnvs = {...envs}
			newEnvs[newpath] = envs[oldpath]
			delete newEnvs[oldpath]
			setEnvs(newEnvs)
		}
		dispatch({"type": "setDeployCatalogName", "value": e.target.value})
	}
	function handleSubmit(e) {
		event.preventDefault()
		if (hasPathKey()) {
			var data = {
				"provision": true,
				"namespace": deployCatalogNamespace,
				"template": deployCatalogTemplate.id,
				"data": envs
			}
			var nObj = Object.keys(data).length
			if (nObj > 1) {
				var ok = "Objects " + Object.keys(data) + " deployed."
			} else {
				var ok = "Object " + Object.keys(data) + " deployed."
			}
		} else {
			var path = deployCatalogNamespace+"/svc/"+deployCatalogName
			var data = {
				"path": path,
				"provision": true,
				"namespace": deployCatalogNamespace,
				"template": deployCatalogTemplate.id,
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
			} catch(e) {}
			if (value === undefined) {
				value = defaultValue
				var newEnvs = {...envs}
				if (!(path in newEnvs)) {
					newEnvs[path] = {}
				}
				newEnvs[path][key] = value
				setEnvs(newEnvs)
			}
			var label = key
			var id = path + "-" + key

			if (commentKey in data) {
				label = data[commentKey]
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
		<div>
                        <Typography className={classes.desc} component="p" color="textSecondary">
				Deploy a service from a template served by a catalog. Templates served by the <code>collector</code> catalog are read-only except for the <code>env</code> section.
			</Typography>
			<div className="dropdown-divider"></div>
			<FormControl className={classes.formcontrol} fullWidth>
				<CatalogSelector
					options={catalogs}
					onChange={handleCatalogChange}
					selected={deployCatalogCatalog}
				/>
			</FormControl>
			{(deployCatalogTemplates.length > 0) &&
			<FormControl className={classes.formcontrol} fullWidth>
				<TemplateSelector
					options={deployCatalogTemplates}
					onChange={handleCatalogTemplateChange}
					selected={deployCatalogTemplate}
				/>
			</FormControl>
			}
			{deployCatalogText &&
			<FormControl className={classes.formcontrol} fullWidth>
                                <Typography variant="caption" color="textSecondary">Definition</Typography>
				<TextareaAutosize
					placeholder="Deployment Data"
					disabled={true}
					className={classes.textarea}
					rowsMax={20}
					id="data"
					value={deployCatalogText}
					onChange={(e) => {}}
				/>
				{(deployCatalogData == null) && <FormHelperText color="error">This deployment data is not recognized as valid ini nor json dataset.</FormHelperText>}
			</FormControl>
			}
			<FormControl className={classes.formcontrol} fullWidth>
				<NamespaceSelector
					id="namespace"
					role="admin"
					placeholder="test"
					onChange={($) => dispatch({"type": "setDeployCatalogNamespace", "value": $})}
					selected={deployCatalogNamespace}
				/>
			</FormControl>
			{!hasPathKey() &&
                        <FormControl className={classes.formcontrol} fullWidth>
                                <TextField
                                        fullWidth
                                        error={!nameValid(deployCatalogName)}
                                        id="name"
                                        label="Name"
                                        onChange={handleNameChange}
                                        autoComplete="off"
                                        helperText={!nameValid(name) && "Must start with an aplha and continue with aplhanum, dot, underscore or hyphen."}
                                />
                        </FormControl>
			}
			{env}
			<Button color="secondary" disabled={submitDisabled()} onClick={handleSubmit}>Submit</Button>
		</div>
	)
}

export {
	DeployCatalog
}
