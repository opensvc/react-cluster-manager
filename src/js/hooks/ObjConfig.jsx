import React, { useState, useEffect } from "react";
import { apiObjGetConfig } from "../api.js";
import { useStateValue } from '../state.js';

function useObjConfig(path) {
	const [conf, setConf] = useState(null)
	const [csum, setCsum] = useState(null)
	const [{cstat}, dispatch] = useStateValue()

	function getCsum() {
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
                })
	}

	getConf()
	return conf
}

export {
	useObjConfig
}
