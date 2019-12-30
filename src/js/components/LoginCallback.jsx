import React from "react";
import useClusterStatus from '../hooks/ClusterStatus.jsx'
import { useStateValue } from "../state.js"

function LoginCallback(props) {
	const { close } = useClusterStatus()
	const [{ authChoice }, dispatch] = useStateValue()
	console.log("login callback")
	if (authChoice != "openid") {
		dispatch({type: "setAuthChoice", data: "openid"})
	}
	close()
	return null
}

export default LoginCallback
