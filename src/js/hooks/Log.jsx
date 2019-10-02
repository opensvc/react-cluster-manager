import React, { useState, useEffect } from "react";
import { apiFetchLogs } from "../api.js"

function useLog(url) {
	const [log, _setLog] = useState(null)
	const [es, setEs] = useState(null)
	const logRef = React.useRef(log)

	const setLog = x => {
		logRef.current = x
		_setLog(x)
	}

	function getBacklog() {
		if (logRef.current !== null) {
			return
		}
		let _url = url + "/backlogs"
		apiFetchLogs(_url, {"backlog": "10k"}, (lines) => {
			setLog(lines)
		})
	}
	function initEventSource() {
		if (es !== null) {
			return
		}
		let _url = url + "/logs"
		console.log("init", _url, "logs event source")
		var _es = new EventSource(_url)
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
		let _url = url + "/logs"
		console.log("stop", _url, "logs event source")
		if (!es) {
			return
		}
		es.close()
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
