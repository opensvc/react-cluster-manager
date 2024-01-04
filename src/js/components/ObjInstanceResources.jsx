import React from "react"
import useClusterStatus from "../hooks/ClusterStatus.jsx"
import useUser from "../hooks/User.jsx"
import ObjInstanceResourceFlags from "./ObjInstanceResourceFlags.jsx"
import { apiGetAny } from "../api.js"
import { useTranslation } from "react-i18next"
import { splitPath } from "../utils.js"
import { ObjAvail } from "./ObjAvail.jsx"
import { ObjProvisioned } from "./ObjProvisioned.jsx"
import { ObjInstanceResourceActions } from "./ObjInstanceResourceActions.jsx"
import { TableToolbar } from "./TableToolbar.jsx"
import { useObjConfig } from "../hooks/ObjConfig.jsx"
import { useColorStyles } from "../styles.js"

import clsx from "clsx"
import { makeStyles } from "@mui/styles"
import Grid from "@mui/material/Grid"
import Card from "@mui/material/Card"
import CardHeader from "@mui/material/CardHeader"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import Table from "@mui/material/Table"
import TableHead from "@mui/material/TableHead"
import TableBody from "@mui/material/TableBody"
import TableRow from "@mui/material/TableRow"
import TableCell from "@mui/material/TableCell"
import Tooltip from "@mui/material/Tooltip"
import IconButton from "@mui/material/IconButton"
import Checkbox from "@mui/material/Checkbox"

import OpenInBrowserIcon from "@mui/icons-material/OpenInBrowser"

const useStyles = makeStyles(theme => ({
        tableWrapper: {
                overflowX: "auto",
        },
	iconText: {
		display: "flex",
	},
	card: {
		height: "100%",
	},
	content: {
		margin: -theme.spacing(2),
	},
	grow: {
		flexGrow: "1",
	}
}))

function ObjInstanceResourceEnter(props) {
	const { path, rid } = props
	const { auth } = useUser()
	const { t } = useTranslation()
	if (!rid.match(/^container#/)) {
		return null
	}
	function handleClick(e) {
		apiGetAny("/object_enter", {path: path, rid: rid}, ($) => {
			window.open($.data.url, "_blank")
		}, auth)
	}
	return (
		<Tooltip title={t("Enter container")}>
			<IconButton
				onClick={handleClick}
			>
				<OpenInBrowserIcon />
			</IconButton>
		</Tooltip>
	)
}

function ObjInstanceResources(props) {
	//
	// props.path
	// props.node
	//
	const { cstat } = useClusterStatus()
	const { t, i18n } = useTranslation()
	const classes = useStyles()
	const [selected, setSelected] = React.useState([])

	if (cstat.monitor === undefined) {
		return null
	}
	const sp = splitPath(props.path)
	try {
		var rdata = cstat.monitor.nodes[props.node].services.status[props.path].resources
	} catch(e) {
		var rdata = {}
	}

	var rowCount = Object.keys(rdata).length

        function handleSelectAllClick(event) {
                if (event.target.checked) {
                        const newSelecteds = Object.keys(rdata)
                        setSelected(newSelecteds);
                        return;
                }
                setSelected([]);
        }

	return (
		<Card className={classes.card}>
			<CardHeader
				title={t("Resources")}
				subheader={props.path+"@"+props.node}
				action={
					<TableToolbar selected={selected}>
						{(selected.length > 0) && <ObjInstanceResourceActions path={props.path} node={props.node} rids={selected} title="" />}
					</TableToolbar>
				}
			/>
			<CardContent className={classes.content}>
				<div style={{overflowX: "auto"}}>
					<Table>
						<TableHead>
							<TableRow className="text-secondary">
								<TableCell padding="checkbox">
									<Checkbox
										indeterminate={selected.length > 0 && selected.length < rowCount}
										checked={selected.length === rowCount}
										onChange={handleSelectAllClick}
										inputProps={{ 'aria-label': 'Select all' }}
									/>
								</TableCell>
								<TableCell>Id</TableCell>
								<TableCell>{t("Availability")}</TableCell>
								<TableCell>Flags</TableCell>
								<TableCell>Desc</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{Object.keys(rdata).sort().map((rid, i) => (
								<ObjInstanceResourceLine
									key={i}
									index={i}
									rid={rid}
									node={props.node}
									path={props.path}
									selected={selected}
									setSelected={setSelected}
									sp={sp}
								/>
							))}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	)
}

function ObjInstanceResourceLine(props) {
	const { cstat } = useClusterStatus()
	const { user } = useUser()
	const {index, node, path, rid, selected, setSelected, sp} = props
	const classes = useStyles()
	if (cstat.monitor === undefined) {
		return null
	}
	const idata = cstat.monitor.nodes[node].services.status[path]
	const rdata = idata.resources[rid]
	if (!rdata.status) {
		return null
	}
        function handleClick(event) {
                event.stopPropagation()
                var selectedIndex = selected.indexOf(rid)
                let newSelected = []

                if (selectedIndex === -1) {
                        newSelected = newSelected.concat(selected, rid);
                } else if (selectedIndex === 0) {
                        newSelected = newSelected.concat(selected.slice(1));
                } else if (selectedIndex === selected.length - 1) {
                        newSelected = newSelected.concat(selected.slice(0, -1));
                } else if (selectedIndex > 0) {
                        newSelected = newSelected.concat(
                                selected.slice(0, selectedIndex),
                                selected.slice(selectedIndex + 1),
                        );
                }
                setSelected(newSelected);
        }
        const isItemSelected = selected.indexOf(rid) > -1
        const labelId = `rid-checkbox-${index}`
	return (
		<TableRow>
                        <TableCell padding="checkbox" onClick={handleClick}>
                                <Checkbox
                                        checked={isItemSelected}
                                        inputProps={{ 'aria-labelledby': labelId }}
                                />
                        </TableCell>
			<TableCell>
				<Grid container direction="row" alignItems="center">
					<Grid item className={classes.grow}>
						<Typography component="div" noWrap className={classes.iconText}>
							{rid}
						</Typography>
					</Grid>
					<Grid item>
						<ObjInstanceResourceEnter path={path} rid={rid} />
					</Grid>
				</Grid>
			</TableCell>
			<TableCell><ObjAvail avail={rdata.status} /></TableCell>
			<TableCell><ObjInstanceResourceFlags rid={rid} data={rdata} idata={idata} /></TableCell>
			<TableCell><ObjInstanceResourceDesc data={rdata} /></TableCell>
		</TableRow>
	)
}

function ObjInstanceResourceDesc(props) {
	const {data} = props
	const classes = useColorStyles()
	var log = []
	if (data.log) {
		for (var i=0; i<data.log.length; i++) {
			var line = data.log[i]
			if (line.match(/^warn:/)) {
				var color = "warn"
			} else if (line.match(/^error:/)) {
				var color = "error"
			} else {
				var color = "n/a"
			}
			log.push((
				<Typography key={i} component="div" variant="caption" className={clsx(props.className, classes[color])}>
					{line}
				</Typography>
			))
		}
	}
	return (
		<React.Fragment>
			{data.label}
			{log}
		</React.Fragment>
	)
}

export {
	ObjInstanceResources,
}
