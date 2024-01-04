import React from "react";
import { useTranslation } from 'react-i18next'

import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import Typography from '@mui/material/Typography';

function ObjFrozenItem(props) {
	const {t, i18n} = useTranslation()
	if (!props.frozen) {
		return null
	} else if (props.frozen == "thawed") {
		return null
	}
	return (
                <ListItem>
                        <ListItemIcon>
				<Typography component="span" className={props.className}>
					<AcUnitIcon color="primary" title="Frozen" />
				</Typography>
                        </ListItemIcon>
                        <ListItemText>
                                {t("Frozen. Orchestration is disabled.")}
                        </ListItemText>
                </ListItem>

	)
}

export {
	ObjFrozenItem
}
