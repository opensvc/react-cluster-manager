import React from "react"
import { state } from "../utils.js"
import { compatIssue } from "../issues.js";
import { useTranslation } from "react-i18next"
import { useStateValue } from '../state.js';
import Typography from '@material-ui/core/Typography'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import RssFeedIcon from "@material-ui/icons/RssFeed"

function NodeStateCompatItem(props) {
	const { t, i18n } = useTranslation()
	const [{ cstat }, dispatch] = useStateValue()
	var cissue = compatIssue(cstat)
        if (cissue == state.OPTIMAL) {
                return null
        }
        return (
                <ListItem>
                        <ListItemIcon>
                                <ErrorIcon color="secondary" />
                        </ListItemIcon>
                        <ListItemText>
				{t("Nodes run incompatible versions. Orchestration is disabled.")}
                        </ListItemText>
                </ListItem>
        )
}

export {
        NodeStateCompatItem
}

