import React from "react"
import { useTranslation } from 'react-i18next'

import WarningIcon from './WarningIcon.jsx'
import Typography from '@mui/material/Typography'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

function ObjOverallItem(props) {
	const { t, i18n } = useTranslation()
	if (props.overall != "warn") {
		return null
	}
	return (
		<ListItem>
			<ListItemIcon>
				<Typography component="span" className={props.className}>
					<WarningIcon />
				</Typography>
			</ListItemIcon>
			<ListItemText>
				{t("Overall state is {{state}}.", {state: props.overall})}
			</ListItemText>
		</ListItem>
	)
}

export {
	ObjOverallItem
}
