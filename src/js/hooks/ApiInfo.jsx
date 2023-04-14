import React, { useState, useEffect } from "react";
import useUser from "./User.jsx"
import { apiGetAny } from "../api.js";

function useApiInfo(props) {
	const [data, setData] = useState()
	const { auth } = useUser()
	function getData() {
		if (data !== undefined) {
			return
		}
		apiGetAny("/api", {}, ($) => {
			setData($)
                }, auth)
	}

	useEffect(() => {
		getData()
	}, [])
	return data
}

export default useApiInfo
