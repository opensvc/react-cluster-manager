import React from "react";
import { useTranslation } from 'react-i18next'

import { useColorStyles } from '../styles.js'
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

function ObjAvailItem(props) {
	const {t, i18n} = useTranslation()
	const classes = useColorStyles()
	const states = {
		"up": "Available",
		"down": "Unavailable",
		"stdby up": "Standby",
		"stdby down": "Standby Down",
		"undef": "Availability is undefined",
		"warn": "Warning",
	}
	var state = states[props.avail]
	if (!state) {
		return null
	}
	var text = t(state)
	return (
		<ListItem>
			<ListItemIcon>
				<Typography component="span" className={clsx(props.className, classes[props.avail])}>
					<FiberManualRecordIcon />
				</Typography>
			</ListItemIcon>
			<ListItemText>
				{text}
			</ListItemText>
		</ListItem>
	)
}

export {
	ObjAvailItem
}
