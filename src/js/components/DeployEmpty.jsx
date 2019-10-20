import React, { useState } from "react";
import { nameValid } from "../utils.js";
import { ObjKindSelector } from './ObjKindSelector.jsx';
import { NamespaceSelector } from './NamespaceSelector.jsx';

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
	const {data, set} = props
	const classes = useStyles()

	function handleObjKindClick(e, kind) {
		set({...data, kind: kind})
	}
	return (
		<div>
			<Typography className={classes.desc} component="p" color="textSecondary">
				Deploy an empty object to a single node, to configure later.
			</Typography>
			<FormControl className={classes.formcontrol} fullWidth>
				<NamespaceSelector
					id="namespace"
					role="admin"
					placeholder="test"
					onChange={($) => set({...data, namespace: $})}
					selected={data.namespace}
				/>
			</FormControl>
			{!data.kindForced &&
			<FormControl className={classes.formcontrol} fullWidth>
				<ObjKindSelector id="kind" value={data.kind} onChange={handleObjKindClick} />
			</FormControl>
			}
			<FormControl className={classes.formcontrol} fullWidth>
				<TextField
					fullWidth
					error={!nameValid(data.name)}
					id="name"
					label="Name"
					onChange={(e) => set({...data, name: e.target.value})}
					autoComplete="off"
					helperText={!nameValid(data.name) && "Must start with an aplha and continue with aplhanum, dot, underscore or hyphen."}
				/>
			</FormControl>
		</div>
	)
}

export {
	DeployEmpty
}
