import React, { useState, useEffect } from "react";
import { useReactOidc } from '@axa-fr/react-oidc-context'
import { apiGetAny } from "../api.js";

function usePoolsStatus() {
	const [data, setData] = useState(null)
	const { oidcUser } = useReactOidc()

	function getData() {
		if (data !== null) {
			return
		}
		apiGetAny("/pools", {}, (data) => {
			setData(data)
                }, oidcUser)
	}

	useEffect(() => {
		getData()
	}, [])

	return data
}

export {
	usePoolsStatus,
}
