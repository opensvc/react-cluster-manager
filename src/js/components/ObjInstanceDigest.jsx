import React from "react";
import { useStateValue } from '../state.js';
import { useTranslation } from 'react-i18next';
import { ObjInstanceStateList } from "./ObjInstanceStateList.jsx";
import { ObjInstanceActions } from "./ObjInstanceActions.jsx";

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

function ObjInstanceDigest(props) {
	const { t, i18n } = useTranslation()
	const [{ cstat }, dispatch] = useStateValue();
	const classes = useStyles()
	var instance = props.path+"@"+props.node
	return (
		<Card className={classes.card}>
			<CardHeader
				title={t("Instance")}
				subheader={instance}
				action={
					<ObjInstanceActions selected={[{node: props.node, path: props.path}]} title="" />
				}
			/>
			<CardContent>
				<Typography variant="body2" color="textSecondary" component="div">
					<ObjInstanceStateList node={props.node} path={props.path} />
				</Typography>
			</CardContent>
		</Card>
	)
}

export {
	ObjInstanceDigest
}
