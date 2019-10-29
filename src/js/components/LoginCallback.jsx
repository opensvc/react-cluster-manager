import React from "react";
import useClusterStatus from '../hooks/ClusterStatus.jsx'
import useDaemonStats from "../hooks/DaemonStats.jsx"

function LoginCallback(props) {
	const { cstat, reset } = useClusterStatus()
	const { stop } = useDaemonStats()
	console.log("login callback")
	reset()
	stop()
	return null
}

export default LoginCallback
