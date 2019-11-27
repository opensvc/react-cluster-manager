import React, { useState, useEffect } from "react";
import useUser from "./User.jsx"
import { apiGetAny } from "../api.js";

function usePoolsStatus() {
	const [data, setData] = useState(null)
	const { auth } = useUser()

	function getData() {
		if (data !== null) {
			return
		}
		apiGetAny("/pools", {}, (data) => {
			setData(data)
                }, auth)
	}

	useEffect(() => {
		getData()
	}, [])

	return data
}

export {
	usePoolsStatus,
}
