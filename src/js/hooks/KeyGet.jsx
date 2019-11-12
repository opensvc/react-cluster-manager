import React, { useState, useEffect } from "react";
import { useReactOidc } from '@axa-fr/react-oidc-context'
import { apiGetAny } from "../api.js";

function useKeyGet(props) {
	const {path, keyName} = props
	const [data, setData] = useState(null)
	const { oidcUser } = useReactOidc()

	function getData() {
		if (data !== null) {
			return
		}
		apiGetAny("/key", {path: path, key: keyName}, ($) => {
			setData($.data)
                }, oidcUser)
	}

	useEffect(() => {
		getData()
	}, [])

	return data
}

export {
	useKeyGet,
}
