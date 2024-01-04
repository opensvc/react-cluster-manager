import React, { useState } from "react";

import TextField from '@mui/material/TextField';

function NodeSelector(props) {
	const { val, setVal, defaultValue, keyword, requiredError } = props
	var _defaultValue = defaultValue ? defaultValue : ""
	var _keyword = keyword ? keyword : "nodeSelector"
	var _requiredError = requiredError !== undefined ? requiredError : false
	return (
		<TextField
			autoComplete="off"
			placeholder={_defaultValue}
                        id={_keyword}
                        error={_requiredError}
                        type="search"
			onChange={(e) => {setVal(e.target.value)}}
			value={val}
		/>
	)
}

export default NodeSelector
