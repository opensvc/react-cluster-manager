import React from "react"
import { useTranslation } from "react-i18next"

import { useColorStyles } from "../styles.js"
import Typography from "@mui/material/Typography"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import Tooltip from "@mui/material/Tooltip"

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
