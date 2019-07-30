import React, { useState, useEffect } from "react";
import { apiPostAny } from "../api.js";

function useNetworksStatus() {
	const [data, setData] = useState(null)

	function getData() {
		if (data !== null) {
			return
		}
		apiPostAny("/get_networks", {}, (data) => {
			setData(data)
                })
	}

	useEffect(() => {
		getData()
	}, [])

	return data
}

export {
	useNetworksStatus,
}
