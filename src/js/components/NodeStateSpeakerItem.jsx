import React from "react"
import { useTranslation } from "react-i18next"
import Typography from '@material-ui/core/Typography'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import RssFeedIcon from "@material-ui/icons/RssFeed"

function NodeStateSpeakerItem(props) {
	const { t, i18n } = useTranslation()
        if (!props.speaker) {
                return null
        }
        return (
                <ListItem>
                        <ListItemIcon>
                                <RssFeedIcon color="action" />
                        </ListItemIcon>
                        <ListItemText>
				{t("This node feeds the collector")}
                        </ListItemText>
                </ListItem>
        )
}

export {
        NodeStateSpeakerItem
}

