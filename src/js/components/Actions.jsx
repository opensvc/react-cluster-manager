import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { useStateValue } from "../state.js"
import IconButton from "@mui/material/IconButton"
import Button from "@mui/material/Button"
import Divider from "@mui/material/Divider"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import Dialog from "@mui/material/Dialog"
import FormControlLabel from "@mui/material/FormControlLabel"
import Checkbox from "@mui/material/Checkbox"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import ListItemIcon from "@mui/material/ListItemIcon"
import FormControl from "@mui/material/FormControl"
import FormGroup from "@mui/material/FormGroup"
import Fab from "@mui/material/Fab"
import PlayArrowIcon from "@mui/icons-material/PlayArrow"
import Tooltip from "@mui/material/Tooltip"
import useClasses from "../hooks/useClasses.jsx";

const styles = theme => ({
	root: {
		width: '100%',
		maxWidth: 360,
		backgroundColor: theme.palette.background.paper,
	},
	paper: {
		width: '80%',
		maxHeight: 435,
	},
        fab: {
                marginTop: theme.spacing(2),
        },
});

function ActionsDivider(props) {
	if (props.data.action) {
		return null
	}
	return (
		<Divider />
	)
}

function ConfirmationDialog(props) {
	const classes = useClasses(styles)
	const [data, setData] = useState({
		action: null,
		acks: [],
		confirmations: [],
	})

	function submitDisabled() {
		if (!data.action) {
			return true
		}
		if (!data.confirmations) {
			return false
		} else if (!data.confirmations.length) {
			return false
		} else if (data.confirmations.length == data.acks.length) {
			return false
		} else {
			return true
		}
	}

	const handleAck = m => (e) => {
		if (e.target.checked && data.acks.indexOf(m) < 0) {
			var newAcks = [m].concat(data.acks)
			setData({...data, acks: newAcks})
		} else if (!e.target.checked && data.acks.indexOf(m) > -1) {
			var newAcks = [].concat(data.acks)
			newAcks.splice(data.acks.indexOf(m), 1)
			setData({...data, acks: newAcks})
		}
	}
	function handleCancel(e, m) {
		props.handleClose()
		setData({...data, acks: [], confirmations: [], action: null})
	}
	function handleOk(e, m) {
		props.submit({value: data.action})
		props.handleClose()
		setData({...data, acks: [], confirmations: [], action: null})
	}
	function handleEntering(e) {
	}

	return (
		<Dialog
			disableBackdropClick
			maxWidth="xs"
			onEntering={handleEntering}
			onClose={handleCancel}
			aria-labelledby="confirmation-dialog-title"
			open={props.open}
		>
			<DialogTitle id="confirmation-dialog-title">Action</DialogTitle>
			<DialogContent dividers>
				<List>
					{React.Children.toArray(props.children).map(child => (
						React.cloneElement(child, {data: data, setData: setData})
					))}
				</List>
				{(data.confirmations && data.confirmations.length > 0) &&
				<FormControl component="fieldset" className={classes.formControl}>
					{data.confirmations.map((m, i) => (
						<FormGroup key={i}>
							<FormControlLabel
								control={<Checkbox checked={data.acks.indexOf(m) > -1} onChange={handleAck(m)} value={m} />}
								label={m}
							/>
						</FormGroup>
					))}
				</FormControl>
				}
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCancel} color="primary">
					Cancel
				</Button>
				<Button onClick={handleOk} disabled={submitDisabled()} color="secondary">
					Ok
				</Button>
			</DialogActions>
		</Dialog>
	)
}

function Actions(props) {
	const [open, setOpen] = React.useState(false)
	const classes = useClasses(styles)
	const { t } = useTranslation()

	function handleClickOpen(e) {
		e.stopPropagation()
		setOpen(true)
	}
	function handleClose(e) {
		setOpen(false)
	}
	if (props.title) {
		var button = (
			<Button
				color="primary"
				aria-label="More"
				aria-haspopup="true"
				onClick={handleClickOpen}
			>
				{props.title}
			</Button>
		)
	} else if (props.fab) {
		var button = (
			<Fab
				color="primary"
				onClick={handleClickOpen}
				className={classes.fab}
			>
				<PlayArrowIcon />
			</Fab>
		)
	} else {
		var button = (
			<IconButton
				aria-label="More"
				aria-haspopup="true"
				onClick={handleClickOpen}
			>
				<PlayArrowIcon />
			</IconButton>
		)
	}

	return (
		<React.Fragment>
			<Tooltip title={t("Actions")}>
				{button}
			</Tooltip>
			<ConfirmationDialog
				submit={props.submit}
				path={props.path}
				selected={props.selected}
				node={props.node}
				handleClose={handleClose}
				open={open}
				children={props.children}
			/>
		</React.Fragment>
	)
}

function ActionsSection(props) {
        return (
		<div>
			{React.Children.toArray(props.children).map(child => (
				React.cloneElement(child, {data: props.data, setData: props.setData})
			))}
		</div>
        )
}

function ActionsItem(props) {
	const [{user}, dispatch] = useStateValue()
	if (props.data.action && (props.value != props.data.action)) {
		return null
	}
	function handleClick(e) {
		props.setData({...props.data, action: props.value, confirmations: props.confirmations})
	}
	function intersectionLength(a1, a2) {
		a1.filter(value => a2.includes(value))
		return a1.length
	}
	function disabled() {
		if (props.disabled) {
			return true
		}
		if (props.data.action) {
			return true
		}
		if (props.requires === undefined) {
			return false
		}
		if (user.grant === undefined) {
			// not initialized yet
			return true
		}
		if ("root" in user.grant) {
			return false
		}
		if (props.requires.role && !(props.requires.role in user.grant)) {
			//console.log("item", props.value, "disabled: user must have the", props.requires.role, "role")
			return true
		}
		if (props.requires.namespace == "") {
			props.requires.namespace = "root"
		}
		if (props.requires.namespace && !intersectionLength(user.grant[props.requires.role], props.requires.namespace)) {
			//console.log("item", props.value, "disabled: user is not", props.requires.role, "on namespace", props.requires.namespace)
			return true
		}
		return false
	}
	return (
		<ListItem button disabled={disabled()} onClick={handleClick}>
			<ListItemIcon>{props.icon}</ListItemIcon>
			<ListItemText primary={props.text} />
		</ListItem>
	)
}

export {
	Actions,
	ActionsSection,
	ActionsItem,
	ActionsDivider
}
