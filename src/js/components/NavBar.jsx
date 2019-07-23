'use strict';

//import PropTypes from "prop-types";
import React from "react";
import { useStateValue } from '../state.js';
import { state } from "../utils.js";
import { clusterIssue } from "../issues.js";
import { Alerts } from "./Alerts.jsx";
import { Subsystems } from "./Subsystems.jsx";

import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Badge from '@material-ui/core/Badge';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Avatar from '@material-ui/core/Avatar';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles(theme => ({
	breadcrumbs: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	root: {
		flexGrow: 1,
	},
}))

function NavBar(props) {
	const [{ nav }, dispatch] = useStateValue();
	const classes = useStyles()
	return (
		<Toolbar className={classes.root}>
			<NavBarMenu />
			<Breadcrumbs color="inherit" className={classes.breadcrumbs} separator={<NavigateNextIcon fontSize="small" />} aria-label="Breadcrumb">
				<ClusterName />
				{Object.keys(nav.links).map((l) => (
					<NavLink key={l} link={nav.links[l]} links={nav.links} />
				))}
			</Breadcrumbs>
			<UserLink />
			<Alerts />
		</Toolbar>
	)
}

function NavBarMenu(props) {
        const [state, setState] = React.useState(false)
	const [{ cstat }, dispatch] = useStateValue();
        const toggleDrawer = (open) => event => {
                if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
                        return
                }
                setState(open)
        }
	const classes = useStyles()
	var clIssue = clusterIssue(cstat)
	if (clIssue == state.OPTIMAL) {
		var count = 0
	} else {
		var count = 1
	}
	return (
		<React.Fragment>
			<IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="Menu" onClick={toggleDrawer(true)}>
				<Badge badgeContent={count} color="secondary" variant="dot">
					<MenuIcon />
				</Badge>
			</IconButton>
			<Drawer anchor="left" open={state} onClose={toggleDrawer(false)}>
                                <Subsystems />
			</Drawer>
		</React.Fragment>
	)
}

function NavLink(props) {
	const [{}, dispatch] = useStateValue();
	function handleClick(e) {
		var i = props.links.indexOf(props.link)
		dispatch({
			type: "setNav",
			page: props.links[i],
			links: props.links.slice(0, i+1)
		})
	}
	return (
		<Link color="inherit" href="#" onClick={handleClick}>{props.link}</Link>
	)
}

function UserLink(props) {
	const [{ user }, dispatch] = useStateValue();
	if (user.name === undefined) {
		return null
	}
	function handleClick(e) {
		dispatch({
			type: "setNav",
			page: "User",
			links: []
		})
	}
	return <Avatar color="inherit" href="#" onClick={handleClick}>{user.name[0].toUpperCase()}</Avatar>
}

function ClusterName(props) {
	const [{ cstat }, dispatch] = useStateValue();
	if (!cstat.cluster) {
		return null
	}
	function handleClick(e) {
		dispatch({
			type: "setNav",
			page: "Cluster",
			links: []
		})
	}
	return (
		<Link href="#" color="inherit" onClick={handleClick}>{cstat.cluster.name}</Link>
	)
}

export {
	NavBar
}
