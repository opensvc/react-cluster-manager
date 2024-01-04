import React, {useState} from "react";

import TextField from '@mui/material/TextField';

function JsonInput(props) {
	const {setVal, val, requiredError} = props
	const [_val, _setVal] = useState(val)

	function error(val) {
		try {
			JSON.parse(_val)
			return false
		} catch(e) {
			return true
		}
	}
	function handleChange(e) {
		_setVal(e.target.value)
		try {
			var data = JSON.parse(e.target.value)
			setVal(data)
		} catch(e) {
		}
	}

	return (
		<TextField
			multiline={true}
			rows={1}
			rowsMax={12}
			value={_val}
			error={error(val)}
			onChange={handleChange}
		/>
	)
}

export default JsonInput


