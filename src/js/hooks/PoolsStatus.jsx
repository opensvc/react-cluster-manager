import { useState, useEffect } from "react";
import useUser from "./User.jsx"
import { apiGetAny } from "../api.js";
import {useStateValue} from "../state";

function usePoolsStatus() {
    const [{authenticated}] = useStateValue()
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
        if (authenticated) {getData()}
    }, [authenticated])

	return data
}

export {
	usePoolsStatus,
}
