'use strict';

import React, { Component } from "react";
import ReactDOM from "react-dom";
import { useTranslation } from "react-i18next"
import { useHistory } from 'react-router';
import { BrowserRouter as Router } from 'react-router-dom';
import { StateProvider, StateContext } from '../state.js';
import { parseApiResponse, apiWhoAmI } from "../api.js";
import { NavBar } from "./NavBar.jsx";
import useAuthInfo from "../hooks/AuthInfo.jsx"
import NotAuthenticated from "./NotAuthenticated.jsx"
import NotAuthorized from "./NotAuthorized.jsx"
import Authenticating from "./Authenticating.jsx"
import oidcConfiguration from "../OidcConfiguration.js"
import Main from "./Main.jsx";
import LoginCallback from "./LoginCallback.jsx";
import { AuthenticationProvider, oidcLog, OidcSecure } from '@axa-fr/react-oidc-context';

import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Slide from '@material-ui/core/Slide';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import amber from '@material-ui/core/colors/amber';
import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';
import grey from '@material-ui/core/colors/grey';

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { SnackbarProvider } from 'notistack';
import { useSnackbar } from 'notistack';

const theme = createMuiTheme({
	palette: {
		primary: { main: "#0c6d9c" },
		secondary: { main: "#ff392b" },
	},
	status: {
		up: green[500],
		danger:  red[500],
		error:  red[500],
		warning: amber[700],
		notapplicable: grey[500],
	},
	typography: {
		fontWeight: 300,
		fontWeightLight: 200,
		fontWeightRegular: 300,
		fontWeightMedium: 400,
	},
})

function HideOnScroll(props) {
	const trigger = useScrollTrigger({ target: window });
	return (
		<Slide appear={false} direction="down" in={!trigger}>
			{props.children}
		</Slide>
	);
}

HideOnScroll.propTypes = {
	children: PropTypes.node.isRequired,
};

const useStyles = makeStyles(theme => ({
	root: {
		padding: theme.spacing(3, 2),
		marginTop: theme.spacing(3),
	}
}))

const App = () => {
	const { t } = useTranslation()
	const notistackRef = React.createRef()
	const onClickDismiss = key => () => {
		notistackRef.current.closeSnackbar(key)
	}
	const action = (key) => (
		<Button onClick={onClickDismiss(key)} color="inherit">
			{t("Dismiss")}
		</Button>
	)

	return (
		<SnackbarProvider maxSnack={2} ref={notistackRef} action={action}>
			<ThemeProvider theme={theme}>
				<Box fontWeight={300}>
					<StatefulApp />
				</Box>
			</ThemeProvider>
		</SnackbarProvider>
	)
}

const StatefulApp = () => {
	const initialState = {
		cstat: {},
		user: {},
		alerts: [],      // ex: [{level: "warning", body: (<div>foo</div>)}],
	}
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

	const reducer = (state, action) => {
		switch (action.type) {
			case 'loadUser':
				return {
					...state,
					user: action.data
				};

			case 'loadCstat':
				if (action.data.cluster === undefined) {
					return state
				}
				if (document.title != action.data.cluster.name) {
					document.title = action.data.cluster.name
				}
				return {
					...state,
					cstat: action.data,
				}

			case 'parseApiResponse':
				//var alerts = parseApiResponse(action.data, action.ok)
				var alerts = parseApiResponse(action.data, true)
				for (var a of alerts) {
					enqueueSnackbar(a.body, {variant: a.level})
				}
				var new_alerts = state.alerts.concat(alerts)
				return {
					...state,
					alerts: new_alerts
				}

			case 'pushAlert':
				var new_alerts = state.alerts
				action.data.date = new Date()
				new_alerts.push(action.data)
				return {
					...state,
					alerts: new_alerts
				}

			case 'closeAlert':
				var new_alerts = state.alerts
				new_alerts.splice(action.i, 1)
				return {
					...state,
					alerts: new_alerts
				}

			default:
				return state;
		}
	};

	return (
		<StateProvider initialState={initialState} reducer={reducer}>
			<RoutedApp />
		</StateProvider>
	)
}

function RoutedApp(props) {
	return (
		<Router>
			<AuthenticatedApp />
		</Router>
	)
}

function AuthenticatedApp(props) {
	const authInfo = useAuthInfo()
	if (!authInfo) {
		return null
	}
	try {
		var enabled = authInfo.openid.well_known_uri ? true : false
	} catch(e) {
		var enabled = false
	}
	console.log("oidc enabled:", enabled)
	return (
		<AuthenticationProvider
			configuration={oidcConfiguration(authInfo)}
			loggerLevel={oidcLog.DEBUG}
			notAuthenticated={NotAuthenticated}
			notAuthorized={NotAuthorized}
			authenticating={Authenticating}
			callbackComponentOverride={LoginCallback}
			isEnabled={enabled}
		>
			<OidcSecure>
				<WrappedApp />
			</OidcSecure>
		</AuthenticationProvider>
	)
}

function WrappedApp(props) {
	return (
		<React.Fragment>
			<CssBaseline />
			<HideOnScroll>
				<AppBar>
					<NavBar />
				</AppBar>
			</HideOnScroll>
			<Toolbar />
			<Container>
				<ErrorBoundary>
					<Main />
				</ErrorBoundary>
			</Container>
		</React.Fragment>
	)
}

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			errorInfo: null,
		}
	}
	static contextType = StateContext

	componentDidCatch(error, info) {
		// You can also log the error to an error reporting service
		//console.log("xx", error, info);
		this.setState({
			error: error,
			errorInfo: info
		})
	}

	handleResetButtonClick = () => {
		const [{}, dispatch] = this.context
		this.setState(prevState => ({
			error: null,
			errorInfo: null,
		}))
	}

	render() {
		if (!this.state.error) {
			return this.props.children;
		}
		return <AppError error={this.state.error} info={this.state.errorInfo} clear={this.handleResetButtonClick} />
	}
}

function AppError(props) {
	const classes = useStyles()
	const history = useHistory()
	return (
		<Paper className={classes.root}>
			<Typography variant="h5" component="h3">
				Something went wrong.
			</Typography>
			<Button color="secondary" onClick={() => {history.push("/");props.clear()}}>
				Clear
			</Button>
			<br />
			<details style={{ whiteSpace: 'pre-wrap' }}>
				{props.error && props.error.toString()}
				<br />
				{props.info.componentStack}
			</details>
		</Paper>
	)
}


const domContainer = document.querySelector('#app');
ReactDOM.render(<App />, domContainer);

