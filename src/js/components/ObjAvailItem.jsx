import React from "react";
import { useTranslation } from 'react-i18next'

import { useColorStyles } from '../styles.js'
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

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
