import React from "react";
import { useTranslation } from "react-i18next"
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import SkipNextIcon from "@material-ui/icons/SkipNext"

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
