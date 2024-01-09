import React, { useState } from "react";
import { nameValid } from "../utils.js";
import { ObjKindSelector } from './ObjKindSelector.jsx';
import { NamespaceSelector } from './NamespaceSelector.jsx';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import TextField from '@mui/material/TextField';
import useClasses from "../hooks/useClasses.jsx";

const styles = theme => ({
	desc: {
		padding: theme.spacing(3, 0),
	},
        formcontrol: {
                margin: theme.spacing(2, 0),
        },
})

function DeployEmpty(props) {
	const {data, set} = props
	const classes = useClasses(styles)

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
