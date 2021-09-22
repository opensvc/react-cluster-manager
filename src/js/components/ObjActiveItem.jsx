import React from "react";
import { useStateValue } from '../state.js';
import { useTranslation } from 'react-i18next'

import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import {isEmpty} from "lodash";

function ObjActiveItem(props) {
	const { t, i18n } = useTranslation()
	const [{ cstat }, dispatch] = useStateValue();
	if (cstat.monitor === undefined) {
		return null
	}
	for (let node in cstat.monitor.nodes) {
		if (isEmpty(cstat.monitor.nodes[node])) {
			continue
		}

		let services = cstat.monitor.nodes[node].services
		if (services === undefined) {
			continue
		}
		let idata = services.status[props.path]
		if (idata === undefined) {
			continue
		}
		if (idata.monitor === undefined) {
			continue
		}
		if (idata.monitor.status && (idata.monitor.status.indexOf("failed") > -1)) {
			return (
				<ListItem>
					<ListItemIcon>
						<PlayArrowIcon color="error" />
					</ListItemIcon>
					<ListItemText>
						{t("Last action failed") + " (" + idata.monitor.status.replace(/ failed/, "") + ")"}
					</ListItemText>
				</ListItem>
			)
		}
		if (idata.monitor.global_expect || (idata.monitor.status != "idle")) {
			return (
				<ListItem>
					<ListItemIcon>
						<Typography className={props.className} component="span">
							<PlayArrowIcon color="primary" />
						</Typography>
					</ListItemIcon>
					<ListItemText>
						{t("Action in progress.")}
					</ListItemText>
				</ListItem>
			)
		}
	}
	return null
}

export {
	ObjActiveItem
}
