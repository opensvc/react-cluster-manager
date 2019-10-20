import React, { useState, useEffect } from "react"
import { useReactOidc } from "@axa-fr/react-oidc-context"
import { apiObjGetConfig } from "../api.js"
import { useStateValue } from "../state.js"
import useClusterStatus from "../hooks/ClusterStatus.jsx"

function useObjConfig(path) {
	const [conf, setConf] = useState(null)
	const [csum, setCsum] = useState(null)
	const { cstat } = useClusterStatus()
	const { oidcUser } = useReactOidc()

	function getCsum() {
		if (!cstat.monitor) {
			return null
		}
		for (var node in cstat.monitor.nodes) {
			if (path in cstat.monitor.nodes[node].services.config) {
				return cstat.monitor.nodes[node].services.config[path].csum
			}
		}
	}
	function getConf() {
		var liveCsum = getCsum()
		if ((conf !== null) && (liveCsum == csum)) {
			return
		}
		apiObjGetConfig({path: path}, (data) => {
			console.log("load new", path, "config, csum", liveCsum)
			setCsum(liveCsum)
			setConf(data)
                }, oidcUser)
	}

	getConf()
	return conf
}

export {
	useObjConfig
}
