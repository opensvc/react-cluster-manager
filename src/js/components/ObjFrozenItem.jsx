import React from "react";
import { useTranslation } from 'react-i18next'

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AcUnitIcon from '@material-ui/icons/AcUnit';
import Typography from '@material-ui/core/Typography';

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
                                {t("Frozen, orchestration is disabled")}
                        </ListItemText>
                </ListItem>

	)
}

export {
	ObjFrozenItem
}
