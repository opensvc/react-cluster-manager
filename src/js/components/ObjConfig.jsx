import React, { useState } from "react";

import { useStateValue } from '../state.js';
import { useObjConfig } from "../hooks/ObjConfig.jsx";
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Collapse from '@material-ui/core/Collapse';

const useStyles = makeStyles(theme => ({
        card: {
                height: "100%",
        },
	expand: {
		transform: 'rotate(0deg)',
		marginLeft: 'auto',
		transition: theme.transitions.create('transform', {
			duration: theme.transitions.duration.shortest,
		}),
	},
	expandOpen: {
		transform: 'rotate(180deg)',
	},
}))

function ObjConfigDigest(props) {
	const { path } = props
	const [{ cstat }, dispatch] = useStateValue()
        if (cstat.monitor === undefined) {
                return null
        }
	var instance = null
	for (var node in cstat.monitor.nodes) {
		instance = cstat.monitor.nodes[node].services.status[path]
		if (instance) {
			break
		}
	}
	if (!instance) {
		return null
	}
	var groups = {}
	for (var rid in instance.resources) {
		if (!rid.match(/#/)) {
			continue
		}
		var l = rid.split(/#/)
		var group = l[0]
		var name = l[1]
		if (group in groups) {
			groups[group].push(instance.resources[rid].label)
		} else {
			groups[group] = [instance.resources[rid].label]
		}
	}
	return (
		<List dense={true}>
			{Object.keys(groups).map((group, i) => {
				var data = groups[group]
				var label = (
					<ul>
						{data.map((label, j) => (
							<li key={j}>{label}</li>
						))}
					</ul>
				)
				return (
					<ListItem key={i}>
						<ListItemText
							primary={group}
							secondary={label}
						/>
					</ListItem>
				)
			})}
		</List>
	)
}

function ObjConfigFile(props) {
	const { path } = props
        const data = useObjConfig(path)

        if (!data) {
                var content = ( <CircularProgress /> )
        } else {
                var date = new Date(data.mtime * 1000)
                var content = (
                        <React.Fragment>
                                <Typography variant="caption" color="textSecondary">Last Modified {date.toLocaleString()}</Typography>
                                <pre style={{overflowX: "scroll"}}>{data.data}</pre>
                        </React.Fragment>
                )
        }

        return (
		<React.Fragment>
			{content}
		</React.Fragment>
        )
}

function ObjConfig(props) {
	const { path } = props
        const classes = useStyles()
        const { t, i18n } = useTranslation()
	const [expanded, setExpanded] = React.useState(false);

	function handleExpandClick(e) {
		setExpanded(!expanded)
	}
        return (
                <Card className={classes.card}>
                        <CardHeader
                                title={t("Configuration")}
                                subheader={path}
                        />
                        <CardContent>
				<ObjConfigDigest path={path} />
                        </CardContent>
			<CardActions disableSpacing>
				<IconButton
					className={clsx(classes.expand, {
					[classes.expandOpen]: expanded,
					})}
					onClick={handleExpandClick}
					aria-expanded={expanded}
					aria-label="show more"
				>
					<ExpandMoreIcon />
				</IconButton>
			</CardActions>
			<Collapse in={expanded} timeout="auto" unmountOnExit>
				<CardContent>
					<ObjConfigFile path={path} />
				</CardContent>
			</Collapse>
                </Card>
        )
}

export {
	ObjConfig
}
