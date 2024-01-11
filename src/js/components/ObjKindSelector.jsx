import React from "react";
import { useStateValue } from '../state.js';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import SaveIcon from '@mui/icons-material/Save';

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
