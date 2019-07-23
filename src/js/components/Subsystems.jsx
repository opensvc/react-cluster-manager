import React from "react";
import { useStateValue } from '../state.js';
import { threadsIssue, arbitratorsIssue, heartbeatsIssue, nodesIssue, objectsIssue } from "../issues.js";
import { makeStyles } from '@material-ui/core/styles';
import { state } from "../utils.js"
import { useColorStyles } from "../styles.js"
import Badge from '@material-ui/core/Badge';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

import SubscriptionsIcon from '@material-ui/icons/Subscriptions';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import HowToVoteIcon from '@material-ui/icons/HowToVote';
import StorageIcon from '@material-ui/icons/Storage';
import WidgetsIcon from '@material-ui/icons/Widgets';

function SubsystemsLink(props) {
	const classes = useColorStyles()
	return (
		<ListItem button onClick={props.onClick}>
			<ListItemIcon className={classes[props.issue.name]}>{props.icon}</ListItemIcon>
			<ListItemText primary={props.title} />
		</ListItem>
	)
}

function Subsystems(props) {
	const [{ cstat }, dispatch] = useStateValue()
	return (
		<List>
			<SubsystemsLink
				issue={threadsIssue(cstat)}
				href="#threads"
				title="Threads"
				icon={ <SubscriptionsIcon /> }
				onClick={() => dispatch({type: "setNav", page: "Threads", links: ["Threads"]})}
			/>
			<SubsystemsLink
				issue={heartbeatsIssue(cstat)}
				href="#heartbeats"
				title="Heartbeats"
				icon={ <SwapHorizIcon /> }
				onClick={() => dispatch({type: "setNav", page: "Heartbeats", links: ["Heartbeats"]})}
			/>
			<SubsystemsLink
				issue={arbitratorsIssue(cstat)}
				href="#arbitrators"
				title="Arbitrators"
				icon={ <HowToVoteIcon /> }
				onClick={() => dispatch({type: "setNav", page: "Arbitrators", links: ["Arbitrators"]})}
			/>
			<SubsystemsLink
				issue={nodesIssue(cstat)}
				href="#nodes"
				title="Nodes"
				icon={ <StorageIcon /> }
				onClick={() => dispatch({type: "setNav", page: "Nodes", links: ["Nodes"]})}
			/>
			<SubsystemsLink
				issue={objectsIssue(cstat)}
				href="#objects"
				title="Objects"
				icon={ <WidgetsIcon /> }
				onClick={() => dispatch({type: "setNav", page: "Objects", links: ["Objects"]})}
			/>
		</List>
	)
}

export {
	Subsystems
}
