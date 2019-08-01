import React from "react";
import { useStateValue } from '../state.js';

import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import LockIcon from '@material-ui/icons/Lock';
import CopyrightIcon from '@material-ui/icons/Copyright';
import SaveIcon from '@material-ui/icons/Save';

const kinds = [
	{
		name: "svc",
		icon: <FiberManualRecordIcon />,
	},
	{
		name: "vol",
		icon: <SaveIcon />,
	},
	{
		name: "cfg",
		icon: <LockOpenIcon />,
	},
	{
		name: "sec",
		icon: <LockIcon />,
	},
	{
		name: "usr",
		icon: <AccountCircleIcon />,
	},
	{
		name: "ccfg",
		requires: "root"
	},
]

function ObjKindSelector(props) {
	const [{user}, dispath] = useStateValue()
	return (
		<ToggleButtonGroup value={props.value} exclusive onChange={props.onChange}>
			{kinds.map((kind) => {
				if (kind.requires && !(kind.requires in user.grant)) {
					return null
				}
				return (
					<ToggleButton value={kind.name} key={kind.name}>
						{kind.icon}
						{kind.name}
					</ToggleButton>
				)
			})}
		</ToggleButtonGroup>
	)
}

export {
	ObjKindSelector
}
