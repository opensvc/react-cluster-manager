import React, { useState } from "react";

import useUser from "../hooks/User.jsx"
import { apiPostAny } from "../api.js"
import { splitPath } from "../utils.js"

import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import IconButton from '@material-ui/core/IconButton'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextareaAutosize from '@material-ui/core/TextareaAutosize'

import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles(theme => ({
	formcontrol: {
		margin: theme.spacing(2, 0),
	},
	textarea: {
		fontFamily: "monospace",
		width: "100%",
                whiteSpace: "nowrap",
                overflow: "auto !important",
	},
}))

function ObjKeyAdd(props) {
	const {path} = props
	const sp = splitPath(path)
	if (["cfg", "sec", "usr"].indexOf(sp.kind) < 0) {
		return null
	}
	const { auth } = useUser()
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
	function handleLoadFile(e) {
		if (active == source.LOCAL) {
			console.log("fileValue", fileValue)
			let file =  new File(fileValue, "foo", {
				type: "text/plain",
			})
			let reader = new FileReader()
			reader.onload = () => {
				setInputValue(reader.result)
				setActive(source.INPUT)
			}
			reader.readAsText(file)
		} else {
			setActive(source.LOCAL)
		}
	}
	function handleLoadURL(e) {
		if (active == source.REMOTE) {
			fetch(urlValue)
				.then(res => res.text())
				.then(buff => {
					setInputValue(buff)
					setActive(source.INPUT)
				})
		} else {
			setActive(source.REMOTE)
		}
	}
	function handleSubmit(e) {
		apiPostAny("/key", {path: path, key: keyName, data: inputValue}, (data) => {
			// reload config custom hook
			console.log(data)
		}, auth)
		handleClose(e)
	}
	return (
		<React.Fragment>
			<IconButton
				aria-label="Add Key"
				aria-haspopup={true}
				onClick={handleClickOpen}
			>
				<AddIcon />
			</IconButton>
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
						<Typography variant="caption" color="textSecondary">Key Value</Typography>
						<TextareaAutosize
							className={classes.textarea}
							rowsMax={25}
							id="value"
							onChange={(e) => setInputValue(e.target.value)}
							value={inputValue}
						/>
					</FormControl>
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
							onChange={(e) => setFileValue(e.target.files)}
						/>
					</FormControl>
					}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleLoadURL} color={(active == source.REMOTE) ? "secondary" : "primary"}>
						Load URL
					</Button>
					<Button onClick={handleLoadFile} color={(active == source.LOCAL) ? "secondary" : "primary"}>
						Load File
					</Button>
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
