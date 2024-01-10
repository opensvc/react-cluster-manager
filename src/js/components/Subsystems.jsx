import React from "react";
import { useHistory } from 'react-router-dom'
import { useStateValue } from '../state.js';
import { useTranslation } from 'react-i18next';
import { clusterIssue, threadsIssue, arbitratorsIssue, heartbeatsIssue, nodesIssue, objectsIssue } from "../issues.js";
import { makeStyles } from '@material-ui/core/styles';
import { state } from "../utils.js"
import { useColorStyles } from "../styles.js"
import ObjIcon from "./ObjIcon.jsx"
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
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import LinkIcon from '@material-ui/icons/Link';
import CodeIcon from '@material-ui/icons/Code';
import SaveIcon from '@material-ui/icons/Save'

const useStyles = makeStyles(theme => ({
	nested: {
		paddingLeft: theme.spacing(4),
	},
}))

function SubsystemsLink(props) {
	const classes = useColorStyles()
	const { t, i18n } = useTranslation()
	function handleClick(e) {
		props.onClick()
		props.closeDrawer(e)
	}
	return (
		<ListItem button onClick={handleClick} className={props.className}>
			<ListItemIcon className={classes[props.issue.name]}>{props.icon}</ListItemIcon>
			<ListItemText primary={t(props.title)} />
		</ListItem>
	)
}

function Subsystems(props) {
	const [{ cstat }, dispatch] = useStateValue()
	const history = useHistory()
	const classes = useStyles()
	return (
		<List>
			<SubsystemsLink
				issue={clusterIssue(cstat)}
				href="#cluster"
				title="Cluster"
				icon={ <GroupWorkIcon /> }
				onClick={() => history.push("/")}
				closeDrawer={props.closeDrawer}
			/>
			<SubsystemsLink
				issue={threadsIssue(cstat)}
				href="#threads"
				title="Threads"
				icon={ <SubscriptionsIcon /> }
				onClick={() => history.push("/threads")}
				closeDrawer={props.closeDrawer}
				className={classes.nested}
			/>
			<SubsystemsLink
				issue={heartbeatsIssue(cstat)}
				href="#heartbeats"
				title="Heartbeats"
				icon={ <SwapHorizIcon /> }
				onClick={() => history.push("/heartbeats")}
				closeDrawer={props.closeDrawer}
				className={classes.nested}
			/>
			<SubsystemsLink
				issue={arbitratorsIssue(cstat)}
				href="#arbitrators"
				title="Arbitrators"
				icon={ <HowToVoteIcon /> }
				onClick={() => history.push("/arbitrators")}
				closeDrawer={props.closeDrawer}
				className={classes.nested}
			/>
			<SubsystemsLink
				issue={nodesIssue(cstat)}
				href="#nodes"
				title="Nodes"
				icon={ <StorageIcon /> }
				onClick={() => history.push("/nodes")}
				closeDrawer={props.closeDrawer}
				className={classes.nested}
			/>
			<SubsystemsLink
				issue={state.OPTIMAL}
				href="#pools"
				title="Pools"
				icon={ <SaveIcon /> }
				onClick={() => history.push("/pools")}
				closeDrawer={props.closeDrawer}
				className={classes.nested}
			/>
			<SubsystemsLink
				issue={state.OPTIMAL}
				href="#networks"
				title="Networks"
				icon={ <LinkIcon /> }
				onClick={() => history.push("/networks")}
				closeDrawer={props.closeDrawer}
				className={classes.nested}
			/>

			<SubsystemsLink
				issue={objectsIssue(cstat)}
				href="#objects"
				title="Objects"
				icon={ <WidgetsIcon /> }
				onClick={() => history.push("/objects")}
				closeDrawer={props.closeDrawer}
			/>
			<SubsystemsLink
				issue={objectsIssue(cstat, "svc")}
				href="#svc"
				title="Services"
				icon={ <ObjIcon kind="svc" /> }
				onClick={() => history.push("/services")}
				closeDrawer={props.closeDrawer}
				className={classes.nested}
			/>
			<SubsystemsLink
				issue={objectsIssue(cstat, "vol")}
				href="#vol"
				title="Volumes"
				icon={ <ObjIcon kind="vol" /> }
				onClick={() => history.push("/volumes")}
				closeDrawer={props.closeDrawer}
				className={classes.nested}
			/>
			<SubsystemsLink
				issue={state.OPTIMAL}
				href="#cfg"
				title="Configs"
				icon={ <ObjIcon kind="cfg" /> }
				onClick={() => history.push("/configs")}
				closeDrawer={props.closeDrawer}
				className={classes.nested}
			/>
			<SubsystemsLink
				issue={state.OPTIMAL}
				href="#sec"
				title="Secrets"
				icon={ <ObjIcon kind="sec" /> }
				onClick={() => history.push("/secrets")}
				closeDrawer={props.closeDrawer}
				className={classes.nested}
			/>
			<SubsystemsLink
				issue={state.OPTIMAL}
				href="#usr"
				title="Users"
				icon={ <ObjIcon kind="usr" /> }
				onClick={() => history.push("/users")}
				closeDrawer={props.closeDrawer}
				className={classes.nested}
			/>

			<SubsystemsLink
				issue={state.OPTIMAL}
				href="#api"
				title="Api"
				icon={ <CodeIcon /> }
				onClick={() => history.push("/api")}
				closeDrawer={props.closeDrawer}
			/>
		</List>
	)
}

export {
	Subsystems
}
