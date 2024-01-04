import React, { useState } from "react";
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Skeleton from '@mui/material/Skeleton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const useStyles = makeStyles(theme => ({
	tableWrapper: {
                overflowX: 'auto',
		marginLeft: -theme.spacing(2),
		marginRight: -theme.spacing(2),
	},
	content: {
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

function InitiatorsLine(props) {
	return (
		<TableRow>
			<TableCell data-title="Id">{props.data.hba_id}</TableCell>
			<TableCell data-title="Type">{props.data.hba_type}</TableCell>
			<TableCell data-title="Host">{props.data.host}</TableCell>
		</TableRow>
	)
}

function NodeInitiators(props) {
	const { t, i18n } = useTranslation()
	const classes = useStyles()
	const [expanded, setExpanded] = React.useState(false);

	if (expanded) {
		var sizes = {
			xs: 12,
		}
	} else {
		var sizes = {
			xs: 12,
			sm: 6,
			md: 4,
		}
	}
	return (
		<Grid item {...sizes}>
			<Card id="Initiators" className={classes.content}>
				<CardHeader
					title={t("Initiators")}
				/>
				<CardContent>
					<InitiatorsDigest {...props} />
				</CardContent>
				<CardActions>
					<IconButton
						className={clsx(classes.expand, {
							[classes.expandOpen]: expanded,
						})}
						onClick={() => {setExpanded(!expanded)}}
						aria-expanded={expanded}
						aria-label="show more"
					>
						<ExpandMoreIcon />
					</IconButton>
				</CardActions>
				<Collapse in={expanded} timeout="auto" unmountOnExit>
					<CardContent>
						<InitiatorsTable {...props} />
					</CardContent>
				</Collapse>
			</Card>
		</Grid>
	)
}

function InitiatorsDigest(props) {
	const { t, i18n } = useTranslation()
	if (props.nodeData === undefined) {
		return <Skeleton />
	}
	if (props.nodeData.hba === undefined) {
		return <Skeleton />
	}
	var counts = {
		initiator: 0,
		iscsi: 0,
		fc: 0,
	}
	for (var data of props.nodeData.hba) {
		counts["initiator"] += 1
		try {
			counts[data.type] += 1
		} catch(e) {}
	}
	return (
		<Typography component="span">
			{counts.initiator} {t("initiators")},&nbsp;
			{counts.iscsi} iscsi,&nbsp;
			{counts.fc} fc.
		</Typography>
	)
}


function InitiatorsTable(props) {
	const classes = useStyles()
	if (props.nodeData === undefined) {
		return null
	}
	if (props.nodeData.hba === undefined) {
		return null
	}
	return (
		<Box className={classes.tableWrapper}>
			<Table>
				<TableHead>
					<TableRow className="text-secondary">
						<TableCell>Id</TableCell>
						<TableCell>Type</TableCell>
						<TableCell>Host</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{props.nodeData.hba.map((e, i) => (
						<InitiatorsLine key={i} data={e} />
					))}
				</TableBody>
			</Table>
		</Box>
	)
}

export {
	NodeInitiators,
}
