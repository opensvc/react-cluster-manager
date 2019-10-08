import React from "react";
import { useHistory } from 'react-router';
import { useStateValue } from '../state.js'
import { useTranslation } from 'react-i18next';
import { useNetworksStatus } from "../hooks/NetworksStatus.jsx"
import { NetworkAdd } from "./NetworkAdd.jsx"
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
	const { t, i18n } = useTranslation()
        const data = useNetworksStatus()
	const [{}, dispatch] = useStateValue()
        var lines = getLines(data)

	return (
                <Card id="networks" className={classes.root}>
                        <CardHeader
                                title={t("Networks")}
				action={
					<NetworkAdd />
				}
                        />
                        <CardContent>
                                <div className={classes.wrapper}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>{t("Name")}</TableCell>
								<TableCell>Type</TableCell>
								<TableCell>{t("Network")}</TableCell>
								<TableCell>{t("Addresses")}</TableCell>
								<TableCell>{t("Usage")}</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{lines.map((line, i) => (
								<NetworksLine key={i} index={i} data={line} />
							))}
						</TableBody>
					</Table>
                                </div>
                        </CardContent>
                </Card>
	)
}

function NetworksLine(props) {
        const {index, data} = props
	const [{}, dispatch] = useStateValue()
	const history = useHistory()
        function handleLineClick(event) {
		event.stopPropagation()
		history.push("/network?name="+data.name)
        }
        return (
                <TableRow onClick={handleLineClick}>
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
