import { useState, useEffect } from "react"
import useUser from "./User.jsx"
import { objectConfigChecksum } from "../utils.js"
import { apiGetAny } from "../api.js"
import useClusterStatus from "../hooks/ClusterStatus.jsx"

function useObjConfirmations(path) {
	const [data, setData] = useState([])
	const { auth } = useUser()
	const { cstat } = useClusterStatus()
	var liveCsum = objectConfigChecksum(cstat, path)

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

	useEffect(() => {
		if (!liveCsum) {
			return
		}
		getObjConfirmations()
	}, [liveCsum])

	return data
}

export default useObjConfirmations
