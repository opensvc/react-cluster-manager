import React from "react"
import { useTranslation } from "react-i18next"

import { useColorStyles } from "../styles.js"
import Typography from "@material-ui/core/Typography"
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp"
import Tooltip from "@material-ui/core/Tooltip"

function ObjLeader(props) {
	const classes = useColorStyles()
	if (props.placement != "leader") {
		return null
	}
	return (
		<Tooltip title="Leader">
			<Typography component="span" color="primary">
				<KeyboardArrowUpIcon />
			</Typography>
		</Tooltip>
	)
}

export {
	ObjLeader
}
