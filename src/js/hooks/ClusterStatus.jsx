import React, { useState, useEffect, useRef } from "react"
import EventSource from "eventsource"
import "../json_delta.js"
import { useStateValue } from '../state.js'
import useUser from "./User.jsx"
import { hasAuthorizationHeader, addAuthorizationHeader } from "../api.js"

const context = {
	eventSource: null,
	timer: null,
	evtimer: null,
	cstat: null,
	lastReload: 0,
	lastPatchId: 0,
	auth: null,
}

function useClusterStatus(props) {
	const [{cstat, user, eventSourceAlive}, dispatch] = useStateValue()
	const { auth } = useUser()
	const lastDispatch = useRef(Date.now())
	const limit = 500

	function setEventSourceAlive(val) {
		dispatch({type: "setEventSourceAlive", "data": val})
	}

	function stopEventSource() {
		if (context.eventSource === null) {
			return
		}
		clearTimeout(context.timer)
		clearTimeout(context.evtimer)
		context.eventSource.close()
		context.eventSource = null
	}

	function initEventSource() {
		if (context.eventSource !== null && context.eventSource.readyState != 2) {
			return
		}
		if (!hasAuthorizationHeader(auth)) {
			return
		}
		console.log("initEventSource", context)
		var eventSourceInitDict = {headers: {}}
		eventSourceInitDict.headers = addAuthorizationHeader(eventSourceInitDict.headers, auth)
		var es = new EventSource("/events", eventSourceInitDict)
		if (es.readyState == 2) {
			return
		}
		context.eventSource = es
		setEventSourceAlive(true)
		context.eventSource.onmessage = (e) => {
			setEventSourceAlive(true)
			handleEvent(e)
		}
		context.eventSource.onerror = (e) => {
			setEventSourceAlive(false)
		}
		context.eventSource.addEventListener("closedConnection", (e) => {
			setEventSourceAlive(false)
		})
	}

	function handleEvent(e) {
		var data = JSON.parse(e.data)
		console.log("event", e.data)
		if (data.kind != "patch") {
			return
		}
		try {
			if (context.lastPatchId && (context.lastPatchId+1 != data.id)) {
				console.log("broken patch chain")
				loadCstat()
				context.lastPatchId = data.id
				return
			}
			context.cstat = JSON_delta.patch(context.cstat, data.data)
			context.evtimer = setTimeout(function() {
				if (Date.now() - lastDispatch.current >= limit) {
					dispatch({
						"type": "loadCstat",
						"data": context.cstat
					})
					lastDispatch.current = Date.now()
				}
			}, limit - (Date.now() - lastDispatch.current))

			context.lastPatchId = data.id
			console.log("patched cluster status, id", data.id)
		} catch(e) {
			console.log("error patching cstat:", e)
			loadCstat()
			context.lastPatchId = data.id
		}
	}

	async function loadCstat() {
		if (!hasAuthorizationHeader(auth)) {
			console.log("loadCstat", false, auth)
			return
		}
		const now = + new Date()
		if (context.isLoading) {
			//console.log("already reloaded by another event ... drop")
			return
		}
		if ((now - context.lastReload) < 1000) {
			console.log("last reload too fresh ... delay", context.lastReload, now, now - context.lastReload)
			context.timer = setTimeout(loadCstat, 1000)
			return
		}
		context.isLoading = true
		context.lastReload = now
		var headers = {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		}
		headers = addAuthorizationHeader(headers, auth)
		try {
			const fetcher = await fetch('/daemon_status', {headers: headers})
			const data = await fetcher.json()
			if (fetcher.status == 200) {
				context.cstat = data
				dispatch({
					"type": "loadCstat",
					"data": data
				})
			}
		} catch(e) {
			console.log("loadCstat:", e)
		} finally {
			context.isLoading = false
		}
	}

	function reset() {
		stopEventSource()
		loadCstat()
		initEventSource()
	}

	function close() {
		stopEventSource()
		dispatch({
			"type": "loadCstat",
			"data": {}
		})
	}

	function init() {
		if (!context.cstat) {
			loadCstat()
		}
		initEventSource()
	}

	useEffect(() => {
		if (!context.auth || (context.auth.access_token == auth.access_token) && (context.auth.username == auth.username)) {
			init()
		} else {
			reset()
		}
		context.auth = auth
	}, [])

	return {
		cstat: cstat,
		reset: reset,
		init: init,
		close: close,
		eventSourceAlive: eventSourceAlive,
	}
}

export default useClusterStatus

