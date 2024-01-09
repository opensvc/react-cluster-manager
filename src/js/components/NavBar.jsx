"use strict";

import React from "react"
import useUser from "../hooks/User.jsx"
import useClusterStatus from "../hooks/ClusterStatus.jsx"
import useAuthInfo from "../hooks/AuthInfo.jsx"
import { useLocation, useNavigate, matchPath } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { state } from "../utils.js"
import { allIssue } from "../issues.js"
import Alerts from "./Alerts.jsx"
import { Subsystems } from "./Subsystems.jsx"
import { bgColorStyles } from "../styles.js"
import Drawer from "@mui/material/Drawer"
import Breadcrumbs from "@mui/material/Breadcrumbs"
import Badge from "@mui/material/Badge"
import NavigateNextIcon from "@mui/icons-material/NavigateNext"
import IconButton from "@mui/material/IconButton"
import Toolbar from "@mui/material/Toolbar"
import Avatar from "@mui/material/Avatar"
import Chip from "@mui/material/Chip"
import MenuIcon from "@mui/icons-material/Menu"
import BlockIcon from "@mui/icons-material/Block"
import WifiOffIcon from "@mui/icons-material/WifiOff"
import {version} from "../../version";
import useClasses from "../hooks/useClasses.jsx";

const styles2 = theme => ({
	root: {
		backgroundColor: 'inherit',
		height: theme.spacing(3),
		color: 'inherit',
		fontWeight: theme.typography.fontWeightRegular,
		fontSize: 'inherit',
		'&:hover, &:focus': {
			backgroundColor: 'rgba(255, 255, 255, 0.3)',
		},
		'&:active': {
			boxShadow: theme.shadows[1],
			backgroundColor: 'inherit',
		},
	},
});

const StyledBreadcrumb = ({ ...props }) => {
	const classes = useClasses(styles2);

	return <Chip className={classes.root} {...props} />;
};

const styles = theme => ({
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
});

function breadcrumbs() {
	const loc = useLocation()
	let params = new URLSearchParams(loc.search)
	var crumbs = []
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
		{ path: "/stats", text: "Stats" },
		{ path: "/api", text: "Api", to: "/api" },
	]
	for (var head of heads) {
		var match = matchPath({path: head.path, end: true, caseSensitive: false},loc.pathname)
		if (match) {
			crumbs.push({
				text: head.text,
				to: head.to,
			})
			return crumbs
		}
	}

	var match = matchPath({path: "/node", end: true, caseSensitive: false},loc.pathname)
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

	var match = matchPath({path: "/network", end: true, caseSensitive: false},loc.pathname)
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

	var match = matchPath({path: "/object", end: true, caseSensitive: false}, loc.pathname)
	if (match) {
		var kind = (loc.state !== null) ? loc.state.kind : "Objects"
		crumbs.push({
			text: kind,
			to: "/" + kind.toLowerCase(),
		})
		crumbs.push({
			text: params.get("path"),
		})
		return crumbs
	}

	var match = matchPath({path: "/instance", end: true, caseSensitive: false},loc.pathname)
	if (match) {
		var kind = (loc.state !== null) ? loc.state.kind : "Objects"
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
	const classes = useClasses(styles)
	const { cstat } = useClusterStatus()
	const crumbs = breadcrumbs()
	try {
		var clusterName = cstat.cluster.name
	} catch(e) {
		var clusterName = "/"
	}
	return (
		<Breadcrumbs
			color="inherit"
			className={classes.breadcrumbs}
			separator={<NavigateNextIcon fontSize="small" />}
			classes={{"separator": classes.separator}}
			aria-label="Breadcrumb"
		>
			<NavLink key="cluster" text={clusterName} to="/" />
			{crumbs.map((data, i) => (
				<NavLink key={i} text={data.text} to={data.to} />
			))}
		</Breadcrumbs>
	)
}

function NavBar(props) {
	const classes = useClasses(styles)
	return (
		<Toolbar className={classes.root}>
			<NavBarMenu />
			<Crumbs />
			<ConnectionAlive />
			<Alerts />
			<UserLink />
		</Toolbar>
	)
}

function NavBarMenu(props) {
	const [drawerOpen, setDrawerOpen] = React.useState(false)
	const { cstat } = useClusterStatus()
	const bgcolor = useClasses(bgColorStyles)
	const classes = useClasses(styles)
	const toggleDrawer = (open) => event => {
		if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
			return
		}
		setDrawerOpen(open)
	}
	var issue = allIssue(cstat)
	if (issue == state.OPTIMAL) {
		var count = 0
	} else {
		var count = 1
	}
	return (
		<React.Fragment>
			<IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="Menu" onClick={toggleDrawer(!drawerOpen)} title={"app version " + version}>
				<Badge badgeContent={count} classes={{badge: bgcolor[issue.name]}} variant="dot">
					<MenuIcon />
				</Badge>
			</IconButton>
			<Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
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
	const navigate = useNavigate()
	function handleClick(e) {
		e.preventDefault()
		if (!to) {
			return
		}
		navigate(to)
	}
	return (
		<StyledBreadcrumb
			onClick={handleClick}
			component="a"
			label={props.children ? null : t(text)}
		>
			{props.children}
		</StyledBreadcrumb>
	)
}

function UserLink(props) {
	const { user } = useUser()
	const navigate = useNavigate()
	const authInfo = useAuthInfo()
	if (!authInfo || !user) {
		return null
	}
	function handleClick(e) {
		navigate("/user")
	}
	if (user.status == 401) {
		localStorage.setItem("opensvc.authChoice", "")
		return (
			<BlockIcon />
		)
	}
	if (user.name === undefined ) {
		return null
	}
	return (
		<Avatar color="inherit" href="#" onClick={handleClick}>
			{user.name[0].toUpperCase()}
		</Avatar>
	)
}

function ConnectionAlive(props) {
	const { eventSourceAlive } = useClusterStatus()

	if (eventSourceAlive) {
		return null
	}
	return (
		<WifiOffIcon />
	)
}

export {
	NavBar
}
