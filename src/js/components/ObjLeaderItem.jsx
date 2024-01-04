import React from "react";
import { useTranslation } from 'react-i18next'

import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { useColorStyles } from '../styles.js'
import Typography from '@mui/material/Typography';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

function ObjLeaderItem(props) {
	const classes = useColorStyles()
	const {t, i18n} = useTranslation()
	if (props.placement != "leader") {
		return null
	}
	return (
                        <ListItem>
                                <ListItemIcon>
					<Typography component="span" color="primary">
						<KeyboardArrowUpIcon />
					</Typography>
                                </ListItemIcon>
                                <ListItemText>
                                        {t("Placement leader.")}
                                </ListItemText>
                        </ListItem>
	)
}

export {
	ObjLeaderItem
}
