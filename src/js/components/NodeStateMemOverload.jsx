import React from "react"
import { state } from "../utils.js"
import { nodeMemOverloadIssue } from "../issues.js"
import { useTranslation } from "react-i18next"
import { useStateValue } from '../state.js'
import WarningIcon from './WarningIcon.jsx'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'

function NodeStateMemOverload(props) {
	const { t, i18n } = useTranslation()
	const [{ cstat }, dispatch] = useStateValue()
	var issue = nodeMemOverloadIssue(props.data)
        if (issue != state.WARNING) {
                return null
        }
        return (
		<Typography component="span" className={props.className}>
			<Tooltip title={t("Memory overload")}>
				<WarningIcon />
			</Tooltip>
		</Typography>
        )
}

export default NodeStateMemOverload

