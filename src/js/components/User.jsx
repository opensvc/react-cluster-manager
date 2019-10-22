import React, { Fragment } from "react"
import { useReactOidc } from "@axa-fr/react-oidc-context"
import useAuthInfo from "../hooks/AuthInfo.jsx"
import { useStateValue } from '../state.js'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import Skeleton from '@material-ui/lab/Skeleton'
import LangSelector from "./LangSelector.jsx"

const useStyles = makeStyles(theme => ({
	root: {
		marginTop: theme.spacing(3),
	},
	inline: {
		display: "inline-block",
		margin: 0,
	},
	pre: {
		whiteSpace: "normal",
		fontFamily: "monospace",
		wordBreak: "break-all",
	},
}))

function User(props) {
	return (
		<Fragment>
			<UserDigest />
			<UserGrants />
			<OidcAccessToken />
		</Fragment>
	)
}

function UserDigest(props) {
	const { oidcUser, logout } = useReactOidc()
	const { i18n, t } = useTranslation()
	const [{ user }, dispatch] = useStateValue()
	const classes = useStyles()
	return (
		<Card className={classes.root}>
			<CardHeader
				title={t("User")}
				subheader={user.name ? user.name : <Skeleton width="5rem" />}
			/>
			<CardContent>
				<Typography>
					<UserAuthMethod user={user}/>
				</Typography>
				<br />
				<Typography>
					<OidcProvider />
				</Typography>
			</CardContent>
			<CardActions>
				<Button onClick={logout} color="primary">
					{t("Logout")}
				</Button>
				<LangSelector />
			</CardActions>
		</Card>
	)
}

function UserAuthMethod(props) {
	const { user } = props
	const { i18n, t } = useTranslation()
	const classes = useStyles()
	return (
		<Fragment>
			{t("Authenticated via")}
			&nbsp;
			<Link href={"#"+user.auth}>
				{user.auth ? user.auth : <Skeleton width="5rem" className={classes.inline} />}
			</Link>
			.
		</Fragment>
	)
}

function HostnameLink(props) {
	const { href } = props
	var l = new URL(href)
	return (
		<Link href={href}>
			{l.hostname}
		</Link>
	)
}

function OidcProvider(props) {
	const { oidcUser } = useReactOidc()
	const { i18n, t } = useTranslation()
	const authInfo = useAuthInfo()
	const classes = useStyles()
	if (!authInfo) {
		return <Skeleton />
	}
	if (authInfo.openid === undefined) {
		return "n/a"
	}
	if (!oidcUser || (authInfo.openid === undefined)) {
		return null
	}
	return (
		<Fragment>
			{t("Token provided by openid server")}
			&nbsp;
			<HostnameLink href={authInfo.openid.well_known_uri} />
			.
		</Fragment>
	)
}

function OidcAccessToken(props) {
	const { oidcUser } = useReactOidc()
	const { i18n, t } = useTranslation()
	const classes = useStyles()
	if (!oidcUser) {
		return null
	}
	var date = new Date(oidcUser.expires_at*1000)
	return (
		<Card id="jwt" className={classes.root}>
			<CardHeader
				title={t("Access Token")}
				subheader={t("Expires at {{date}}", {date: date.toLocaleString()})}
			/>
			<CardContent>
				<Typography variant="body1" component="pre" className={classes.pre}>
					{oidcUser.access_token}
				</Typography>
			</CardContent>
		</Card>
	)
}

function parseGrant(grant) {
	var data = []
	if ("root" in grant) {
		data.push({role: "root"})
		return data
	}
	for (var role in grant) {
		data.push({role: role, namespaces: grant[role]})
	}
	return data
}

function UserGrants(props) {
	const [{ user }, dispatch] = useStateValue()
	const { i18n, t } = useTranslation()
	const classes = useStyles()

	if (user.grant === undefined) {
		return <Skeleton variant="rect" width="100%" height="8rem" />
	}
	var data = parseGrant(user.grant)
	return (
		<Card className={classes.root}>
			<CardHeader
				title={t("Grants")}
				subheader={user.raw_grant}
			/>
			<CardContent>
				<List>
					{data.map((item, i) => (
						<GrantLine key={i} namespaces={item.namespaces} role={item.role} />
					))}
				</List>
			</CardContent>
		</Card>
	)
}

function GrantLine(props) {
	const { i18n, t } = useTranslation()

	if (!props.namespaces) {
		if (["hearbeat", "blacklistadmin", "squatter", "root"].indexOf(props.role) > -1) {
			var text = ""
		} else {
			return null
		}
	} else if (props.namespaces.length == 0) {
		var text = t("on no existing namespaces")
	} else {
		var text = t("on namespaces {{ns}}", {ns: props.namespaces.join(", ")})
	}
	return (
		<ListItem disableGutters={true}>
			<ListItemText primary={props.role} secondary={text} />
		</ListItem>
	)
}

export {
	User
}
