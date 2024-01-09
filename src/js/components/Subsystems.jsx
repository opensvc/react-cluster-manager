import React from "react";
import { useNavigate } from 'react-router-dom'
import { useStateValue } from '../state.js';
import { useTranslation } from 'react-i18next';
import { clusterIssue, threadsIssue, arbitratorsIssue, heartbeatsIssue, nodesIssue, objectsIssue } from "../issues.js";
import { state } from "../utils.js"
import { ColorStyles } from "../styles.js"
import ObjIcon from "./ObjIcon.jsx"
import Badge from '@mui/material/Badge';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import StorageIcon from '@mui/icons-material/Storage';
import WidgetsIcon from '@mui/icons-material/Widgets';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import LinkIcon from '@mui/icons-material/Link';
import CodeIcon from '@mui/icons-material/Code';
import SaveIcon from '@mui/icons-material/Save'
import useClasses from "../hooks/useClasses.jsx";

const styles = theme => ({
	nested: {
		paddingLeft: theme.spacing(4),
	},
})

function SubsystemsLink(props) {
	const classes = useClasses(ColorStyles)
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
	const navigate = useNavigate()
	const classes = useClasses(styles)
	return (
		<List>
			<SubsystemsLink
				issue={clusterIssue(cstat)}
				href="#cluster"
				title="Cluster"
				icon={ <GroupWorkIcon /> }
				onClick={() => navigate("/")}
				closeDrawer={props.closeDrawer}
			/>
			<SubsystemsLink
				issue={threadsIssue(cstat)}
				href="#threads"
				title="Threads"
				icon={ <SubscriptionsIcon /> }
				onClick={() => navigate("/threads")}
				closeDrawer={props.closeDrawer}
				className={classes.nested}
			/>
			<SubsystemsLink
				issue={heartbeatsIssue(cstat)}
				href="#heartbeats"
				title="Heartbeats"
				icon={ <SwapHorizIcon /> }
				onClick={() => navigate("/heartbeats")}
				closeDrawer={props.closeDrawer}
				className={classes.nested}
			/>
			<SubsystemsLink
				issue={arbitratorsIssue(cstat)}
				href="#arbitrators"
				title="Arbitrators"
				icon={ <HowToVoteIcon /> }
				onClick={() => navigate("/arbitrators")}
				closeDrawer={props.closeDrawer}
				className={classes.nested}
			/>
			<SubsystemsLink
				issue={nodesIssue(cstat)}
				href="#nodes"
				title="Nodes"
				icon={ <StorageIcon /> }
				onClick={() => navigate("/nodes")}
				closeDrawer={props.closeDrawer}
				className={classes.nested}
			/>
			<SubsystemsLink
				issue={state.OPTIMAL}
				href="#pools"
				title="Pools"
				icon={ <SaveIcon /> }
				onClick={() => navigate("/pools")}
				closeDrawer={props.closeDrawer}
				className={classes.nested}
			/>
			<SubsystemsLink
				issue={state.OPTIMAL}
				href="#networks"
				title="Networks"
				icon={ <LinkIcon /> }
				onClick={() => navigate("/networks")}
				closeDrawer={props.closeDrawer}
				className={classes.nested}
			/>

			<SubsystemsLink
				issue={objectsIssue(cstat)}
				href="#objects"
				title="Objects"
				icon={ <WidgetsIcon /> }
				onClick={() => navigate("/objects")}
				closeDrawer={props.closeDrawer}
			/>
			<SubsystemsLink
				issue={objectsIssue(cstat, "svc")}
				href="#svc"
				title="Services"
				icon={ <ObjIcon kind="svc" /> }
				onClick={() => navigate("/services")}
				closeDrawer={props.closeDrawer}
				className={classes.nested}
			/>
			<SubsystemsLink
				issue={objectsIssue(cstat, "vol")}
				href="#vol"
				title="Volumes"
				icon={ <ObjIcon kind="vol" /> }
				onClick={() => navigate("/volumes")}
				closeDrawer={props.closeDrawer}
				className={classes.nested}
			/>
			<SubsystemsLink
				issue={state.OPTIMAL}
				href="#cfg"
				title="Configs"
				icon={ <ObjIcon kind="cfg" /> }
				onClick={() => navigate("/configs")}
				closeDrawer={props.closeDrawer}
				className={classes.nested}
			/>
			<SubsystemsLink
				issue={state.OPTIMAL}
				href="#sec"
				title="Secrets"
				icon={ <ObjIcon kind="sec" /> }
				onClick={() => navigate("/secrets")}
				closeDrawer={props.closeDrawer}
				className={classes.nested}
			/>
			<SubsystemsLink
				issue={state.OPTIMAL}
				href="#usr"
				title="Users"
				icon={ <ObjIcon kind="usr" /> }
				onClick={() => navigate("/users")}
				closeDrawer={props.closeDrawer}
				className={classes.nested}
			/>

			<SubsystemsLink
				issue={state.OPTIMAL}
				href="#api"
				title="Api"
				icon={ <CodeIcon /> }
				onClick={() =>navigate("/api")}
				closeDrawer={props.closeDrawer}
			/>
		</List>
	)
}

export {
	Subsystems
}
