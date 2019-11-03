import React from "react"
import { useStateValue } from '../state.js'
import { useSnackbar } from 'notistack';
import { parseApiResponse } from "../api.js";

function useApiResponse(props) {
	const { enqueueSnackbar, closeSnackbar } = useSnackbar()
	const [{}, dispatch] = useStateValue()

	function dispatchAlerts(data) {
		console.log(1, data)
		//var alerts = parseApiResponse(data.data, data.ok)
		var alerts = parseApiResponse(data.data, true)
		console.log(2, alerts)
		for (var a of alerts) {
			console.log(3, a)
			enqueueSnackbar(a.body, {variant: a.level})
		}
		console.log(4, a)
		dispatch({type: "pushAlerts", data: alerts})
	}
	return {
		dispatchAlerts: dispatchAlerts,
	}
}

export default useApiResponse
