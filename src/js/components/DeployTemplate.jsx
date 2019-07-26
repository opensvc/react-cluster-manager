import React, { useState } from "react";
import { useStateValue } from '../state.js';
import { apiPostAny, apiObjGetConfig, apiObjCreate } from "../api.js";
import { nameValid, namespaceValid, parseIni } from "../utils.js";
import { NamespaceSelector } from './NamespaceSelector.jsx'

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

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

function DeployTemplate(props) {
	const classes = useStyles()
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
				"namespace": deployTemplateNamespace,
				"data": deployTemplateData
			}
			var nObj = Object.keys(data).length
			if (nObj > 1) {
				var ok = "Objects " + Object.keys(data) + " deployed."
			} else {
				var ok = "Object " + Object.keys(data) + " deployed."
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

	return (
		<div>
			<Typography className={classes.desc} component="p" color="textSecondary">
				Deploy a service from a configuration, pasted or loaded from an <code>uri</code>.
			</Typography>
			<FormControl className={classes.formcontrol} fullWidth>
				<div style={{display: "inline-flex", alignItems: "flex-end"}}>
					<TextField
						type=""
						id="uri"
						label="Deployment Data URI"
						onChange={handleUriChange}
						value={deployTemplateUri}
						style={{flexGrow: "1"}}
					/>
					<Button
						onClick={handleLoad}
						color="primary"
						style={{maxWidth: "6em", alignSelf: "bottom"}}
					>
						Load
					</Button>
				</div>
			</FormControl>
			<FormControl className={classes.formcontrol} fullWidth>
                                <Typography variant="caption" color="textSecondary">Definition</Typography>
                                <TextareaAutosize
                                        className={classes.textarea}
                                        rowsMax={20}
                                        id="data"
					onChange={handleTextChange}
                                        value={deployTemplateText}
                                />
                                {(deployTemplateData == null) && <FormHelperText color="error">This deployment data is not recognized as valid ini nor json dataset.</FormHelperText>}
			</FormControl>
			<FormControl className={classes.formcontrol} fullWidth>
				<NamespaceSelector
					id="namespace"
					role="admin"
					placeholder="test"
					selected={deployTemplateNamespace}
					onChange={($) => dispatch({"type": "setDeployTemplateNamespace", "value": $})}
				/>
			</FormControl>
			{!hasPathKey() &&
			<FormControl className={classes.formcontrol} fullWidth>
				<TextField
					id="name"
					label="Name"
					error={!nameValid(deployTemplateName)}
					onChange={handleNameChange}
					value={deployTemplateName}
					autoComplete="off"
					helperText="Must start with an aplha and continue with aplhanum, dot, underscore or hyphen."
				/>
			</FormControl>
			}
			<Button color="primary" disabled={submitDisabled()} onClick={handleSubmit}>Submit</Button>
		</div>
	)
}

export {
	DeployTemplate
}
