import React from "react";
import { useStateValue } from '../state.js'
import { useTranslation } from 'react-i18next';
import { useNetworksStatus } from "../hooks/NetworksStatus.jsx"
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Hidden from '@material-ui/core/Hidden';

const useStyles = makeStyles(theme => ({
        root: {
                marginTop: theme.spacing(3),
        },
        wrapper: {
                overflowX: 'auto',
                marginLeft: -theme.spacing(2),
                marginRight: -theme.spacing(2),
        },
}))

function NetworkDetails(props) {
	const {name} = props
	const { t, i18n } = useTranslation()
	const classes = useStyles()
        function handleTitleClick(e) {
                dispatch({
                        "type": "setNav",
                        "page": name,
                        "links": ["Network", name],
                })
        }
	return (
                <Card className={classes.root}>
                        <CardHeader
                                title={t("Network Addresses")}
				subheader={name}
                                onClick={handleTitleClick}
                        />
                        <CardContent>
                                <div className={classes.wrapper}>
					<NetworkAddrs name={name} />
				</div>
                        </CardContent>
		</Card>
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
