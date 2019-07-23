import React from "react";
import { useStateValue } from '../state.js';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';

const useStyles = makeStyles(theme => ({
	root: {
		padding: theme.spacing(3, 2),
		marginTop: theme.spacing(3),
	},
}))

function User(props) {
	const [{ user }, dispatch] = useStateValue();
	const classes = useStyles()

	if (!user) {
		return (
			<div>No user data</div>
		)
	}
	return (
		<Paper className={classes.root}>
			<Typography variant="h5" component="h3">
				{user.name}
			</Typography>
			<Typography component="p">
				Authenticated via <strong>{user.auth}</strong>
			</Typography>
			<br />
			<Typography variant="h5" component="h3">
				Granted
			</Typography>
			<Table>
				<TableHead>
					<TableRow className="text-secondary">
						<TableCell>Role</TableCell>
						<TableCell>Namespaces</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{Object.keys(user.grant).map((g) => (
						<GrantLine key={g} namespaces={user.grant[g]} role={g} />
					))}
				</TableBody>
			</Table>
		</Paper>
	)
}

function GrantLine(props) {
	if (!props.namespaces) {
		var ns = ""
	} else {
		var ns = props.namespaces.join(", ")
	}
	return (
		<TableRow>
			<TableCell>{props.role}</TableCell>
			<TableCell>{ns}</TableCell>
		</TableRow>
	)
}

export {
	User
}
