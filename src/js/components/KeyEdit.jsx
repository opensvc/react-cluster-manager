import React, { useState, useEffect } from "react"
import { apiPostAny } from "../api.js"

import useApiResponse from "../hooks/ApiResponse.jsx"
import useUser from "../hooks/User.jsx"
import {useKey} from "../hooks/KeyGet.jsx"

import { makeStyles } from "@material-ui/core/styles"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import TextareaAutosize from "@material-ui/core/TextareaAutosize"

const useStyles = makeStyles(theme => ({
	textarea: {
		fontFamily: "monospace",
		width: "100%",
		whiteSpace: "nowrap",
		overflow: "auto !important",
	},
}))

function KeyData(props) {
	const {value, setValue} = props
	const classes = useStyles()

	function handleTextChange(e) {
		setValue(e.target.value)
		console.log(e)
	}
	return (
		<TextareaAutosize
			className={classes.textarea}
			rowsMax={30}
			rowsMin={15}
			id="data"
			onChange={handleTextChange}
			value={value}
		/>
	)
}

function KeyEdit(props) {
	const {path, keyName} = props
	const { auth } = useUser()
	const [open, setOpen] = useState(false)
	const [value, setValue] = useKey({path: path, keyName: keyName})
	const { dispatchAlerts } = useApiResponse()
        function handleOpen(e) {
                e.stopPropagation()
                setOpen(true)
        }
        function handleClose(e) {
                setOpen(false)
        }
        function handleSave(e) {
		apiPostAny("/key", {path: path, key: keyName, data: value}, (data) => {
			console.log(data)
			dispatchAlerts({data: data})
		}, auth)
                //setOpen(false)
        }
	return (
		<React.Fragment>
			<Button onClick={handleOpen} color="secondary">
				Edit
			</Button>
                        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth="md" fullWidth={true}>
                                <DialogTitle id="form-dialog-title">{keyName}</DialogTitle>
                                <DialogContent>
					<KeyData value={value} setValue={setValue} />
                                </DialogContent>
                                <DialogActions>
                                        <Button onClick={handleClose} color="primary">
                                                Dismiss
                                        </Button>
                                        <Button onClick={handleSave} color="secondary">
                                                Save
                                        </Button>
                                </DialogActions>
                        </Dialog>
		</React.Fragment>
	)
}

export {
	KeyEdit,
}
