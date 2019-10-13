import React from "react"
import { useTranslation } from 'react-i18next'

import WarningIcon from './WarningIcon.jsx'
import Typography from '@material-ui/core/Typography'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

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
