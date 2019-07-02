'use strict';

import React, { Component } from "react";
import ReactDOM from "react-dom";
import { StateProvider, StateContext } from '../state.js';
import { parseApiResponse, apiWhoAmI } from "../api.js";
import { Alerts } from "./Alerts.jsx";
import { NavBar } from "./NavBar.jsx";
import { Main } from "./Main.jsx";

const App = () => {
	const initialState = {
		cstat: {},
		refreshQueued: false,
		filters: {
			name: "",
			namespace: "",
			path: ""
		},
		kinds:{
			svc: true,
			vol: false,
			sec: false,
			cfg: false,
			usr: false,
			ccfg: false
		},
		user: {},
		nav: {
			page: "Cluster",
			links: [],
		},
		alerts: []      // ex: [{level: "warning", body: (<div>foo</div>)}]
	}

	const reducer = (state, action) => {
		switch (action.type) {
			case 'setNav':
				return {
					...state,
					nav: {"page": action.page, "links": action.links}
				};

			case 'setFilter':
				var new_filters = {}
				new_filters[action.filter_type] = action.filter_value
				return {
					...state,
					filters: new_filters
				};

			case 'toggleKindFilter':
				var new_kinds = state.kinds
				new_kinds[action.kind] = new_kinds[action.kind] ? false : true
				return {
					...state,
					kinds: new_kinds
				};

			case 'loadUser':
				return {
					...state,
					user: action.data
				};

			case 'loadCstat':
				return {
					...state,
					cstat: action.data
				};

			case 'parseApiResponse':
				var new_alerts = state.alerts.concat(parseApiResponse(action.data))
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
	);
}

class WrappedApp extends Component {
	constructor(props) {
		super(props)
		this.timer = null
		this.eventSource = null
		this.lastReload = 0
		this.refreshQueued = false
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
                        console.log("event", e.data);
                        //var data = JSON.parse(e.data);
                        this.loadCstat()
                }
                //this.eventSource.onerror = () => {
                //      this.stopEventSource()
                //}
                //this.eventSource.addEventListener("closedConnection", (e) => {
                //      this.stopEventSource()
                //})
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
				dispatch({type: "loadCstat", data: data})
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
			<div>
				<div className="sticky-top mb-3 bg-white border-top-0 border-left-0 border-right-0 border-secondary border">
					<NavBar />
					<Alerts />
				</div>
				<Main />
			</div>
		)
	}
}

const domContainer = document.querySelector('#app');
ReactDOM.render(<App />, domContainer);

