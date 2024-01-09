import React, { useState } from "react";
import { nameValid, namespaceValid, createDataHasPathKey, parseIni } from "../utils.js";
import { NamespaceSelector } from './NamespaceSelector.jsx'

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import TextField from '@mui/material/TextField';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import useClasses from "../hooks/useClasses.jsx";

const styles = theme => ({
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
})

function DeployTemplate(props) {
	const {data, set} = props
	const classes = useClasses(styles)

	function handleUriChange(e) {
		set({...data, uri: e.target.value})
	}
	function handleTextChange(e) {
		set({...data, text: e.target.value, data: toData(e.target.value)})
	}
	function handleNameChange(e) {
		set({...data, name: e.target.value})
	}
	function handleLoad(e) {
		fetch(data.uri)
			.then(res => res.text())
			.then(buff => {
				set({...data, text: buff, data: toData(buff)})
			})
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
		if (!createDataHasPathKey(data.data)) {
			if (!nameValid(data.name)) {
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
						value={data.uri}
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
                                        value={data.text}
                                />
                                {(data.data == null) && <FormHelperText color="error">This deployment data is not recognized as valid ini nor json dataset.</FormHelperText>}
			</FormControl>
			<FormControl className={classes.formcontrol} fullWidth>
				<NamespaceSelector
					id="namespace"
					role="admin"
					placeholder="test"
					selected={data.namespace}
					onChange={($) => set({...data, namespace: $})}
				/>
			</FormControl>
			{!createDataHasPathKey() &&
			<FormControl className={classes.formcontrol} fullWidth>
				<TextField
					id="name"
					label="Name"
					error={!nameValid(data.name)}
					onChange={handleNameChange}
					value={data.name}
					autoComplete="off"
					helperText="Must start with an aplha and continue with aplhanum, dot, underscore or hyphen."
				/>
			</FormControl>
			}
		</div>
	)
}

export {
	DeployTemplate
}
