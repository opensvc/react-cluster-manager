import React from "react";
import { useStateValue } from '../state.js';
import { clusterIssue, threadsIssue, arbitratorsIssue, heartbeatsIssue, nodesIssue, objectsIssue } from "../issues.js";
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
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import LockIcon from '@material-ui/icons/Lock';
import SaveIcon from '@material-ui/icons/Save';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import LinkIcon from '@material-ui/icons/Link';

const useStyles = makeStyles(theme => ({
	nested: {
		paddingLeft: theme.spacing(4),
	},
}))

function SubsystemsLink(props) {
	const classes = useColorStyles()
	function handleClick(e) {
		props.onClick()
		props.closeDrawer(e)
	}
	return (
		<ListItem button onClick={handleClick} className={props.className}>
			<ListItemIcon className={classes[props.issue.name]}>{props.icon}</ListItemIcon>
			<ListItemText primary={props.title} />
		</ListItem>
	)
}

function Subsystems(props) {
	const [{ cstat }, dispatch] = useStateValue()
	const classes = useStyles()
	return (
		<List>
			<SubsystemsLink
				issue={clusterIssue(cstat)}
				href="#cluster"
				title="Cluster"
				icon={ <GroupWorkIcon /> }
				onClick={() => dispatch({type: "setNav", page: "Cluster", links: []})}
				closeDrawer={props.closeDrawer}
			/>
			<SubsystemsLink
				issue={threadsIssue(cstat)}
				href="#threads"
				title="Threads"
				icon={ <SubscriptionsIcon /> }
				onClick={() => dispatch({type: "setNav", page: "Threads", links: ["Threads"]})}
				closeDrawer={props.closeDrawer}
				className={classes.nested}
			/>
			<SubsystemsLink
				issue={heartbeatsIssue(cstat)}
				href="#heartbeats"
				title="Heartbeats"
				icon={ <SwapHorizIcon /> }
				onClick={() => dispatch({type: "setNav", page: "Heartbeats", links: ["Heartbeats"]})}
				closeDrawer={props.closeDrawer}
				className={classes.nested}
			/>
			<SubsystemsLink
				issue={arbitratorsIssue(cstat)}
				href="#arbitrators"
				title="Arbitrators"
				icon={ <HowToVoteIcon /> }
				onClick={() => dispatch({type: "setNav", page: "Arbitrators", links: ["Arbitrators"]})}
				closeDrawer={props.closeDrawer}
				className={classes.nested}
			/>
			<SubsystemsLink
				issue={nodesIssue(cstat)}
				href="#nodes"
				title="Nodes"
				icon={ <StorageIcon /> }
				onClick={() => dispatch({type: "setNav", page: "Nodes", links: ["Nodes"]})}
				closeDrawer={props.closeDrawer}
				className={classes.nested}
			/>
			<SubsystemsLink
				issue={state.OPTIMAL}
				href="#pools"
				title="Pools"
				icon={ <StorageIcon /> }
				onClick={() => dispatch({type: "setNav", page: "Pools", links: ["Pools"]})}
				closeDrawer={props.closeDrawer}
				className={classes.nested}
			/>
			<SubsystemsLink
				issue={state.OPTIMAL}
				href="#networks"
				title="Networks"
				icon={ <LinkIcon /> }
				onClick={() => dispatch({type: "setNav", page: "Networks", links: ["Networks"]})}
				closeDrawer={props.closeDrawer}
				className={classes.nested}
			/>

			<SubsystemsLink
				issue={objectsIssue(cstat)}
				href="#objects"
				title="Objects"
				icon={ <WidgetsIcon /> }
				onClick={() => dispatch({type: "setNav", page: "Objects", links: ["Objects"]})}
				closeDrawer={props.closeDrawer}
			/>
			<SubsystemsLink
				issue={objectsIssue(cstat, "svc")}
				href="#svc"
				title="Services"
				icon={ <FiberManualRecordIcon /> }
				onClick={() => dispatch({type: "setNav", page: "Services", links: ["Services"]})}
				closeDrawer={props.closeDrawer}
				className={classes.nested}
			/>
			<SubsystemsLink
				issue={objectsIssue(cstat, "vol")}
				href="#vol"
				title="Volumes"
				icon={ <SaveIcon /> }
				onClick={() => dispatch({type: "setNav", page: "Volumes", links: ["Volumes"]})}
				closeDrawer={props.closeDrawer}
				className={classes.nested}
			/>
			<SubsystemsLink
				issue={state.OPTIMAL}
				href="#cfg"
				title="Configs"
				icon={ <LockOpenIcon /> }
				onClick={() => dispatch({type: "setNav", page: "Configs", links: ["Configs"]})}
				closeDrawer={props.closeDrawer}
				className={classes.nested}
			/>
			<SubsystemsLink
				issue={state.OPTIMAL}
				href="#sec"
				title="Secrets"
				icon={ <LockIcon /> }
				onClick={() => dispatch({type: "setNav", page: "Secrets", links: ["Secrets"]})}
				closeDrawer={props.closeDrawer}
				className={classes.nested}
			/>
			<SubsystemsLink
				issue={state.OPTIMAL}
				href="#usr"
				title="Users"
				icon={ <AccountCircleIcon /> }
				onClick={() => dispatch({type: "setNav", page: "Users", links: ["Users"]})}
				closeDrawer={props.closeDrawer}
				className={classes.nested}
			/>
		</List>
	)
}

export {
	Subsystems
}
