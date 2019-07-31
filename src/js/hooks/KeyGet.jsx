import React, { useState, useEffect } from "react";
import { apiPostAny } from "../api.js";

function useKeyGet(props) {
	const {path, keyName} = props
	const [data, setData] = useState(null)

	function getData() {
		if (data !== null) {
			return
		}
		apiPostAny("/get_key", {path: path, key: keyName}, ($) => {
			setData($.data)
                })
	}

	useEffect(() => {
		getData()
	}, [])

	return data
}

export {
	useKeyGet,
}
