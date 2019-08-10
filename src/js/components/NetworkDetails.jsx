import React from "react";
import { useStateValue } from '../state.js'
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

function NetworkDetails(props) {
	const {name} = props
	const classes = useStyles()
        function handleTitleClick(e) {
                dispatch({
                        "type": "setNav",
                        "page": name,
                        "links": ["Network", name],
                })
        }
	return (
		<Paper id="nodes" className={classes.root}>
			<Typography variant="h4" component="h3">
                                <Link href="#" onClick={handleTitleClick}>{name}</Link>
                        </Typography>
			<NetworkAddrs name={name} />
		</Paper>
	)
}

function NetworkAddrs(props) {
	const {name} = props
        const data = useNetworksStatus()
	const [{}, dispatch] = useStateValue()
	if (!data) {
		return null
	}
        var lines = data[name].ips

	return (
		<React.Fragment>
			<Typography variant="h5" component="h3">
                                Addresses
                        </Typography>
                        <Table>
                                <TableHead>
                                        <TableRow>
                                                <TableCell>Address</TableCell>
                                                <TableCell>Node</TableCell>
						<TableCell>Service</TableCell>
                                                <TableCell>Resource</TableCell>
                                        </TableRow>
                                </TableHead>
                                <TableBody>
                                        {lines.map((line, i) => (
                                                <NetworksLine key={i} index={i} data={line} />
                                        ))}
                                </TableBody>
                        </Table>
		</React.Fragment>
	)
}

function NetworksLine(props) {
        const {index, data} = props
	const [{}, dispatch] = useStateValue()
        function handleLineClick(event) {
		event.stopPropagation()
                dispatch({
                        "type": "setNav",
                        "page": props.name,
                        "links": ["Networks", props.name]
                })
        }
        return (
                <TableRow>
                        <TableCell>{data.ip}</TableCell>
                        <TableCell>{data.node}</TableCell>
                        <TableCell>{data.path}</TableCell>
                        <TableCell>{data.rid}</TableCell>
                </TableRow>
        )
}

export {
	NetworkDetails,
}
