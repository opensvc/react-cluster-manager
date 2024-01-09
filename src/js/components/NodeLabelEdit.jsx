import React, { useState } from "react"
import useUser from "../hooks/User.jsx"
import { useTranslation } from 'react-i18next'

import { apiNodeAction } from "../api.js"
import { useKeywords } from "../hooks/Keywords.jsx"
import { SectionForm } from "./SectionForm.jsx"
import { useStateValue } from '../state.js'
import useApiResponse from "../hooks/ApiResponse.jsx"

import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'

import EditIcon from '@mui/icons-material/Edit'
import useClasses from "../hooks/useClasses.jsx";

const styles = theme => ({
	formcontrol: {
		margin: theme.spacing(2, 0),
	},
});

function NodeLabelEdit(props) {
	const {node, labelKey, labelCurrent} = props
	const { auth } = useUser()
	const [open, setOpen] = React.useState(false)
	const [val, setVal] = useState(props.val ? props.val : "")
	const [{user}, dispatch] = useStateValue()
	const { dispatchAlerts } = useApiResponse()
	const { t, i18n } = useTranslation()
	const classes = useClasses(styles)
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
		if (!props.labelKey || !val) {
			return
		}
		var _kw = "labels."+props.labelKey+"="+val
		kw.push(_kw)
		apiNodeAction(node, "set", {kw: kw}, (data) => dispatchAlerts({data: data}), auth)
		handleClose(e)
	}
	return (
		<React.Fragment>
			<IconButton
				aria-label="Change Node Label"
				aria-haspopup={true}
				onClick={handleClickOpen}
			>
				<EditIcon />
			</IconButton>
			<Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
				<DialogTitle id="form-dialog-title">{t("Change Node Label")}</DialogTitle>
				<DialogContent>
					<DialogContentText>
						{t("add_node_label")}
					</DialogContentText>
					<FormControl className={classes.formcontrol} fullWidth>
						<TextField
							label={t("New value")}
							id="val"
							placeholder={props.labelCurrent}
							value={val}
							onChange={e => setVal(e.target.value)}
							autoFocus
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

export default NodeLabelEdit
