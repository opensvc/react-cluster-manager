import React from "react";
import useClusterStatus from '../hooks/ClusterStatus.jsx'
import { useStateValue } from "../state.js"

function LoginCallback(props) {
	const { cstat, reset } = useClusterStatus()
	const [{ authChoice }, dispatch] = useStateValue()
	console.log("login callback")
	reset()
	if (authChoice != "openid") {
		dispatch({type: "setAuthChoice", data: "openid"})
	}
	return null
}

export default LoginCallback
