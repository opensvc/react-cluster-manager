import React from "react"
import { useTranslation } from "react-i18next"
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import RssFeedIcon from "@mui/icons-material/RssFeed"

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
				{t("This node feeds the collector.")}
                        </ListItemText>
                </ListItem>
        )
}

export {
        NodeStateSpeakerItem
}

