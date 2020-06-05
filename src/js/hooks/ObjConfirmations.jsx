import React, { useState, useEffect } from "react";
import useUser from "./User.jsx"
import { apiGetAny } from "../api.js"

function useObjConfirmations(path) {
	const [data, setData] = useState([])
	const { auth } = useUser()

	function getObjConfirmations() {
		if (data.length > 0) {
			console.log("useObjConfirmations, already loaded")
			return
		}
		if (!path) {
			console.log("useObjConfirmations, no path")
			return
		}
                apiGetAny("/object_confirmations", {path: path}, ($) => {
			console.log("useObjConfirmations, set data", $.data)
                        setData($.data)
                }, auth)
	}
	getObjConfirmations()

	return data
}

export {
	useObjConfirmations,
}
