import React, { useState, useEffect } from "react";
import { useReactOidc } from '@axa-fr/react-oidc-context'
import { apiPostAny } from "../api.js";

function useNetworksStatus() {
	const [data, setData] = useState(null)
	const { oidcUser } = useReactOidc()

	function getData() {
		if (data !== null) {
			return
		}
		apiPostAny("/get_networks", {}, (data) => {
			setData(data)
                }, oidcUser)
	}

	useEffect(() => {
		getData()
	}, [])

	return data
}

export {
	useNetworksStatus,
}
