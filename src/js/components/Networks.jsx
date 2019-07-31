import React from "react";
import { useNetworksStatus } from "../hooks/NetworksStatus.jsx"
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
        for (var name in data) {
                var _data = data[name]
		_data.name = name
                lines.push(_data)
        }
        return lines
}

function Networks(props) {
	const classes = useStyles()
        const data = useNetworksStatus()
        function handleTitleClick(e) {
                dispatch({
                        "type": "setNav",
                        "page": "Networks",
                        "links": ["Networks"],
                })
        }
        var lines = getLines(data)

	return (
		<Paper id="nodes" className={classes.root}>
			<Typography variant="h4" component="h3">
                                <Link href="#" onClick={handleTitleClick}>Networks</Link>
                        </Typography>
                        <Table>
                                <TableHead>
                                        <TableRow>
                                                <TableCell>Name</TableCell>
                                                <TableCell>Type</TableCell>
						<TableCell>Network</TableCell>
                                                <TableCell>Addresses</TableCell>
                                                <TableCell>Usage</TableCell>
                                        </TableRow>
                                </TableHead>
                                <TableBody>
                                        {lines.map((line, i) => (
                                                <NetworksLine key={i} index={i} data={line} />
                                        ))}
                                </TableBody>
                        </Table>
		</Paper>
	)
}

function NetworksLine(props) {
        const {index, data} = props
        return (
                <TableRow>
                        <TableCell>{data.name}</TableCell>
                        <TableCell>{data.type}</TableCell>
                        <TableCell>{data.network}</TableCell>
                        <TableCell>{data.used}</TableCell>
                        <TableCell>{data.pct.toFixed(2)}%</TableCell>
                </TableRow>
        )
}

export {
	Networks,
}
