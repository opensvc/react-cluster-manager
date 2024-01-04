'use strict';

import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import { useReactOidc } from "@axa-fr/react-oidc-context"
import { useTranslation } from "react-i18next"
import { useStateValue } from '../state.js'
import { useNavigate} from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { StateProvider, StateContext } from '../state.js';
import { NavBar } from "./NavBar.jsx";
import useAuthInfo from "../hooks/AuthInfo.jsx"
import AuthChoice from "./AuthChoice.jsx"
import NotAuthenticated from "./NotAuthenticated.jsx"
import NotAuthorized from "./NotAuthorized.jsx"
import Authenticating from "./Authenticating.jsx"
import oidcConfiguration from "../OidcConfiguration.js"
import Main from "./Main.jsx";
import LoginCallback from "./LoginCallback.jsx";
import Login from "./Login.jsx";
import { AuthenticationProvider, oidcLog, OidcSecure } from '@axa-fr/react-oidc-context';

import { makeStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Slide from '@mui/material/Slide';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import amber from '@mui/material/colors/amber';
import red from '@mui/material/colors/red';
import green from '@mui/material/colors/green';
import grey from '@mui/material/colors/grey';
import lightBlue from '@mui/material/colors/lightBlue';

import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/styles';
import { SnackbarProvider } from 'notistack';

const makeTheme = (data) => createTheme({
	palette: {
		type: data.theme ? data.theme : "light",
		primary: { main: (data.theme == "light") ? lightBlue[900] : lightBlue[100]},
		secondary: { main: "#ff392b" },
	},
	status: {
		up: green[500],
		danger: red[500],
		error: red[500],
		warning: amber[700],
		notapplicable: grey[500],
	},
	overrides: {
		MuiAppBar: {
			colorPrimary: lightBlue[900]
		},
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
	return (
		<AppStateProvider>
			<AppThemeProvider>
				<SnackProvider>
					<Box fontWeight={300}>
						<Router>
							<AuthProvider>
								<WrappedApp />
							</AuthProvider>
						</Router>
					</Box>
				</SnackProvider>
			</AppThemeProvider>
		</AppStateProvider>
	)
}

const AppThemeProvider = (props) => {
	const [{ theme }, dispatch] = useStateValue()
	return (
		<ThemeProvider theme={makeTheme({theme: theme})}>
			{props.children}
		</ThemeProvider>
	)
}

const SnackProvider = (props) => {
	const { t } = useTranslation()
	const notistackRef = React.createRef()
	const snackDismiss = key => () => {
		notistackRef.current.closeSnackbar(key)
	}
	const snackAction = (key) => (
		<Button onClick={snackDismiss(key)} color="inherit">
			{t("Dismiss")}
		</Button>
	)

	return (
		<SnackbarProvider maxSnack={2} ref={notistackRef} action={snackAction}>
			{props.children}
		</SnackbarProvider>
	)
}

const AppStateProvider = (props) => {
	const initialTheme = localStorage.getItem("opensvc.theme")
	const initialState = {
		theme: initialTheme ? initialTheme : "light",
		authChoice: localStorage.getItem("opensvc.authChoice"),
		cstat: {},
		user: {},
		basicLogin: {},
		alerts: [],      // ex: [{level: "warning", body: (<div>foo</div>)}],
		eventSourceAlive: false,
	}

	const reducer = (state, action) => {
		switch (action.type) {
			case 'loadUser':
				return {
					...state,
					user: action.data
				}

			case 'setEventSourceAlive':
				if (action.data == state.eventSourceAlive) {
					return state
				}
				return {
					...state,
					eventSourceAlive: action.data
				}

			case 'setBasicLogin':
				return {
					...state,
					basicLogin: action.data
				}

			case 'setAuthChoice':
				localStorage.setItem("opensvc.authChoice", action.data)
				return {
					...state,
					authChoice: action.data
				}

			case 'setTheme':
				localStorage.setItem("opensvc.theme", action.data)
				return {
					...state,
					theme: action.data
				}

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

			case 'pushAlerts':
				var new_alerts = state.alerts.concat(action.data)
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
			{props.children}
		</StateProvider>
	)
}

function AuthProvider(props) {
	const authInfo = useAuthInfo()
	const navigate = useNavigate()
	const [{ authChoice, user, basicLogin }, dispatch] = useStateValue()
	try {
		const { oidcUser } = useReactOidc()
	} catch(e) {
		var oidcUser = null
	}
	if (!authInfo) {
		return null
	}
	if ((authChoice == "basic") && (!basicLogin.username || !basicLogin.password)) {
                return <Login />
	}
	if (!authChoice && !oidcUser && location.pathname != "/authentication/callback") {
		return <AuthChoice />
	}
	if (!oidcUser && location.pathname != "/authentication/callback" && user && user.status == 401) {
		return <NotAuthorized />
	}
	try {
		var enabled = authChoice == "openid" ? true : false
	} catch(e) {
		var enabled = false
	}
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
				{props.children}
			</OidcSecure>
		</AuthenticationProvider>
	)
}

function WrappedApp(props) {
	return (
		<React.Fragment>
			<CssBaseline />
			<HideOnScroll>
				<AppBar color="default">
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
	const navigate = useNavigate()
	return (
		<Paper className={classes.root}>
			<Typography variant="h5" component="h3">
				Something went wrong.
			</Typography>
			<Button color="secondary" onClick={() => {navigate("/");props.clear()}}>
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

