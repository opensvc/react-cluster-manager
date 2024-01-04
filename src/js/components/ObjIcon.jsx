import React from "react";
import { splitPath } from "../utils.js"
import IconButton from '@mui/material/IconButton'
import { useColorStyles } from "../styles.js"

import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import LockIcon from '@mui/icons-material/Lock'
import SaveIcon from '@mui/icons-material/Save'
import HelpIcon from '@mui/icons-material/Help'


function icon(kind, className) {
	const icons = {
		"svc": <FiberManualRecordIcon className={className} />,
		"vol": <SaveIcon className={className} />,
		"cfg": <LockOpenIcon className={className} />,
		"sec": <LockIcon className={className} />,
		"usr": <AccountCircleIcon className={className} />,
	}
	let _icon = icons[kind]
	if (_icon) {
		return _icon
	}
	return <HelpIcon className={className} />
}

function ObjIcon(props) {
	const { path, kind, avail } = props
	const classes = useColorStyles()

	if (kind) {
		var k = kind
	} else {
		var sp = splitPath(path)
		var k = sp.kind
	}
	return icon(k, classes[avail])
}

export default ObjIcon
