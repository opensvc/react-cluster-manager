import React, { useState, useEffect } from "react";
import EventSource from "eventsource"
import { useStateValue } from '../state.js'
import { useReactOidc } from '@axa-fr/react-oidc-context'
import { apiWhoAmI } from "../api.js";

function useClusterStatus(props) {
	const [{cstat, user}, dispatch] = useStateValue()
	const { oidcUser } = useReactOidc()

	var timer = null
	var eventSource = null
	var lastReload = 0
	var lastPatchId = 0
	var cstatRef = React.createRef()

	function stopEventSource() {
		if (eventSource === null) {
			return
		}
		clearTimeout(timer)
		eventSource.close()
		eventSource = null
	}

	function initEventSource() {
		if (eventSource !== null) {
			return
		}
		console.log("initEventSource")
		var eventSourceInitDict = {headers: {}}
		if (oidcUser) {
			eventSourceInitDict.headers.Authorization = "Bearer " + oidcUser.access_token
		}
		eventSource = new EventSource("/events", eventSourceInitDict)
		eventSource.onmessage = (e) => {
			handleEvent(e)
		}
		//eventSource.onerror = () => {
		//      stopEventSource()
		//}
		//eventSource.addEventListener("closedConnection", (e) => {
		//      stopEventSource()
		//})
	}

	function handleEvent(e) {
		if (!cstatRef.current) {
			console.log("initial cluster status fetch")
			loadCstat()
			return
		}
		var data = JSON.parse(e.data)
		console.log("event", e.data);
		if (data.kind != "patch") {
			return
		}
		try {
			if (lastPatchId && (lastPatchId+1 != data.id)) {
				console.log("broken patch chain")
				loadCstat()
				lastPatchId = data.id
				return
			}
			cstatRef.current = JSON_delta.patch(cstatRef.current, data.data)
			dispatch({
				"type": "loadCstat",
				"data": cstatRef.current
			})
			lastPatchId = data.id
			console.log("patched cluster status, id", data.id)
		} catch(e) {
			console.log("error patching cstat:", e)
			loadCstat()
			lastPatchId = data.id
		}
	}

	function loadCstat(last) {
		const now = + new Date()
		if (last && (lastReload > last)) {
			//console.log("already reloaded by another event ... drop")
			return
		}
		if ((now - lastReload) < 1000) {
			//console.log("last reload too fresh ... delay")
			timer = setTimeout(loadCstat, 1000)
			return
		}
		lastReload = now
		var headers = {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		}
		if (oidcUser) {
			headers["Authorization"] = "Bearer " + oidcUser.access_token
		}

		fetch('/daemon_status', {headers: headers})
			.then(res => res.json())
			.then((data) => {
				console.log(data)
				cstatRef.current = data
				dispatch({
					"type": "loadCstat",
					"data": data
				})
			})
			.catch(console.log)
	}

	function reset() {
		stopEventSource()
		loadCstat()
		initEventSource()
	}

	function init() {
		if (cstat.monitor === undefined) {
			loadCstat()
		}
		initEventSource()
	}

	useEffect(() => {
		init()
		return () => {
			stopEventSource()
		}
	}, [])

	return {cstat: cstat, reset: reset}
}

export default useClusterStatus

