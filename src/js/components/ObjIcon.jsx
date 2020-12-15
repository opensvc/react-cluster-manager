import React from "react";
import { splitPath } from "../utils.js"
import IconButton from '@material-ui/core/IconButton'
import { useColorStyles } from "../styles.js"

import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import LockOpenIcon from '@material-ui/icons/LockOpen'
import LockIcon from '@material-ui/icons/Lock'
import SaveIcon from '@material-ui/icons/Save'
import HelpIcon from '@material-ui/icons/Help'


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
