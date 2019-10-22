import React from "react"
import { useStateValue } from '../state.js'

import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Drawer from '@material-ui/core/Drawer'
import IconButton from '@material-ui/core/IconButton'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import NotificationsIcon from '@material-ui/icons/Notifications'
import Badge from '@material-ui/core/Badge'
import DeleteIcon from '@material-ui/icons/Delete'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'

const useStyles = makeStyles({
	closeButton: {
		alignSelf: "end",
	},
	list: {
		width: 250,
	},
	fullList: {
		width: 'auto',
	},
})

function Alerts(props) {
	const [{ alerts }, dispatch] = useStateValue()
	const [state, setState] = React.useState(false)
	const classes = useStyles()
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
				primary=<Typography component="span" variant="caption">{data.date.toLocaleString()}</Typography>
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


