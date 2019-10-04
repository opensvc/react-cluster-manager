import React from "react";
import { useTranslation } from 'react-i18next'

import PlaceIcon from '@material-ui/icons/Place';
import Typography from '@material-ui/core/Typography';
import { useColorStyles } from "../styles.js"
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

function ObjPlacementItem(props) {
	const { t, i18n } = useTranslation()
	const classes = useColorStyles()
	if (props.placement == "optimal") {
		return null
	} else if (props.placement == "n/a") {
		return null
	} else if (!props.placement) {
		return null
	}
	return (
		<ListItem>
			<ListItemIcon>
				<Typography component="span" className={props.className}>
					<PlaceIcon className={classes.warning} title={"Placement "+props.placement} />
				</Typography>
			</ListItemIcon>
			<ListItemText>
				{t("Placement is not optimal")}
			</ListItemText>
		</ListItem>
	)
}

export {
	ObjPlacementItem
}
