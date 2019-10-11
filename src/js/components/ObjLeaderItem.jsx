import React from "react";
import { useTranslation } from 'react-i18next'

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { useColorStyles } from '../styles.js'
import Typography from '@material-ui/core/Typography';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

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
