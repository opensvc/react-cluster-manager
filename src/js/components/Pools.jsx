import React from "react";
import { usePoolsStatus } from "../hooks/PoolsStatus.jsx"
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Hidden from '@material-ui/core/Hidden';

const useStyles = makeStyles(theme => ({
        root: {
                padding: theme.spacing(3, 2),
                marginTop: theme.spacing(3),
                overflowX: 'auto',
        },
}))

function getLines(data) {
	if (!data) {
		return []
	}
	var lines = []
	for (var pool in data) {
		var _data = data[pool]
		lines.push(_data)
	}
	return lines
}

function Pools(props) {
	const classes = useStyles()
	const data = usePoolsStatus()
        function handleTitleClick(e) {
                dispatch({
                        "type": "setNav",
                        "page": "Pools",
                        "links": ["Pools"],
                })
        }
	const lines = getLines(data)

	return (
		<Paper id="nodes" className={classes.root}>
			<Typography variant="h4" component="h3">
                                <Link href="#" onClick={handleTitleClick}>Pools</Link>
                        </Typography>
                        <Table>
                                <TableHead>
                                        <TableRow>
                                                <TableCell>Name</TableCell>
                                                <TableCell>Type</TableCell>
                                                <TableCell>Volumes</TableCell>
                                                <TableCell>Usage</TableCell>
                                                <Hidden smDown>
							<TableCell>Head</TableCell>
						</Hidden>
                                        </TableRow>
                                </TableHead>
                                <TableBody>
					{lines.map((line, i) => (
						<PoolsLine key={i} index={i} data={line} />
					))}
                                </TableBody>
                        </Table>
		</Paper>
	)
}

function PoolsLine(props) {
	const {index, data} = props
	const usage = (100 * data.used / data.size).toFixed(2)
	return (
		<TableRow>
			<TableCell>{data.name}</TableCell>
			<TableCell>{data.type}</TableCell>
			<TableCell>{data.volumes.length}</TableCell>
			<TableCell>{usage}%</TableCell>
			<Hidden smDown>
				<TableCell>{data.head}</TableCell>
			</Hidden>
		</TableRow>
	)
}

export {
	Pools,
}
