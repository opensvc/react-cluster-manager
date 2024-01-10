import React from "react";
import { useTranslation } from 'react-i18next'
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import WarningIcon from '@mui/icons-material/Warning';
import Typography from '@mui/material/Typography';

function ObjProvisionedItem(props) {
	const {t, i18n} = useTranslation()
	if (props.provisioned == false) {
		return (
			<ListItem>
				<ListItemIcon>
					<Typography component="span" className={props.className}>
						<WarningIcon color="error" />
					</Typography>
				</ListItemIcon>
				<ListItemText>
					{t("Not provisioned. Orchestration is disabled.")}
				</ListItemText>
			</ListItem>
		)
	} else if (props.provisioned == true) {
		return null
	} else {
		return null
	}
}

export {
	ObjProvisionedItem
}
