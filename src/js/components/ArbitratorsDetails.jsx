import React from "react";
import useClusterStatus from "../hooks/ClusterStatus.jsx"
import { useTranslation } from 'react-i18next';
import { ColorStyles } from "../styles.js";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
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

function ArbitratorsDetails(props) {
	const classes = useClasses(styles)
	const { t, i18n } = useTranslation()
	const { cstat } = useClusterStatus()
	var arbitrators = {}
	var arbNames = []
	var arbAddr = {}
	if (cstat.monitor === undefined) {
		return null
	}
	for (var node in cstat.monitor.nodes) {
		var ndata = cstat.monitor.nodes[node]
		if (!ndata.arbitrators) {
			continue
		}
		if (!(node in arbitrators)) {
			arbitrators[node] = {}
		}
		for (var arbitrator in ndata.arbitrators) {
			var adata = ndata.arbitrators[arbitrator]
			if (arbNames.indexOf(arbitrator) < 0) {
				arbNames.push(arbitrator)
				arbAddr[arbitrator] = adata.name
			}
			arbitrators[node][arbitrator] = adata
		}
	}

	if (!arbNames.length) {
		return null
	}
	console.log("rerender Arb")

	return (
		<Card className={classes.root}>
			<CardHeader
				title={t("Arbitrators")}
				subheader={cstat.cluster.name}
			/>
			<CardContent>
				<div className={classes.wrapper}>
					<Table>
						<TableHead>
							<TableRow className="text-secondary">
								<TableCell>Nodes</TableCell>
								{arbNames.map((an, i) => (
									<TableCell key={i} title={an}>{arbAddr[an]}</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{Object.keys(arbitrators).map((node) => (
								<ArbitratorDetails key={node} node={node} arbitrators={arbitrators[node]} />
							))}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	)
}

function ArbitratorDetails(props) {
	const classes = useClasses(ColorStyles)
	var ans = []
	var an
	for (an in props.arbitrators) {
		var adata = props.arbitrators[an]
		adata.an = an
		ans.push(adata)
	}

	return (
		<TableRow>
			<TableCell data-title="Node">{props.node}</TableCell>
			{ans.map((adata, i) => (
				<TableCell key={i} data-title={adata.name}>
					<Typography component="span" className={classes[adata.status ? "up" : "down"]}>
						{adata.status}
					</Typography>
				</TableCell>
			))}
		</TableRow>
	)
}

export default ArbitratorsDetails
