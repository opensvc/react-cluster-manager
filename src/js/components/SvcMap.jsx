import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useStateValue } from '../state.js';
import { makeStyles } from '@mui/styles';
import { ObjAvail } from "./ObjAvail.jsx"
import { splitPath } from "../utils.js";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'

const useStyles = makeStyles(theme => ({
	root: {
		height: "100%",
	},
	namespace: {
		marginBottom: theme.spacing(1),
	},
	flex: {
		display: "flex",
		flexWrap: "wrap",
	},
	item: {
		paddingRight: theme.spacing(1),
		paddingBottom: theme.spacing(1),
	},
}))

function SvcMap(props) {
	const [{ cstat }, dispatch] = useStateValue();
	const navigate = useNavigate()
	const classes = useStyles()
	const { t, i18n } = useTranslation()
	if (cstat.monitor === undefined) {
		return null
	}

	var namespaces = {}
	var paths = Object.keys(cstat.monitor.services)
	paths.sort()
	for (var path of paths) {
		var sp = splitPath(path)
		if (sp.kind != "svc") {
			continue
		}
		if (!(sp.namespace in namespaces)) {
			namespaces[sp.namespace] = []
		}
		namespaces[sp.namespace].push({...cstat.monitor.services[path], name: sp.name, path: path})
	}
	const handleClick = path => event => {
		event.stopPropagation()
		navigate({
			pathname: "/object",
			search: "?path="+path,
			state: {kind: "Services"},
		})
	}

	return (
		<Card className={classes.root}>
			<CardHeader
				title={t("Namespaces")}
				subheader={cstat.cluster.name}
			/>
			<CardContent>
				{Object.keys(namespaces).sort().map((ns, j) => (
				<div key={j}>
					<div className={classes.namespace}>
						<Typography variant="h6">
							{ns}
						</Typography>
						<div className={classes.flex}>
							{namespaces[ns].map((data, i) => (
								<div key={i} className={classes.item}>
									<Chip
										avatar={<ObjAvail avail={data.avail} overall={data.overall} />}
										label={data.name}
										component="a"
										href="#"
										clickable
										onClick={handleClick(data.path)}
									/>
								</div>
							))}
						</div>
					</div>
				</div>
				))}
			</CardContent>
		</Card>
	)
}

export default SvcMap
