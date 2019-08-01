import React, { useState, useEffect } from "react";
import { apiPostAny } from "../api.js"

function useCatalogs() {
	const [data, setData] = useState([])

	function getCatalogs() {
		if (data.length > 0) {
			return
		}
                apiPostAny("/get_catalogs", {}, ($) => {
                        console.log("catalogs", $)
			setData($)
		})
	}
	useEffect(() => {
		getCatalogs()
	}, [])

	return data
}

export {
	useCatalogs,
}
