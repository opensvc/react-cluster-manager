import { useState, useEffect } from "react";
import useUser from "./User.jsx"
import { apiGetAny } from "../api.js";

function useKey(props) {
	const {path, keyName} = props
	const [data, setData] = useState(null)
	const { auth } = useUser()

	function getData() {
		if (data !== null) {
			return
		}
		apiGetAny("/key", {path: path, key: keyName}, ($) => {
			setData($.data)
                }, auth)
	}

	useEffect(() => {
		getData()
	}, [])

	return [data, setData]
}

function useKeyGet(props) {
	return useKey(props)[0]
}

export {
	useKeyGet,
	useKey,
}
