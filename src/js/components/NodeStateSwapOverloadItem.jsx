import React from "react"
import { state } from "../utils.js"
import { nodeSwapOverloadIssue } from "../issues.js"
import { useTranslation } from "react-i18next"
import { useStateValue } from '../state.js'
import WarningIcon from './WarningIcon.jsx'
import Typography from '@mui/material/Typography'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'

function NodeStateSwapOverloadItem(props) {
	const { t, i18n } = useTranslation()
	const [{ cstat }, dispatch] = useStateValue()
	var issue = nodeSwapOverloadIssue(props.data)
        if (issue != state.WARNING) {
                return null
        }
        return (
                <ListItem>
                        <ListItemIcon>
                                <WarningIcon />
                        </ListItemIcon>
                        <ListItemText>
				{t("Swap overload. Orchestration is disabled.")}
                        </ListItemText>
                </ListItem>
        )
}

export default NodeStateSwapOverloadItem

