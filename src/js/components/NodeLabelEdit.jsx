import React, { useState } from "react"
import { useReactOidc } from '@axa-fr/react-oidc-context'
import { useTranslation } from 'react-i18next'

import { apiNodeAction } from "../api.js"
import { useKeywords } from "../hooks/Keywords.jsx"
import { SectionForm } from "./SectionForm.jsx"
import { useStateValue } from '../state.js'

import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'

import EditIcon from '@material-ui/icons/Edit'

const useStyles = makeStyles(theme => ({
	formcontrol: {
		margin: theme.spacing(2, 0),
	},
}))

function NodeLabelEdit(props) {
	const {node, labelKey, labelCurrent} = props
	const { oidcUser } = useReactOidc()
	const [open, setOpen] = React.useState(false)
	const [val, setVal] = useState(props.val ? props.val : "")
	const [{user}, dispatch] = useStateValue()
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
		if (!props.labelKey || !val) {
			return
		}
		var _kw = "labels."+props.labelKey+"="+val
		kw.push(_kw)
		apiNodeAction(node, "set", {kw: kw}, (data) => dispatch({type: "parseApiResponse", data: data}), oidcUser)
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
