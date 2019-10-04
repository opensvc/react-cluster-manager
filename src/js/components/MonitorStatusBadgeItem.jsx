import React from "react";
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import PlayArrowIcon from "@material-ui/icons/PlayArrow"

function MonitorStatusBadgeItem(props) {
	if (!props.state) {
		return null
	}
	if (props.state == "idle") {
		return null
	}
	if (props.state.match(/failed/)) {
		var color = "error"
	} else {
		var color = "primary"
	}
	return (
		<ListItem>
			<ListItemIcon>
				<PlayArrowIcon color={color} />
			</ListItemIcon>
			<ListItemText>
				{props.state}
			</ListItemText>
		</ListItem>
	)
}

export {
	MonitorStatusBadgeItem
}
