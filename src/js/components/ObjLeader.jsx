import React from "react"
import { useTranslation } from "react-i18next"

import { ColorStyles } from "../styles.js"
import Typography from "@mui/material/Typography"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import Tooltip from "@mui/material/Tooltip"
import useClasses from "../hooks/useClasses.jsx";

function ObjLeader(props) {
	const classes = useClasses(ColorStyles)
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
