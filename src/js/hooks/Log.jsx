import React, { useState, useEffect } from "react"
import EventSource from "eventsource"
import useUser from "./User.jsx"
import { apiFetchLogs, addAuthorizationHeader } from "../api.js"

function useLog(url) {
	const [log, _setLog] = useState(null)
	const [es, _setEs] = useState(null)
	const { auth } = useUser()
	const logRef = React.useRef(log)
	const esRef = React.useRef(es)
	const backlog_url = url + "/backlogs"
	const es_url = url + "/logs"

	const setEs = x => {
		console.log(es_url, "setEs", x)
		esRef.current = x
		_setEs(x)
	}
	const setLog = x => {
		logRef.current = x
		_setLog(x)
	}

	function getBacklog() {
		if (logRef.current !== null) {
			return
		}
		apiFetchLogs(backlog_url, {"backlog": "10k"}, (lines) => {
			setLog(lines)
		}, auth)
	}
	function initEventSource() {
		if (esRef.current) {
			return
		}
		console.log("init", es_url, "logs event source")
		var eventSourceInitDict = {headers: {}}
		if (/^\/object\//, url) {
			eventSourceInitDict.headers["o-node"] = "*"
		}
		eventSourceInitDict.headers = addAuthorizationHeader(eventSourceInitDict.headers, auth)
		var _es = new EventSource(es_url, eventSourceInitDict)
		_es.onmessage = (e) => {
			var lines = JSON.parse(e.data)
			if (logRef.current === null) {
				setLog(lines)
			} else {
				setLog([...logRef.current, ...lines].slice(-100))
			}
		}
		setEs(_es)
	}
	function stopEventSource() {
		console.log("stop", es_url, "logs event source", esRef.current)
		if (!esRef.current) {
			return
		}
		esRef.current.close()
		setEs(null)
	}

	useEffect(() => {
		getBacklog()
		initEventSource()
		return () => {
			stopEventSource()
		}
	}, [])

	return log
}

export {
	useLog
}
