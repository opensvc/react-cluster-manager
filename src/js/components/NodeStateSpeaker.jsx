import React from "react";
import RssFeedIcon from '@material-ui/icons/RssFeed';
import Typography from '@material-ui/core/Typography';

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
