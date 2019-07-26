import React, { useState } from "react";
import { useStateValue } from '../state.js';
import { apiPostAny, apiObjGetConfig, apiObjCreate } from "../api.js";
import { nameValid } from "../utils.js";
import { NamespaceSelector } from "./NamespaceSelector.jsx"

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
        desc: {
                padding: theme.spacing(3, 0),
        },
        formcontrol: {
                margin: theme.spacing(2, 0),
        },
}))

function DeployClone(props) {
	const [{}, dispatch] = useStateValue()
	const [srcPath, setSrcPath] = useState()
	const [namespace, setNamespace] = useState()
	const [name, setName] = useState()
	const classes = useStyles()

	function createClone(e) {
		var path = [namespace, "svc", name].join("/")
		var data = {
			namespace: namespace,
			provision: true,
			restore: false,
			data: {}
		}
		apiObjGetConfig({path: srcPath, format: "json"}, (cdata) => {
			if ("metadata" in cdata) {
				delete cdata["metadata"]
			}
			data.data[path] = cdata
			apiObjCreate(data, (data) => dispatch({
				type: "parseApiResponse",
				ok: "Object " + path + " cloned",
				data: data
			}))
		})
	}
	return (
		<div>
			<Typography className={classes.desc} component="p" color="textSecondary">
				Deploy a service as a clone of another existing service. Beware if you have root privileges, cloning a service with fs or disk resources that were not designed for cloning might cause conflicts, source data corruption, end-user service disruption.
			</Typography>
			<FormControl className={classes.formcontrol} fullWidth>
				<TextField
					id="srcpath"
					label="Source Objects Selector"
					onChange={(e) => setSrcPath(e.target.value)}
					autoComplete="off"
				/>
			</FormControl>
			<FormControl className={classes.formcontrol} fullWidth>
				<NamespaceSelector
					id="namespace"
					role="admin"
					placeholder="Namespace"
					onChange={($) => setNamespace($)}
					selected={namespace}
				/>
			</FormControl>
			<FormControl className={classes.formcontrol} fullWidth>
				<TextField
					id="name"
					label="Name"
					onChange={(e) => setName(e.target.value)}
					error={!nameValid(name)}
					autoComplete="off"
					helperText="Must start with an aplha and continue with aplhanum, dot, underscore or hyphen."
				/>
			</FormControl>
			<Button color="primary" onClick={createClone}>Submit</Button>
		</div>
	)
}


export {
	DeployClone
}
