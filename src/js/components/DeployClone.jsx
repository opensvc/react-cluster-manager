import React, { useState } from "react";
import { useStateValue } from '../state.js';
import { nameValid } from "../utils.js";
import { NamespaceSelector } from "./NamespaceSelector.jsx"

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
	const {data, set} = props
	const classes = useStyles()

	return (
		<div>
			<Typography className={classes.desc} component="p" color="textSecondary">
				Deploy a service as a clone of another existing service. Beware if you have root privileges, cloning a service with fs or disk resources that were not designed for cloning might cause conflicts, source data corruption, end-user service disruption.
			</Typography>
			<FormControl className={classes.formcontrol} fullWidth>
				<TextField
					id="srcpath"
					label="Source Objects Selector"
					onChange={(e) => set({...data, src: e.target.value})}
					autoComplete="off"
				/>
			</FormControl>
			<FormControl className={classes.formcontrol} fullWidth>
				<NamespaceSelector
					id="namespace"
					role="admin"
					placeholder="Namespace"
					onChange={($) => set({...data, namespace: $})}
					selected={data.namespace}
				/>
			</FormControl>
			<FormControl className={classes.formcontrol} fullWidth>
				<TextField
					id="name"
					label="Name"
					onChange={(e) => set({...data, name: e.target.value})}
					error={!nameValid(data.name)}
					autoComplete="off"
					helperText="Must start with an aplha and continue with aplhanum, dot, underscore or hyphen."
				/>
			</FormControl>
		</div>
	)
}


export {
	DeployClone
}
