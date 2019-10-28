import React, { useState, useEffect, useRef } from "react"
import { useStateValue } from '../state.js'
import { useReactOidc } from '@axa-fr/react-oidc-context'

function useDaemonStats(props) {
	const [{user}, dispatch] = useStateValue()
	const { oidcUser } = useReactOidc()
	const [ series, setSeries ]  = useState({last: null, prev: null})
	const [ playing, setPlaying ]  = useState(true)
	const playingRef = useRef(playing)
	const seriesRef = useRef(series)
	const timerRef = useRef(null)

	var period = props && props.period ? props.period : 3000
	var node = props && props.node ? props.node : "*"

	function play() {
		playingRef.current = true
		setPlaying(true)
	}

	function pause() {
		playingRef.current = false
		setPlaying(false)
	}

	function loop() {
		fetchStats()
		timerRef.current = setTimeout(function() {
			loop()
		}, period)
	}

	function fetchStats() {
		if (!playingRef.current) {
			return
		}
		var options = {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				"o-node": node,
			}
		}
		if (oidcUser) {
			options.headers.Authorization = "Bearer " + oidcUser.access_token
		}
		try {
			fetch('/daemon_stats', options)
				.then(res => res.json())
				.then((data) => {
					if (data.error) {
						return
					}
					setSeries({
						prev: seriesRef.current.last,
						last: data
					})
					seriesRef.current = {
						prev: seriesRef.current.last,
						last: data,
					}
				})
				.catch(console.log)
		} catch(e) {
			console.log(e)
		}
	}

	function start() {
		if (timerRef.current) {
			return
		}
		loop()
	}

	function stop() {
		if (!timerRef.current) {
			return
		}
		clearTimeout(timerRef.current)
		timerRef.current = null
	}

	useEffect(() => {
		start()
		return () => {
			stop()
		}
	}, [])

	return {
		last: series.last,
		prev: series.prev,
		pause: pause,
		play: play,
		playing: playing,
	}
}

export default useDaemonStats

