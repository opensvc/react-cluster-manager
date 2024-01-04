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

function NetworkInterface(props) {
	return props.data.map((e, i) => (
		<NetworkLine key={props.mac+"-"+i} mac={props.mac} data={e} />
	))
}

function NetworkLine(props) {
	return (
		<TableRow>
			<TableCell data-title="Interface" style={{"flexBasis": "11rem"}}>{props.data.intf}</TableCell>
			<TableCell data-title="L2 Address" style={{"flexBasis": "11rem"}}>{props.mac}</TableCell>
			<TableCell data-title="L3 Address" style={{"flexBasis": "11rem"}}>{props.data.addr}</TableCell>
			<TableCell data-title="L3 Mask" style={{"flexBasis": "11rem"}}>{props.data.mask}</TableCell>
		</TableRow>
	)
}

function NodeNetwork(props) {
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
			<Card id="Network" className={classes.content}>
				<CardHeader
					title={t("Network")}
				/>
				<CardContent>
					<NetworkDigest {...props} />
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
						<NetworkTable {...props} />
					</CardContent>
				</Collapse>
			</Card>
		</Grid>
	)
}

function NetworkDigest(props) {
	const { t, i18n } = useTranslation()
	if (props.nodeData === undefined) {
		return <Skeleton />
	}
	if (props.nodeData.lan === undefined) {
		return <Skeleton />
	}
	var counts = {
		mac: 0,
		ipv4: 0,
		ipv6: 0,
	}
	for (var mac in props.nodeData.lan) {
		counts["mac"] += 1
		for (var data of props.nodeData.lan[mac]) {
			counts[data.type] += 1
		}
	}
	return (
		<Typography component="span">
			{counts.mac} {t("interfaces")},&nbsp;
			{counts.ipv4} ipv4,&nbsp;
			{counts.ipv6} ipv6.
		</Typography>
	)
}

function NetworkTable(props) {
	const classes = useStyles()
	if (props.nodeData === undefined) {
		return null
	}
	if (props.nodeData.lan === undefined) {
		return null
	}
	return (
		<Box className={classes.tableWrapper}>
			<Table>
				<TableHead>
					<TableRow className="text-secondary">
						<TableCell>Interface</TableCell>
						<TableCell>L2 Address</TableCell>
						<TableCell>L3 Address</TableCell>
						<TableCell>L3 Mask</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{Object.keys(props.nodeData.lan).map((mac) => (
						<NetworkInterface key={mac} mac={mac} data={props.nodeData.lan[mac]} />
					))}
				</TableBody>
			</Table>
		</Box>
	)
}

export {
	NodeNetwork,
}
