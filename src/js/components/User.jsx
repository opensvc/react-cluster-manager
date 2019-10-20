import React from "react"
import { useReactOidc } from "@axa-fr/react-oidc-context"
import useAuthInfo from "../hooks/AuthInfo.jsx"
import { useStateValue } from '../state.js'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Table from '@material-ui/core/Table'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import Skeleton from '@material-ui/lab/Skeleton'

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
	const { oidcUser, logout } = useReactOidc()
	const { i18n, t } = useTranslation()
	const [{ user }, dispatch] = useStateValue()
	const classes = useStyles()
	return (
		<Card className={classes.root}>
			<CardHeader
				title={user.name ? user.name : <Skeleton width="5rem" />}
			/>
			<CardContent>
				<Typography component="div">
					Authenticated via <strong>{user.auth ? user.auth : <Skeleton width="5rem" className={classes.inline} />}</strong>
				</Typography>
				<br />
				<Typography variant="h5" component="h3">
					{t("Grants")}
				</Typography>
				<UserGrants />
				<br />
				<OidcUserInfo />
			</CardContent>
			<CardActions>
				<Button onClick={logout} color="primary">
					{t("Logout")}
				</Button>
			</CardActions>
		</Card>
	)
}

function WellKown(props) {
	const authInfo = useAuthInfo()
	if (!authInfo) {
		return <Skeleton />
	}
	if (authInfo.openid === undefined) {
		return "n/a"
	}
	return (
		<React.Fragment>
			{authInfo.openid.well_known_uri}
		</React.Fragment>
	)
}

function OidcUserInfo(props) {
	const { oidcUser } = useReactOidc()
	const { i18n, t } = useTranslation()
	const classes = useStyles()
	if (!oidcUser) {
		return null
	}
	var date = new Date(oidcUser.expires_at*1000)
	return (
		<React.Fragment>
			<Typography variant="h5" component="h3">
				{t("Openid Provider")}
			</Typography>
			<Typography variant="body1" component="pre" className={classes.pre}>
				<WellKown />
			</Typography>
			<br />
			<Typography variant="h5" component="h3">
				{t("Access Token")}
			</Typography>
			<Typography variant="body1">
				{t("Expires at {{date}}", {date: date.toLocaleString()})}
			</Typography>
			<Typography variant="body1" component="pre" className={classes.pre}>
				{oidcUser.access_token}
			</Typography>
		</React.Fragment>
	)
}

function UserGrants(props) {
	const [{ user }, dispatch] = useStateValue()
	const classes = useStyles()

	if (user.grant === undefined) {
		return <Skeleton variant="rect" width="100%" height="8rem" />
	}
	return (
		<div style={{overflowX: "auto"}}>
			<Table>
				<TableHead>
					<TableRow className="text-secondary">
						<TableCell>Role</TableCell>
						<TableCell>Namespaces</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{Object.keys(user.grant).map((g) => (
						<GrantLine key={g} namespaces={user.grant[g]} role={g} />
					))}
				</TableBody>
			</Table>
		</div>
	)
}

function GrantLine(props) {
	if (!props.namespaces) {
		var ns = ""
	} else {
		var ns = props.namespaces.join(", ")
	}
	return (
		<TableRow>
			<TableCell>{props.role}</TableCell>
			<TableCell>{ns}</TableCell>
		</TableRow>
	)
}

export {
	User
}
