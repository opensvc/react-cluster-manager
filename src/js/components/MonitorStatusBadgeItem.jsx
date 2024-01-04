import React from "react";
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import PlayArrowIcon from "@mui/icons-material/PlayArrow"

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
