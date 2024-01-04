import React, { useState } from "react"
import useUser from "../hooks/User.jsx"
import { useTranslation } from 'react-i18next'
import { useStateValue } from "../state.js"
import { apiNodeAction } from "../api.js"
import useApiResponse from "../hooks/ApiResponse.jsx"

import { makeStyles } from '@mui/styles'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'

import AddIcon from '@mui/icons-material/Add'

const useStyles = makeStyles(theme => ({
	formcontrol: {
		margin: theme.spacing(2, 0),
	},
}))

function NodeLabelAdd(props) {
	const {node} = props
	const { auth } = useUser()
	const [open, setOpen] = useState(false)
	const [key, setKey] = useState(props.key ? props.key : "")
	const [val, setVal] = useState(props.val ? props.val : "")
	const [{user}, dispatch] = useStateValue()
	const { dispatchAlerts } = useApiResponse()
	const { t, i18n } = useTranslation()
	const classes = useStyles()
	if (!user.grant) {
		return null
	}
	if (!("root" in user.grant)) {
		return null
	}
	function handleClickOpen(e) {
		e.stopPropagation()
		setOpen(true)
	}
	function handleClose(e) {
		setOpen(false)
	}
	function handleSubmit(e) {
		var kw = []
		if (!key || !val) {
			return
		}
		var _kw = "labels."+key+"="+val
		kw.push(_kw)
		apiNodeAction(node, "set", {kw: kw}, (data) => dispatch({data: data}), auth)
		setKey("")
		setVal("")
		handleClose(e)
	}
	return (
		<React.Fragment>
			<IconButton
				aria-label="Add Node Label"
				aria-haspopup={true}
				onClick={handleClickOpen}
			>
				<AddIcon />
			</IconButton>
			<Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
				<DialogTitle id="form-dialog-title">{t("Add Node Label")}</DialogTitle>
				<DialogContent>
					<DialogContentText>
						{t("add_node_label")}
					</DialogContentText>
					<FormControl className={classes.formcontrol} fullWidth>
						<TextField
							label={t("Key")}
							id="key"
							value={key}
							onChange={e => setKey(e.target.value)}
							autoFocus
						/>
					</FormControl>
					<FormControl className={classes.formcontrol} fullWidth>
						<TextField
							label={t("Value")}
							id="val"
							value={val}
							onChange={e => setVal(e.target.value)}
						/>
					</FormControl>
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

export default NodeLabelAdd
