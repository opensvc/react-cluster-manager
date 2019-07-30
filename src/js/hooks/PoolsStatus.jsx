import React, { useState, useEffect } from "react";
import { apiPostAny } from "../api.js";

function usePoolsStatus() {
	const [data, setData] = useState(null)

	function getData() {
		if (data !== null) {
			return
		}
		apiPostAny("/get_pools", {}, (data) => {
			setData(data)
                })
	}

	useEffect(() => {
		getData()
	}, [])

	return data
}

export {
	usePoolsStatus,
}
