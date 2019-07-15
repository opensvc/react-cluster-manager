import React, { useState, useEffect } from "react";
import { apiObjGetConfig } from "../api.js";

function useObjConfig(path) {
	const [conf, setConf] = useState(null)

	function getConf() {
		if (conf !== null) {
			return
		}
		apiObjGetConfig({path: path}, (data) => {
			setConf(data)
                })
	}

	useEffect(() => {
		getConf()
	}, [])

	return conf
}

export {
	useObjConfig
}
