import React, { useState } from "react";

import { useStateValue } from '../state.js';
import { parseIni } from "../utils.js";
import { useObjConfig } from "../hooks/ObjConfig.jsx";
import { TableToolbar } from "./TableToolbar.jsx"
import { ObjKeyActions } from "./ObjKeyActions.jsx"
import { KeyDecode } from "./KeyDecode.jsx"

import { makeStyles } from '@material-ui/core/styles';
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
}))

function ObjKeys(props) {
	const classes = useStyles()
	const conf = useObjConfig(props.path)
	const [selected, setSelected] = React.useState([])
	if (!conf || !conf.data) {
		return null
	}
	var confData = parseIni(conf.data)
	if (confData.data === undefined) {
		return (<div>"This configuration hosts no key yet."</div>)
	}
	const rowCount = Object.keys(confData.data).length
	function handleSelectAllClick(event) {
                if (event.target.checked) {
                        const newSelecteds = Object.keys(confData.data)
                        setSelected(newSelecteds);
                        return;
                }
                setSelected([]);
        }
	return (
		<React.Fragment>
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
						<TableCell>Key</TableCell>
						<TableCell>Type</TableCell>
						<TableCell>Value</TableCell>
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
		</React.Fragment>
	)
}

function ObjKey(props) {
	const {index, path, keyName, keyValue, selected, setSelected} = props
	var i = keyValue.indexOf(":")
	var valueType = keyValue.slice(0, i)
	var value = keyValue.slice(i+1)
	console.log(valueType, value)
	if (valueType != "literal") {
		var value = ( <KeyDecode path={path} keyName={keyName} /> )
	}
        function handleClick(event) {
                event.stopPropagation()
                var selectedIndex = -1
                for (var i=0; i<selected.length; i++) {
                        var item = selected[i]
                        if ((item.path==instance.path) && (item.node==instance.node)) {
                                selectedIndex = i
                                break
                        }
                }
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
