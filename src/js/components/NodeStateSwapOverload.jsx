import React from "react"
import { state } from "../utils.js"
import { nodeSwapOverloadIssue } from "../issues.js"
import { useTranslation } from "react-i18next"
import WarningIcon from './WarningIcon.jsx'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

function NodeStateSwapOverload(props) {
	const { t, i18n } = useTranslation()
	var issue = nodeSwapOverloadIssue(props.data)
        if (issue != state.WARNING) {
                return null
        }
        return (
		<Typography component="span" className={props.className}>
			<Tooltip title={t("Swap overload")}>
				<WarningIcon />
			</Tooltip>
		</Typography>
        )
}

export default NodeStateSwapOverload

