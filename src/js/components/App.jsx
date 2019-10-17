'use strict';

import React, { Component } from "react";
import ReactDOM from "react-dom";
import { useHistory } from 'react-router';
import { BrowserRouter as Router } from 'react-router-dom';
import { useStateValue, StateProvider, StateContext } from '../state.js';
import { apiPostAny, parseApiResponse, apiWhoAmI } from "../api.js";
import { NavBar } from "./NavBar.jsx";
import { Main } from "./Main.jsx";
import "../json_delta.js"

import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
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
	return (
		<SnackbarProvider maxSnack={3}>
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
		refreshQueued: false,
		user: {},
		nav: {
			page: "Cluster",
			links: [],
		},
		alerts: [],      // ex: [{level: "warning", body: (<div>foo</div>)}],
		logEventSources: {},
		logs: {},
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
				if (document.title != action.data.cluster.name) {
					document.title = action.data.cluster.name
				}
				return {
					...state,
					cstat: action.data
				};

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
			<WrappedApp />
		</StateProvider>
	)
}

class WrappedApp extends Component {
	constructor(props) {
		super(props)
		this.timer = null
		this.eventSource = null
		this.lastReload = 0
		this.lastPatchId = 0
		this.refreshQueued = false
		this.cstatRef = React.createRef()
	}
	static contextType = StateContext

	stopEventSource() {
                clearTimeout(this.timer)
                this.eventSource.close()
                this.eventSource = null
        }

        initEventSource() {
                if (this.eventSource !== null) {
                        return
                }
                console.log("initEventSource")
                this.eventSource = new EventSource("/events")
                this.eventSource.onmessage = (e) => {
			this.handleEvent(e)
                }
                //this.eventSource.onerror = () => {
                //      this.stopEventSource()
                //}
                //this.eventSource.addEventListener("closedConnection", (e) => {
                //      this.stopEventSource()
                //})
        }

	handleEvent(e) {
		const [{}, dispatch] = this.context
		if (!this.cstatRef.current) {
			console.log("initial cluster status fetch")
			this.loadCstat()
			return
		}
		var data = JSON.parse(e.data)
		console.log("event", e.data);
		if (data.kind != "patch") {
			return
		}
		try {
			if (this.lastPatchId && (this.lastPatchId+1 != data.id)) {
				console.log("broken patch chain")
				this.loadCstat()
				this.lastPatchId = data.id
				return
			}
			this.cstatRef.current = JSON_delta.patch(this.cstatRef.current, data.data)
			dispatch({
				"type": "loadCstat",
				"data": this.cstatRef.current
			})
			this.lastPatchId = data.id
			console.log("patched cluster status, id", data.id)
		} catch(e) {
			console.log("error patching cstat:", e)
			this.loadCstat()
			this.lastPatchId = data.id
		}
	}

	loadCstat(last) {
		const now = + new Date()
		const [{}, dispatch] = this.context
		if (last && (this.lastReload > last)) {
			//console.log("already reloaded by another event ... drop")
			return
		}
		if ((now - this.lastReload) < 1000) {
			//console.log("last reload too fresh ... delay")
			var fn = this.loadCstat.bind(this, now)
			this.refreshQueued = true
			this.timer = setTimeout(fn, 1000)
			return
		}
		this.lastReload = now
		this.refreshQueued = false
		fetch('/daemon_status')
			.then(res => res.json())
			.then((data) => {
				console.log(data)
				this.cstatRef.current = data
				dispatch({
					"type": "loadCstat",
					"data": data
				})
			})
			.catch(console.log)
	}
	loadUser() {
		const [{}, dispatch] = this.context
		apiWhoAmI(data => {
			console.log("I am", data)
			dispatch({
				type: "loadUser",
				data: data
			})
		})
	}

	componentDidMount() {
		this.loadCstat()
		this.loadUser()
		this.initEventSource()
	}
	componentWillUnmount() {
		this.stopEventSource()
	}
	componentDidUpdate(prevProps, prevState) {
	}
	render() {

		return (
			<Router>
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
			</Router>
		)
	}
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

