import React from "react";
import { useStateValue } from '../state.js';
import { useTranslation } from 'react-i18next';
import { useLocation, useHistory } from 'react-router-dom';
import { ObjStateList } from "./ObjStateList.jsx";
import { ObjActions } from "./ObjActions.jsx";
import { ObjScale } from "./ObjScale.jsx";

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from "@material-ui/core/Tooltip"

import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';

const useStyles = makeStyles(theme => ({
        card: {
                height: "100%",
        },
}))

function Goto(props) {
	const history = useHistory()
	const loc = useLocation()
	const { t } = useTranslation()
	const { path } = props
	if (loc.pathname == "/object") {
		return null
	}
	return (
		<Tooltip title={t("Go to object")}>
			<IconButton
				aria-label="Go to object"
				aria-haspopup={true}
				onClick={() => {history.push("/object?path="+path)}}
			>
				<SubdirectoryArrowRightIcon />
			</IconButton>
		</Tooltip>
	)
}

function ObjDigest(props) {
	const { path } = props
	const { t, i18n } = useTranslation()
	const [{ cstat }, dispatch] = useStateValue();
	const classes = useStyles()
	if (!cstat.monitor) {
		return null
	}
	if (cstat.monitor.services[path] === undefined) {
		return null
	}
	return (
		<Card className={classes.card}>
			<CardHeader
				title={t("Object")}
				subheader={path}
				action={
					<React.Fragment>
						<Goto path={path} />
						<ObjScale path={path} title="" />
						<ObjActions selected={[path]} title="" />
					</React.Fragment>
				}
			/>
			<CardContent>
				<ObjStateList path={path} />
			</CardContent>
		</Card>
	)
}

export {
	ObjDigest
}
