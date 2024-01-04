import React, { Fragment, useState } from "react";

import { useStateValue } from '../state.js';
import { useTranslation } from 'react-i18next';
import { parseIni } from "../utils.js";
import { useObjConfig } from "../hooks/ObjConfig.jsx";
import { TableToolbar } from "./TableToolbar.jsx"
import { ObjKeyActions } from "./ObjKeyActions.jsx"
import { KeyDecode } from "./KeyDecode.jsx"
import { KeyEdit } from "./KeyEdit.jsx"
import { ObjKeyAdd } from "./ObjKeyAdd.jsx"

import { makeStyles } from '@mui/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';

import FilterListIcon from '@mui/icons-material/FilterList';

const useStyles = makeStyles(theme => ({
        tableWrapper: {
                overflowX: 'auto',
        },
        wrapper: {
		marginLeft: -theme.spacing(2),
                marginRight: -theme.spacing(2),
	},
}))

function ObjKeys(props) {
	const classes = useStyles()
	const { t, i18n } = useTranslation()
	const [selected, setSelected] = React.useState([])
	var conf = useObjConfig(props.path)
	if (!conf || !conf.data) {
		return null
	}
	var confData = parseIni(conf.data)
	if (confData.data === undefined) {
		confData.data = {}
	}
	var rowCount = Object.keys(confData.data).length
	function handleSelectAllClick(event) {
                if (event.target.checked) {
                        const newSelecteds = Object.keys(confData.data)
                        setSelected(newSelecteds);
                        return;
                }
                setSelected([]);
        }
	return (
                <Card>
                        <CardHeader
                                title={t("Keys")}
                                subheader={props.path}
				action={
					<ObjKeyAdd path={props.path} />
				}
                        />
                        <CardContent>
				<div className={classes.wrapper}>
					<TableToolbar selected={selected}>
						{selected.length > 0 ? (
							<ObjKeyActions path={props.path} selected={selected} title="" />
						) : (
							<Tooltip title="Filter list">
								<IconButton aria-label="Filter list">
									<FilterListIcon />
								</IconButton>
							</Tooltip>
						)}
					</TableToolbar>
					<div className={classes.tableWrapper}>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell padding="checkbox">
										<Checkbox
											indeterminate={selected.length > 0 && selected.length < rowCount}
											checked={selected.length === rowCount}
											onChange={handleSelectAllClick}
											inputProps={{ 'aria-label': 'Select all' }}
										/>
									</TableCell>
									<TableCell>{t("Key")}</TableCell>
									<TableCell>Type</TableCell>
									<TableCell>{t("Value")}</TableCell>
									<TableCell></TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{Object.keys(confData.data).sort().map((keyName, i) => (
									<ObjKey
										key={keyName}
										index={i}
										path={props.path}
										keyValue={confData.data[keyName]}
										keyName={keyName}
										selected={selected}
										setSelected={setSelected}
									/>
								))}
							</TableBody>
						</Table>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}

function ObjKey(props) {
	const {index, path, keyName, keyValue, selected, setSelected} = props
	var i = keyValue.indexOf(":")
	var valueType = keyValue.slice(0, i)
	if (valueType == "literal") {
		var value = (
			<Fragment>
				{keyValue.slice(i+1)}
			</Fragment>
		)
	} else {
		var value = (
			<KeyDecode path={path} keyName={keyName} />
		)
	}
        function handleClick(event) {
                event.stopPropagation()
                var selectedIndex = selected.indexOf(keyName)
                let newSelected = []

                if (selectedIndex === -1) {
                        newSelected = newSelected.concat(selected, keyName);
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

        const isItemSelected = selected.indexOf(keyName) > -1
        const labelId = `nodes-checkbox-${index}`

	return (
		<TableRow>
                        <TableCell padding="checkbox" onClick={handleClick}>
                                <Checkbox
                                        checked={isItemSelected}
                                        inputProps={{ 'aria-labelledby': labelId }}
                                />
                        </TableCell>
			<TableCell>{keyName}</TableCell>
			<TableCell><span className="badge badge-secondary mr-2">{valueType}</span></TableCell>
			<TableCell>{value}</TableCell>
			<TableCell><KeyEdit path={path} keyName={keyName} /></TableCell>
		</TableRow>
	)
}

export {
	ObjKeys,
}
