import React, { useState, useEffect } from "react";
import useUser from "./User.jsx"
import { apiGetAny } from "../api.js"

function useCatalogTemplates(name) {
	const [data, setData] = useState([])
	const { auth } = useUser()

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
                }, auth)
	}
	getCatalogTemplates()

	return data
}

export {
	useCatalogTemplates,
}
