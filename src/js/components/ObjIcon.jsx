import React from "react";
import { splitPath } from "../utils.js"
import IconButton from '@material-ui/core/IconButton'

import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import LockOpenIcon from '@material-ui/icons/LockOpen'
import LockIcon from '@material-ui/icons/Lock'
import SaveIcon from '@material-ui/icons/Save'
import HelpIcon from '@material-ui/icons/Help'

const icons = {
	"svc": <FiberManualRecordIcon />,
	"vol": <SaveIcon />,
	"cfg": <LockOpenIcon />,
	"sec": <LockIcon />,
	"usr": <AccountCircleIcon />,
}

export default function ObjIcon(props) {
	const { path, kind } = props
	if (kind) {
		var k = kind
	} else {
		var sp = splitPath(path)
		var k = sp.kind
	}
	var icon = icons[k]
	if (icon) {
		return icon
	}
	return <HelpIcon />
}


