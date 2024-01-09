import { useState, useEffect } from "react";
import useUser from "./User.jsx"
import { apiGetAny } from "../api.js"

function useCatalogs() {
	const [data, setData] = useState([])
	const { auth } = useUser()

	function getCatalogs() {
		if (data.length > 0) {
			return
		}
                apiGetAny("/catalogs", {}, ($) => {
                        console.log("catalogs", $)
			setData($)
		}, auth)
	}
	useEffect(() => {
		getCatalogs()
	}, [])

	return data
}

export {
	useCatalogs,
}
