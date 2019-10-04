import React from "react";
import { useStateValue } from '../state.js';
import { useTranslation } from 'react-i18next';
import { ObjStateList } from "./ObjStateList.jsx";
import { ObjInstanceCounts } from "./ObjInstanceCounts.jsx";
import { ObjActions } from "./ObjActions.jsx";

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

const useStyles = makeStyles(theme => ({
        card: {
                height: "100%",
        },
}))

function ObjDigest(props) {
	const { path } = props
	const { t, i18n } = useTranslation()
	const [{ cstat }, dispatch] = useStateValue();
	const classes = useStyles()
	if (cstat.monitor.services[path] === undefined) {
		return null
	}
	return (
		<Card className={classes.card}>
			<CardHeader
				title={t("Object")}
				subheader={path}
				action={
					<ObjActions selected={[path]} title="" />
				}
			/>
			<CardContent>
				<Typography variant="body2" color="textSecondary" component="div">
					<ObjInstanceCounts path={path} />&nbsp;{t("instances")}
				</Typography>
				<Typography variant="body2" color="textSecondary" component="div">
					<ObjStateList path={path} />
				</Typography>
			</CardContent>
		</Card>
	)
}

export {
	ObjDigest
}
