'use strict';

//import PropTypes from "prop-types";
import React from "react";
import useUser from "../hooks/User.jsx"
import useClusterStatus from "../hooks/ClusterStatus.jsx"
import { useLocation, useHistory, matchPath } from 'react-router'
import { Link as RouteLink } from 'react-router-dom'
import { useStateValue } from '../state.js';
import { useTranslation } from 'react-i18next';
import { state } from "../utils.js";
import { allIssue } from "../issues.js";
import { Alerts } from "./Alerts.jsx";
import { Subsystems } from "./Subsystems.jsx";
import { LangSelector } from "./LangSelector.jsx";
import { useReactOidc } from '@axa-fr/react-oidc-context';

import { makeStyles, withStyles, emphasize } from '@material-ui/core/styles';
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
import Chip from '@material-ui/core/Chip';
import MenuIcon from '@material-ui/icons/Menu';

const StyledBreadcrumb = withStyles(theme => ({
	root: {
		backgroundColor: "inherit",
		height: theme.spacing(3),
		color: "inherit",
		fontWeight: theme.typography.fontWeightRegular,
		fontSize: "inherit",
		'&:hover, &:focus': {
			backgroundColor: "rgba(255, 255, 255, 0.3)",
		},
		'&:active': {
			boxShadow: theme.shadows[1],
			backgroundColor: "inherit",
		},
	},
}))(Chip); // TypeScript only: need a type cast here because https://github.com/Microsoft/TypeScript/issues/26591

const useStyles = makeStyles(theme => ({
	breadcrumbs: {
		flexGrow: 1,
	},
	separator: {
		marginLeft: 0,
		marginRight: 0,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	root: {
		flexGrow: 1,
	},
}))

function breadcrumbs(clusterName) {
	const loc = useLocation()
	let params = new URLSearchParams(loc.search)

	var crumbs = [
		{
			text: clusterName,
			to: "/",
		}
	]

	var heads = [
		{ path: "/heartbeats", text: "Heartbeats" },
		{ path: "/threads", text: "Threads" },
		{ path: "/arbitrators", text: "Arbitrators" },
		{ path: "/networks", text: "Networks" },
		{ path: "/pools", text: "Pools" },
		{ path: "/nodes", text: "Nodes" },
		{ path: "/objects", text: "Objects" },
		{ path: "/services", text: "Services" },
		{ path: "/volumes", text: "Volumes" },
		{ path: "/configs", text: "Configs" },
		{ path: "/secrets", text: "Secrets" },
		{ path: "/users", text: "Users" },
	]
	for (var head of heads) {
		var match = matchPath(loc.pathname, {path: head.path, exact: true})
		if (match) {
			crumbs.push({
				text: head.text,
			})
			return crumbs
		}
	}

	var match = matchPath(loc.pathname, {path: "/node", exact: true})
	if (match) {
		crumbs.push({
			text: "Nodes",
			to: "/nodes",
		})
		crumbs.push({
			text: params.get("name"),
		})
		return crumbs
	}

	var match = matchPath(loc.pathname, {path: "/network", exact: true})
	if (match) {
		crumbs.push({
			text: "Networks",
			to: "/networks",
		})
		crumbs.push({
			text: params.get("name"),
		})
		return crumbs
	}

	var match = matchPath(loc.pathname, {path: "/object", exact: true})
	if (match) {
		var kind = (loc.state !== undefined) ? loc.state.kind : "Objects"
		crumbs.push({
			text: kind,
			to: "/" + kind.toLowerCase(),
		})
		crumbs.push({
			text: params.get("path"),
		})
		return crumbs
	}

	var match = matchPath(loc.pathname, {path: "/instance", exact: true})
	if (match) {
		var kind = (loc.state !== undefined) ? loc.state.kind : "Objects"
		crumbs.push({
			text: kind,
			to: "/" + kind.toLowerCase(),
		})
		crumbs.push({
			text: params.get("path") + "@" + params.get("node"),
		})
		return crumbs
	}

	return crumbs
}

function Crumbs(props) {
	const classes = useStyles()
	const { cstat } = useClusterStatus()
	if (!cstat.cluster) {
		var clusterName = "-"
	} else {
		var clusterName = cstat.cluster.name
	}
	const crumbs = breadcrumbs(clusterName)
	return (
		<Breadcrumbs
			color="inherit"
			className={classes.breadcrumbs}
			separator={<NavigateNextIcon fontSize="small" />}
			classes={{"separator": classes.separator}}
			aria-label="Breadcrumb"
		>
			{crumbs.map((data, i) => (
				<NavLink key={i} text={data.text} to={data.to} />
			))}
		</Breadcrumbs>
	)
}

function NavBar(props) {
	const classes = useStyles()
	return (
		<Toolbar className={classes.root}>
			<NavBarMenu />
			<Crumbs />
			<LangSelector />
			<UserLink />
			<Alerts />
		</Toolbar>
	)
}

function NavBarMenu(props) {
        const [state, setState] = React.useState(false)
	const cstat = useClusterStatus()
	const classes = useStyles()
        const toggleDrawer = (open) => event => {
                if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
                        return
                }
                setState(open)
        }
	var issue = allIssue(cstat)
	if (issue == state.OPTIMAL) {
		var count = 0
	} else {
		var count = 1
	}
	return (
		<React.Fragment>
			<IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="Menu" onClick={toggleDrawer(!state)}>
				<Badge badgeContent={count} color="secondary" variant="dot">
					<MenuIcon />
				</Badge>
			</IconButton>
			<Drawer anchor="left" open={state} onClose={toggleDrawer(false)}>
                                <Subsystems
					closeDrawer={toggleDrawer(false)}
				/>
			</Drawer>
		</React.Fragment>
	)
}

function NavLink(props) {
	const {text, to} = props
	const { t, i18n } = useTranslation()
	const history = useHistory()
	function handleClick(e) {
		e.preventDefault()
		if (!to) {
			return
		}
		history.push(to)
	}
	return (
		<StyledBreadcrumb
			onClick={handleClick}
			component="a"
			label={t(text)}
		/>
	)
}

function UserLink(props) {
	const { user } = useUser()
	const history = useHistory()
	const { oidcUser, login, logout } = useReactOidc()

	function handleClick(e) {
		history.push("/user")
	}

	if (!oidcUser) {
		return (
			<Button onClick={login} color="inherit">
				Login
			</Button>
		)
	}
	var logoutbutton = (
		<Button onClick={logout} color="inherit">
			Logout
		</Button>
	)
	if (user.name === undefined ) {
		return logoutbutton
	}
	return (
		<Avatar color="inherit" href="#" onClick={handleClick}>
			{user.name[0].toUpperCase()}
		</Avatar>
	)
}

export {
	NavBar
}
