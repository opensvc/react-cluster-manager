import React, { useState, useEffect } from "react";
import { useReactOidc } from '@axa-fr/react-oidc-context'
import { apiGetAny } from "../api.js"

function useCatalogTemplates(name) {
	const [data, setData] = useState([])
	const { oidcUser } = useReactOidc()

	function getCatalogTemplates() {
		if (data.length > 0) {
			console.log("useCatalogTemplates, already loaded")
			return
		}
		if (!name) {
			console.log("useCatalogTemplates, no name")
			return
		}
                apiGetAny("/templates", {catalog: name}, ($) => {
                        setData($)
                }, oidcUser)
	}
	getCatalogTemplates()

	return data
}

export {
	useCatalogTemplates,
}
