import React from "react";
import { useStateValue } from '../state.js';
import { apiNodeAction } from "../api.js";

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import Chip from '@material-ui/core/Chip';
import { useColorStyles } from "../styles.js";

const useStyles = makeStyles(theme => ({
        root: {
                padding: theme.spacing(3, 2),
                marginTop: theme.spacing(3),
                overflowX: 'auto',
        },
        chip: {
                margin: theme.spacing(1),
        },
}))


function Threads(props) {
	const classes = useStyles()
	const [{ cstat }, dispatch] = useStateValue();
	if (!("monitor" in cstat)) {
		return null
	}
	function handleTitleClick(e) {
		dispatch({
			type: "setNav",
			page: "Threads",
			links: ["Threads"],
		})
	}
	var threads = ["listener", "dns", "monitor", "scheduler"]
	for (var section in cstat) {
		if (section.match(/^hb#/)) {
			threads.push(section)
		}
	}
	return (
		<Paper id="threads" className={classes.root}>
			<Typography variant="h4" component="h3">
				<Link className="text-dark" href="#" onClick={handleTitleClick}>Threads</Link>
			</Typography>
			<Table>
				<TableHead>
					<TableRow className="text-secondary">
						<TableCell>Name</TableCell>
						<TableCell>State</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{threads.map((name) => (
						<Thread key={name} name={name} data={cstat[name]} />
					))}
				</TableBody>
			</Table>
		</Paper>
	)
}

function Thread(props) {
	const classes = useColorStyles()
	if (!props.data) {
		return null
	}
	return (
		<TableRow>
			<TableCell>{props.name}</TableCell>
			<TableCell>
				<Typography className={classes[props.data.state]}>
					{props.data.state}
				</Typography>
			</TableCell>
		</TableRow>
	)
}

function ThreadActions(props) {
	function handleClick(e) {
		var action = e.target.getAttribute("value")
		apiNodeAction(props.node, action, {thread_id: props.thread_id})
	}
	return (
		<div className="dropdown">
			<button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" data-boundary="window" aria-haspopup="true" aria-expanded="false"></button>
			<div className="dropdown-menu">
				<a className="dropdown-item" value="start" onClick={handleClick}>Start</a>
				<div className="dropdown-divider"></div>
				<a className="dropdown-item text-warning" value="stop" onClick={handleClick}>Stop</a>
			</div>
		</div>
	)
}


export {
	Threads,
	Thread
}
