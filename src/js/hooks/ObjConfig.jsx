import React, { useState, useEffect } from "react"
import useUser from "./User.jsx"
import { apiObjGetConfig } from "../api.js"
import { objectConfigChecksum } from "../utils.js"
import { useStateValue } from "../state.js"
import useClusterStatus from "../hooks/ClusterStatus.jsx"

function useObjConfig(path) {
	const [conf, setConf] = useState(null)
	const { cstat } = useClusterStatus()
	const { auth } = useUser()
	var liveCsum = objectConfigChecksum(cstat, path)

	function getConf() {
		apiObjGetConfig({path: path}, (data) => {
			console.log("load new", path, "config, csum", liveCsum)
			setConf(data)
                }, auth)
	}

	useEffect(() => {
		if (!liveCsum) {
			return
		}
		getConf()
	}, [liveCsum])
	return conf
}

export {
	useObjConfig
}
