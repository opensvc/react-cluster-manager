import React from "react"
import { state } from "../utils.js"
import { compatIssue } from "../issues.js";
import { useTranslation } from "react-i18next"
import { useStateValue } from '../state.js';
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ErrorIcon from "./ErrorIcon.jsx"

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
                                <ErrorIcon />
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

