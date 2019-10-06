import React from "react";
import { usePoolsStatus } from "../hooks/PoolsStatus.jsx"
import { useTranslation } from 'react-i18next';
import { PoolAdd } from './PoolAdd.jsx';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
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
	for (var pool in data) {
		var _data = data[pool]
		lines.push(_data)
	}
	return lines
}

function Pools(props) {
	const classes = useStyles()
	const { t, i18n } = useTranslation()
	const data = usePoolsStatus()
        function handleTitleClick(e) {
                dispatch({
                        "type": "setNav",
                        "page": "Pools",
                        "links": ["Pools"],
                })
        }
	var lines = getLines(data)

	return (
		<Card id="pools" className={classes.root}>
                        <CardHeader
                                title={t("Pools")}
                                onClick={handleTitleClick}
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
