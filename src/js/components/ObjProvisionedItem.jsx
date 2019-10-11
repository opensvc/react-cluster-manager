import React from "react";
import { useTranslation } from 'react-i18next'

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import WarningIcon from '@material-ui/icons/Warning';
import Typography from '@material-ui/core/Typography';

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
