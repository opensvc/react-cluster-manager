import React, { useState, useEffect, useRef } from "react"
import EventSource from "eventsource"
import "../json_delta.js"
import { useStateValue } from '../state.js'
import useUser from "./User.jsx"
import { addAuthorizationHeader } from "../api.js"

const context = {
	eventSource: null,
	timer: null,
	evtimer: null,
	cstat: null,
	lastReload: 0,
	lastPatchId: 0,
}

function useClusterStatus(props) {
	const [{cstat, user}, dispatch] = useStateValue()
	const { auth } = useUser()
	const lastDispatch = useRef(Date.now())
	const limit = 500

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
		if (context.eventSource !== null) {
			return
		}
		console.log("initEventSource", context)
		var eventSourceInitDict = {headers: {}}
		eventSourceInitDict.headers = addAuthorizationHeader(eventSourceInitDict.headers, auth)
		context.eventSource = new EventSource("/events", eventSourceInitDict)
		context.eventSource.onmessage = (e) => {
			handleEvent(e)
		}
		//context.eventSource.onerror = () => {
		//      stopEventSource()
		//}
		//context.eventSource.addEventListener("closedConnection", (e) => {
		//      stopEventSource()
		//})
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
			console.log(data)
			context.cstat = data
			dispatch({
				"type": "loadCstat",
				"data": data
			})
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

	function init() {
		if (!context.cstat) {
			loadCstat()
		}
		initEventSource()
	}

	useEffect(() => {
		init()
	}, [])

	return {cstat: cstat, reset: reset, init: init}
}

export default useClusterStatus

