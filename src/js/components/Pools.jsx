import React from "react";
import { usePoolsStatus } from "../hooks/PoolsStatus.jsx"
import { useTranslation } from 'react-i18next';
import { PoolAdd } from './PoolAdd.jsx';

import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
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
});

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
	const classes = useClasses(styles)
	const { t, i18n } = useTranslation()
	const data = usePoolsStatus()
	var lines = getLines(data)

	return (
		<Card id="pools" className={classes.root}>
                        <CardHeader
                                title={t("Pools")}
				action={
					<PoolAdd />
				}
                        />
                        <CardContent>
                                <div className={classes.wrapper}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>{t("Name")}</TableCell>
								<TableCell>Type</TableCell>
								<TableCell>Volumes</TableCell>
								<TableCell>{t("Usage")}</TableCell>
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
				</div>
			</CardContent>
		</Card>
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
