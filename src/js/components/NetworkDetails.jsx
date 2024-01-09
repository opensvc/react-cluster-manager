import React from "react";
import { useStateValue } from '../state.js'
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useNetworksStatus } from "../hooks/NetworksStatus.jsx"
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Hidden from '@mui/material/Hidden';
import useClasses from "../hooks/useClasses.jsx";

const styles = theme => ({
        root: {
                marginTop: theme.spacing(3),
        },
        wrapper: {
                overflowX: 'auto',
                marginLeft: -theme.spacing(2),
                marginRight: -theme.spacing(2),
        },
})

function NetworkDetails(props) {
	const loc = useLocation()
	let params = new URLSearchParams(loc.search)
	const name = params.get("name")
	const { t, i18n } = useTranslation()
	const classes = useClasses(styles)
	return (
                <Card className={classes.root}>
                        <CardHeader
                                title={t("Network Addresses")}
				subheader={name}
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
