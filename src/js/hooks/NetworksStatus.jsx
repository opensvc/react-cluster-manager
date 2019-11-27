import React, { useState, useEffect } from "react";
import useUser from "./User.jsx"
import { apiGetAny } from "../api.js";

function useNetworksStatus() {
	const [data, setData] = useState(null)
	const { auth } = useUser()

	function getData() {
		if (data !== null) {
			return
		}
		apiGetAny("/networks", {}, (data) => {
			setData(data)
                }, auth)
	}

	useEffect(() => {
		getData()
	}, [])

	return data
}

export {
	useNetworksStatus,
}
