import React from "react";
import { useTranslation } from "react-i18next"
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import SkipNextIcon from "@mui/icons-material/SkipNext"

function MonitorTargetBadgeItem(props) {
	const { t, i18n } = useTranslation()
	if (!props.target) {
		return null
	}
        return (
                <ListItem>
                        <ListItemIcon>
                                <SkipNextIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText>
                                {t("Target state is {{state}}.", {state: props.target})}
                        </ListItemText>
                </ListItem>
        )
}

export {
	MonitorTargetBadgeItem
}
