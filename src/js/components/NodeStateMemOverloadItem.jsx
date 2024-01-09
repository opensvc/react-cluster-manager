import React from "react"
import { state } from "../utils.js"
import { nodeMemOverloadIssue } from "../issues.js"
import { useTranslation } from "react-i18next"
import { useStateValue } from '../state.js'
import WarningIcon from './WarningIcon.jsx'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'

function NodeStateMemOverloadItem(props) {
	const { t, i18n } = useTranslation()
	const [{ cstat }, dispatch] = useStateValue()
	var issue = nodeMemOverloadIssue(props.data)
        if (issue != state.WARNING) {
                return null
        }
        return (
                <ListItem>
                        <ListItemIcon>
                                <WarningIcon />
                        </ListItemIcon>
                        <ListItemText>
				{t("Memory overload. Orchestration is disabled.")}
                        </ListItemText>
                </ListItem>
        )
}

export default NodeStateMemOverloadItem

