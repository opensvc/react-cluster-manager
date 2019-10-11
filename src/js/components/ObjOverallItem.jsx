import React from "react";
import { useTranslation } from 'react-i18next'

import WarningIcon from '@material-ui/icons/Warning';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

const useStyles = makeStyles(theme => ({
        root: {
                color: theme.status.warning,
        },
}))

function ObjOverallItem(props) {
	const classes = useStyles()
	const { t, i18n } = useTranslation()
	if (props.overall == "warn") {
		return (
			<ListItem>
				<ListItemIcon>
					<Typography component="span" className={props.className}>
						<WarningIcon className={classes.root} />
					</Typography>
				</ListItemIcon>
				<ListItemText>
					{t("Overall state is {{state}}.", {state: props.overall})}
				</ListItemText>
			</ListItem>
		)
	}
	return null
}

export {
	ObjOverallItem
}
