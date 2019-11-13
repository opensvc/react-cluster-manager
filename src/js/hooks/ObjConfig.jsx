import React, { useState, useEffect } from "react"
import { useReactOidc } from "@axa-fr/react-oidc-context"
import { apiObjGetConfig } from "../api.js"
import { useStateValue } from "../state.js"
import useClusterStatus from "../hooks/ClusterStatus.jsx"

function useObjConfig(path) {
	const [conf, setConf] = useState(null)
	const { cstat } = useClusterStatus()
	const { oidcUser } = useReactOidc()
	var liveCsum = getCsum()

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
		apiObjGetConfig({path: path}, (data) => {
			console.log("load new", path, "config, csum", liveCsum)
			setConf(data)
                }, oidcUser)
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
