import React from "react";
import { useStateValue } from '../state.js';

import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import NotificationsIcon from '@material-ui/icons/Notifications';
import DeleteIcon from '@material-ui/icons/Delete';
import Badge from '@material-ui/core/Badge';

const useStyles = makeStyles({
	list: {
		width: 250,
	},
	fullList: {
		width: 'auto',
	},
})

function Alerts(props) {
	const [{ alerts }, dispatch] = useStateValue();
	const [state, setState] = React.useState(false)
	const classes = useStyles();
	if (!alerts) {
		return null
	}

	var color = "primary"
	for (var a of alerts) {
		if ((a.color == "secondary") && (color == "primary")) {
			color = "secondary"
			break
		}
	}

	const toggleDrawer = (open) => event => {
		if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
			return
		}
		setState(open)
	}

	return (
		<React.Fragment>
			<IconButton color="inherit" onClick={toggleDrawer(true)}>
				<Badge max={9} badgeContent={alerts.length} color={color}>
					<NotificationsIcon />
				</Badge>
			</IconButton>
			<Drawer anchor="right" open={state} onClose={toggleDrawer(false)}>
				<AlertsList />
			</Drawer>
		</React.Fragment>
	)
}

function AlertsList(props) {
	const [{ alerts }, dispatch] = useStateValue();
	if (!alerts) {
		return <Box>No notifications</Box>
	}
	return (
		<List>
			{alerts.map((a, i) => (
				<Alert key={i} data={a} i={i} />
			))}
		</List>
	)
}

function Alert(props) {
	const [{}, dispatch] = useStateValue();
	function handleClick(e) {
		dispatch({
			type: "closeAlert",
			i: e.target.getAttribute("i")
		})
	}
	return (
		<ListItem>
			<ListItemIcon>
				<NotificationsIcon color={props.data.color} />
			</ListItemIcon>
			<ListItemText
				primary={
					<small>{props.data.date.toLocaleString()}</small>
				}
				secondary={
					props.data.body
				}
			/>
			<ListItemSecondaryAction>
				<IconButton edge="end" aria-label="Delete" i={props.i} onClick={handleClick}>
					<DeleteIcon />
				</IconButton>
			</ListItemSecondaryAction>
		</ListItem>
	)
}

export { Alerts };


