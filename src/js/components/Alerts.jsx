import React from "react"
import { useStateValue } from '../state.js'

import Typography from '@mui/material/Typography'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import NotificationsIcon from '@mui/icons-material/Notifications'
import Badge from '@mui/material/Badge'
import DeleteIcon from '@mui/icons-material/Delete'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import useClasses from "../hooks/useClasses.jsx";

const useStyles = {
	closeButton: {
		alignSelf: "end",
	},
	list: {
		width: 250,
	},
	fullList: {
		width: 'auto',
	},
}

function Alerts(props) {
	const [{ alerts }, dispatch] = useStateValue()
	const [state, setState] = React.useState(false)
	const classes = useClasses(useStyles)
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
				<IconButton className={classes.closeButton} edge="end" aria-label="Close" onClick={toggleDrawer(false)}>
					<ArrowRightIcon />
				</IconButton>
				<AlertsList />
			</Drawer>
		</React.Fragment>
	)
}

function AlertsList(props) {
	const [{ alerts }, dispatch] = useStateValue()
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
	const { data, i } = props
	const [{}, dispatch] = useStateValue()
	const handleClick = (i) => (e) => {
		dispatch({
			type: "closeAlert",
			i: i,
		})
	}
	return (
		<ListItem>
			<ListItemIcon>
				<NotificationsIcon color={data.color} />
			</ListItemIcon>
			<ListItemText
				primary={<Typography component="span" variant="caption">{data.date.toLocaleString()}</Typography>}
				secondary={data.body}
				secondaryTypographyProps={{component: "div"}}
			/>
			<ListItemSecondaryAction>
				<IconButton edge="end" aria-label="Delete" onClick={handleClick(i)}>
					<DeleteIcon />
				</IconButton>
			</ListItemSecondaryAction>
		</ListItem>
	)
}

export default Alerts


