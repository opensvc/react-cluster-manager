import React from "react";
import { useTranslation } from 'react-i18next'

import PlaceIcon from '@mui/icons-material/Place';
import Typography from '@mui/material/Typography';
import { ColorStyles } from "../styles.js"
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import useClasses from "../hooks/useClasses.jsx";

function ObjPlacementItem(props) {
	const { t, i18n } = useTranslation()
	const classes = useClasses(ColorStyles)
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
				{t("Placement is not optimal.")}
			</ListItemText>
		</ListItem>
	)
}

export {
	ObjPlacementItem
}
