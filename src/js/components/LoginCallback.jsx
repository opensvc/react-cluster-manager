import React from "react";
import useClusterStatus from '../hooks/ClusterStatus.jsx'

function LoginCallback(props) {
	const { cstat, reset } = useClusterStatus()
	console.log("login callback")
	reset()
	return null
}

export default LoginCallback
