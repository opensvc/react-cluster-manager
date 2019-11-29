import React, { useState } from "react";

import { useStateValue } from '../state.js';
import { useTranslation } from 'react-i18next';
import { parseIni } from "../utils.js";
import { useObjConfig } from "../hooks/ObjConfig.jsx";
import { TableToolbar } from "./TableToolbar.jsx"
import { ObjKeyActions } from "./ObjKeyActions.jsx"
import { KeyDecode } from "./KeyDecode.jsx"
import { ObjKeyAdd } from "./ObjKeyAdd.jsx"

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';

import FilterListIcon from '@material-ui/icons/FilterList';

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
	var value = keyValue.slice(i+1)
	if (valueType != "literal") {
		var value = ( <KeyDecode path={path} keyName={keyName} /> )
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
		</TableRow>
	)
}

export {
	ObjKeys,
}
