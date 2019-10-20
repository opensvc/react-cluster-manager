import React, { useState, useEffect } from "react";
import { useReactOidc } from '@axa-fr/react-oidc-context'
import { apiPostAny } from "../api.js"

function useKeywords(kind) {
	const [data, setData] = useState(null)
	const { oidcUser } = useReactOidc()

	function getKeywords() {
		console.log(kind, "keywords:", data)
		if (data !== null) {
			return
		}
		apiPostAny("/get_keywords", {"kind": kind}, ($) => {
			setData($)
		}, oidcUser)
	}
	useEffect(() => {
		getKeywords()
	}, [])

	return data
}

export {
	useKeywords,
}
