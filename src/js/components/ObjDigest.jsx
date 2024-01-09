import React from "react";
import { useStateValue } from '../state.js';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { ObjStateList } from "./ObjStateList.jsx";
import { ObjActions } from "./ObjActions.jsx";
import { ObjScale } from "./ObjScale.jsx";

import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Tooltip from "@mui/material/Tooltip"

import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import useClasses from "../hooks/useClasses.jsx";

const styles = theme => ({
        card: {
                height: "100%",
        },
})

function Goto(props) {
	const navigate = useNavigate()
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
				onClick={() => {navigate("/object?path="+path)}}
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
	const classes = useClasses(styles)
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
