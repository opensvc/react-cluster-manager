import { useState, useEffect } from "react";
import useUser from "./User.jsx"
import { apiGetAny } from "../api.js"

function useKeywords(kind) {
	const [data, setData] = useState(null)
	const { auth } = useUser()

	function getKeywords() {
		console.log(kind, "keywords:", data)
		if (data !== null) {
			return
		}
		apiGetAny("/keywords", {"kind": kind}, ($) => {
			setData($)
		}, auth)
	}
	useEffect(() => {
		getKeywords()
	}, [])

	return data
}

export {
	useKeywords,
}
