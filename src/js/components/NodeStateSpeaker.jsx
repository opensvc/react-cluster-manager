import React from "react";
import RssFeedIcon from '@mui/icons-material/RssFeed';
import Typography from '@mui/material/Typography';

function NodeStateSpeaker(props) {
	if (props.speaker != true) {
		return null
	}
	return (
		<Typography component="span" className={props.className}>
			<RssFeedIcon title="Speaker" color="action" />
		</Typography>
	)
}


export {
	NodeStateSpeaker,
}
