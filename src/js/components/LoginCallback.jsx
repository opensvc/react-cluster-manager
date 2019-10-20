import React from "react";
import { useHistory } from 'react-router'
import useClusterStatus from '../hooks/ClusterStatus.jsx'

function LoginCallback(props) {
	const history = useHistory()
	const { cstat, reset } = useClusterStatus()
	console.log("login callback")
	reset()
	return null
}

export default LoginCallback
