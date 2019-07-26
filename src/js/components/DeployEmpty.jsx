import React, { useState } from "react";
import { useStateValue } from '../state.js';
import { apiObjCreate } from "../api.js";
import { nameValid } from "../utils.js";
import { ObjKindSelector } from './ObjKindSelector.jsx';
import { NamespaceSelector } from './NamespaceSelector.jsx';

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

function DeployEmpty(props) {
	const classes = useStyles()
	const [{}, dispatch] = useStateValue();
	const [kind, setKind] = useState("svc");
	const [namespace, setNamespace] = useState();
	const [name, setName] = useState();
	function createEmpty(e) {
		var path = [namespace, kind, name].join("/")
		var data = {
			namespace: namespace[0],
			provision: false,
			restore: true,
			data: {}
		}
		data.data[path] = {}
		apiObjCreate(data, (data) => dispatch({
			type: "parseApiResponse",
			ok: "Object " + path + " created",
			data: data
		}))
	}
	function handleObjKindClick(e, kind) {
		setKind(kind)
	}
	return (
		<div>
			<Typography className={classes.desc} component="p" color="textSecondary">
				Deploy an empty service to a single node, to configure later.
			</Typography>
			<FormControl className={classes.formcontrol} fullWidth>
				<NamespaceSelector
					id="namespace"
					role="admin"
					placeholder="test"
					onChange={($) => setNamespace($)}
					selected={namespace}
				/>
			</FormControl>
			<FormControl className={classes.formcontrol} fullWidth>
				<ObjKindSelector id="kind" value={kind} onChange={handleObjKindClick} />
			</FormControl>
			<FormControl className={classes.formcontrol} fullWidth>
				<TextField
					fullWidth
					error={!nameValid(name)}
					id="name"
					label="Name"
					onChange={(e) => setName(e.target.value)}
					autoComplete="off"
					helperText={!nameValid(name) && "Must start with an aplha and continue with aplhanum, dot, underscore or hyphen."}
				/>
			</FormControl>
			<Button color="secondary" onClick={createEmpty}>Submit</Button>
		</div>
	)
}

export {
	DeployEmpty
}
