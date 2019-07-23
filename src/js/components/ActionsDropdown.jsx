import React, { useState } from "react";
import { useStateValue } from '../state.js';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import LinearProgress from '@material-ui/core/LinearProgress';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';

const MenuContext = React.createContext({section: {}})

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%',
		maxWidth: 360,
		backgroundColor: theme.palette.background.paper,
	},
	paper: {
		width: '80%',
		maxHeight: 435,
	},
}))

function ActionsDropdownDivider(props) {
	return (
		<Divider />
	)
}

const msg = {
	SVCINT: "I understand the service will be interrupted.",
	CFGDEL: "I understand the configuration will be lost.",
	PURGE: "I understand the service data will be lost.",
	FREEZE: "I understand the service orchestration will be paused.",
	MOVE: "I understand the service will be unavailable during move.",
	ORCHESTRATED: "I understand this action will be orchestrated clusterwide.",
}

const actionConfirmations = {
	"stop": [msg.SVCINT, msg.FREEZE],
	"stopped": [msg.SVCINT, msg.FREEZE, msg.ORCHESTRATED],
	"delete": [msg.SVCINT, msg.CFGDEL],
	"deleted": [msg.SVCINT, msg.CFGDEL, msg.ORCHESTRATED],
	"purge": [msg.SVCINT, msg.CFGDEL, msg.PURGE],
	"purged": [msg.SVCINT, msg.CFGDEL, msg.PURGE, msg.ORCHESTRATED],
	"freeze": [msg.FREEZE],
	"frozen": [msg.FREEZE, msg.ORCHESTRATED],
	"giveback": [msg.MOVE],
	"placed": [msg.MOVE, msg.ORCHESTRATED],
	"switch": [msg.MOVE],
	"placed@<peer>": [msg.MOVE, msg.ORCHESTRATED],
}

function ConfirmationDialog(props) {
	const classes = useStyles()
	const [action, setAction] = useState()
	const [acks, setAcks] = useState([])
	var confirmations = actionConfirmations[action]
	if (confirmations === undefined) {
		confirmations = []
	}
	if (!confirmations.length) {
		var submitDisabled = false
	} else if (confirmations.length == acks.length) {
		var submitDisabled = false
	} else {
		var submitDisabled = true
	}

	const handleAck = m => (e) => {
		console.log("handleAck", e.target, m)
		if (e.target.checked && acks.indexOf(m) < 0) {
			var newAcks = [m].concat(acks)
			setAcks(newAcks)
		} else if (!e.target.checked && acks.indexOf(m) > -1) {
			var newAcks = [].concat(acks)
			delete newAcks[m]
			setAcks(newAcks)
		}
	}
	function handleCancel(e, m) {
		console.log("handleCancel", e)
		props.handleClose()
	}
	function handleOk(e, m) {
		console.log("handleOk", e)
		props.submit({value: action})
		props.handleClose()
	}
	function handleEntering(e) {
		console.log(e)
	}

	return (
		<Dialog
			disableBackdropClick
			disableEscapeKeyDown
			maxWidth="xs"
			onEntering={handleEntering}
			aria-labelledby="confirmation-dialog-title"
			open={props.open}
		>
			<DialogTitle id="confirmation-dialog-title">Action {action}</DialogTitle>
			<DialogContent dividers>
				{!action &&
				<MenuContext.Provider value={{menu: props, setAction: setAction}}>
					<List>
						{props.children}
					</List>
				</MenuContext.Provider>
				}
				{confirmations.length &&
				<FormControl component="fieldset" className={classes.formControl}>
					{confirmations.map((m) => (
						<FormGroup>
							<FormControlLabel
								control={<Checkbox checked={acks.indexOf(m) > -1} onChange={handleAck(m)} value={m} />}
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
				<Button onClick={handleOk} disabled={submitDisabled} color="secondary">
					Ok
				</Button>
			</DialogActions>
		</Dialog>
	)
}

function ActionsDropdown(props) {
	if (!props.selected && !props.path && !props.node) {
		return null
	}
	const [open, setOpen] = React.useState(false)

	function handleClickOpen() {
		setOpen(true)
	}
	function handleClose() {
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
	} else {
		var button = (
			<IconButton
				aria-label="More"
				aria-haspopup="true"
				onClick={handleClickOpen}
			>
				<MoreVertIcon />
			</IconButton>
		)
	}

	return (
		<React.Fragment>
			{button}
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

function ActionsDropdownSection(props) {
        return (
		<MenuContext.Consumer>
			{({ menu, setAction }) => (
				<MenuContext.Provider value={{section: props, menu: menu, setAction: setAction}}>
					<div>
						{props.children}
					</div>
				</MenuContext.Provider>
			)}
		</MenuContext.Consumer>
        )
}

function ActionsDropdownItemWrapped(props) {
	const [{user}, dispatch] = useStateValue()
	function handleClick(e) {
		props.setAction(props.value)
	}
	function intersectionLength(a1, a2) {
		a1.filter(value => a2.includes(value))
		return a1.length
	}
	function disabled() {
		if (props.disabled) {
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
		if (props.requires.namespace && !intersectionLength(user.grant[props.requires.role], props.requires.namespace)) {
			//console.log("item", props.value, "disabled: user is not", props.requires.role, "on namespace", props.requires.namespace)
			return true
		}
		return false
	}
	return (
		<ListItem disabled={disabled()} onClick={handleClick}>{props.text}</ListItem>
	)
}

function ActionsDropdownItem(props) {
	return (
		<MenuContext.Consumer>
			{({ menu, section, setAction }) => (
				<ActionsDropdownItemWrapped
					value={props.value}
					text={props.text}
					disabled={props.disabled}
					requires={props.requires}
					setAction={setAction}
					menu={menu}
					section={section}
				/>
			)}
		</MenuContext.Consumer>
	)
}

export {
	ActionsDropdown,
	ActionsDropdownSection,
	ActionsDropdownItem,
	ActionsDropdownDivider
}
