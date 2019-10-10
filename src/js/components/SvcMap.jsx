import React, { useState } from "react";
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useStateValue } from '../state.js';
import { makeStyles } from '@material-ui/core/styles';
import { ObjAvail } from "./ObjAvail.jsx"
import { splitPath } from "../utils.js";
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography'
import Chip from '@material-ui/core/Chip'

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
	const history = useHistory()
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
		history.push({
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

export {
	SvcMap,
}
