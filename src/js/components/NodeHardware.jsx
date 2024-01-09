import React, { useState } from "react";
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

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
import useClasses from "../hooks/useClasses.jsx";

const styles = theme => ({
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
})

function HardwareLine(props) {
	return (
		<TableRow>
			<TableCell data-title="Type">{props.data.type}</TableCell>
			<TableCell data-title="Path">{props.data.path}</TableCell>
			<TableCell data-title="Class">{props.data.class}</TableCell>
			<TableCell data-title="Driver">{props.data.driver}</TableCell>
			<TableCell data-title="Description"  style={{"flexBasis": "100%"}} >{props.data.description}</TableCell>
		</TableRow>
	)
}

function NodeHardware(props) {
	const classes = useClasses(styles)
	const { t, i18n } = useTranslation()
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
			<Card id="Hardware" className={classes.content}>
				<CardHeader
					title={t("Hardware")}
				/>
				<CardContent>
					<HardwareDigest {...props} />
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
						<HardwareTable {...props} />
					</CardContent>
				</Collapse>
			</Card>
		</Grid>
	)
}

function HardwareDigest(props) {
	const { t, i18n } = useTranslation()
	if (props.nodeData === undefined) {
		return <Skeleton />
	}
	if (props.nodeData.hardware === undefined) {
		return <Skeleton />
	}
	var counts = {
		components: 0,
	}
	for (var data of props.nodeData.hardware) {
		counts["components"] += 1
	}
	return (
		<Typography component="span">
			{counts.components} {t("components")}.
		</Typography>
	)
}

function HardwareTable(props) {
	const classes = useClasses(styles)
	const { t, i18n } = useTranslation()
	if (props.nodeData === undefined) {
		return null
	}
	if (props.nodeData.hardware === undefined) {
		return null
	}
	return (
		<Box className={classes.tableWrapper}>
			<Table>
				<TableHead>
					<TableRow className="text-secondary">
						<TableCell>Type</TableCell>
						<TableCell>Path</TableCell>
						<TableCell>Class</TableCell>
						<TableCell>Driver</TableCell>
						<TableCell>Description</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{props.nodeData.hardware.map((e, i) => (
						<HardwareLine key={i} data={e} />
					))}
				</TableBody>
			</Table>
		</Box>
	)
}

export {
	NodeHardware,
}
