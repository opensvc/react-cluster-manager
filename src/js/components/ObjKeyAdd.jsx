import React, { useState } from "react";

import { apiPostAny } from "../api.js"

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Fab from '@material-ui/core/Fab';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles(theme => ({
	formcontrol: {
		margin: theme.spacing(2, 0),
	},
}))

function ObjKeyAdd(props) {
	const {path} = props
	const [open, setOpen] = React.useState(false)
	const source = {
		"INPUT": "User Input",
		"LOCAL": "Local File",
		"REMOTE": "Remote Location",
	}
	const [active, setActive] = useState(source.INPUT)
	const [inputValue, setInputValue] = useState("")
	const [urlValue, setUrlValue] = useState("")
	const [fileValue, setFileValue] = useState("")
	const [keyName, setKeyName] = useState("")
	const classes = useStyles()
        function handleClickOpen(e) {
                e.stopPropagation()
                setOpen(true)
        }
        function handleClose(e) {
                setOpen(false)
        }
	function handleSourceChange(e) {
		setActive(e.target.value)
	}
	function handleSubmit(e) {
		if (active == source.INPUT) {
			apiPostAny("/set_key", {path: path, key: keyName, data: inputValue}, (data) => {
				// reload config custom hook
				console.log(data)
			})
		}
		handleClose(e)
	}
	return (
		<React.Fragment>
			<Fab
				color="primary"
				onClick={handleClickOpen}
			>
				<AddIcon />
			</Fab>
			<Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
				<DialogTitle id="form-dialog-title">Add Key</DialogTitle>
				<DialogContent>
					<DialogContentText>
						The key name can be a path expression. When using the key in 
						a volume projection, the key name is the path of the file
						relative to the volume root, and the content is the key value.
					</DialogContentText>
					<FormControl className={classes.formcontrol} fullWidth>
						<TextField
							label="Key Name"
							id="name"
							value={keyName}
							onChange={(e) => setKeyName(e.target.value)}
						/>
					</FormControl>
					<FormControl className={classes.formcontrol} fullWidth>
						<Typography variant="caption" color="textSecondary">Value Source</Typography>
						<Select
							value={active}
							onChange={handleSourceChange}
							inputProps={{
								name: 'source',
								id: 'source',
							}}
						>
							<MenuItem value={source.INPUT}>{source.INPUT}</MenuItem>
							<MenuItem value={source.LOCAL}>{source.LOCAL}</MenuItem>
							<MenuItem value={source.REMOTE}>{source.REMOTE}</MenuItem>
						</Select>
					</FormControl>
					{(active==source.INPUT) &&
					<FormControl className={classes.formcontrol} fullWidth>
						<TextField
							label="Key Value"
							id="name"
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
						/>
					</FormControl>
					}
					{(active==source.REMOTE) &&
					<FormControl className={classes.formcontrol} fullWidth>
						<TextField
							label="Remote Location"
							id="url"
							type="url"
							value={urlValue}
							onChange={(e) => setUrlValue(e.target.value)}
						/>
					</FormControl>
					}
					{(active==source.LOCAL) &&
					<FormControl className={classes.formcontrol} fullWidth>
						<TextField
							label="File"
							id="file"
							type="file"
							label={fileValue}
							onChange={(e) => setFileValue(e.target.uploadFile)}
						/>
					</FormControl>
					}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Cancel
					</Button>
					<Button onClick={handleSubmit} color="secondary">
						Submit
					</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment>
	)
}

export {
	ObjKeyAdd,
}
