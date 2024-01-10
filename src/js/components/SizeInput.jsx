import React from "react";
import TextField from '@mui/material/TextField';

function SizeInput(props) {
	const {setVal, val, requiredError} = props

	function error(val) {
		var u
		const units = [
			'', 'k', 'm', 'g', 't', 'p', 'e',
			'b', 'kb', 'mb', 'gb', 'tb', 'pb', 'eb',
			'ki', 'mi', 'gi', 'ti', 'pi', 'ei',
			'kib', 'mib', 'gib', 'tib', 'pib', 'eib'
		]

		if ((val === undefined) || (val == "") || (val == null)) {
			return requiredError
		}

		var c = val.split(/([0-9\.]+)/)

		if (c.length != 3)  {
			return true
		}

		if (c[0].trim() != "") {
			return true
		}

		if (c[2] == "") {
			u = units[0]
		}
		else {
			u = c[2].trim()
		}

		if (units.indexOf(u) > -1) {
			return false
		}
		return true
	}

	return (
		<TextField
			value={val}
			error={error(val)}
			onChange={(e) => {setVal(e.target.value)}}
		/>
	)
}

export default SizeInput


