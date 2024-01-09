import React from "react";
import { useStateValue } from '../state.js';
import { useTranslation } from 'react-i18next';
import { ObjInstanceStateList } from "./ObjInstanceStateList.jsx";
import { ObjInstanceActions } from "./ObjInstanceActions.jsx";

import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import useClasses from "../hooks/useClasses.jsx";

const useStyles = theme => ({
        card: {
                height: "100%",
        },
})

function ObjInstanceDigest(props) {
	const { t, i18n } = useTranslation()
	const [{ cstat }, dispatch] = useStateValue();
	const classes = useClasses(useStyles)
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
				<ObjInstanceStateList node={props.node} path={props.path} />
			</CardContent>
		</Card>
	)
}

export {
	ObjInstanceDigest
}
