import React, { useState } from "react";
import { useStateValue } from '../state.js';
import { splitPath } from '../utils.js';
import { useKeywords } from '../hooks/Keywords.jsx';
import { SectionForm } from './SectionForm.jsx';

import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import CircularProgress from '@mui/material/CircularProgress';

const useStyles = makeStyles(theme => ({
        root: {
                padding: theme.spacing(3, 2),
                marginTop: theme.spacing(3),
        },
        tabContent: {
                paddingTop: theme.spacing(2),
        },
        fab: {
                marginTop: theme.spacing(2),
        },
        formcontrol: {
                margin: theme.spacing(2, 0),
        },
}))

function ResourceAdd(props) {
	const {path, data, setData} = props
	const classes = useStyles()
	const sp = splitPath(path)
	const kws = useKeywords(sp.kind)
	if (!kws) {
		return <CircularProgress />
	}
	var kinds = Object.keys(kws)

	function set(v) {
		setData({...data, keywords: v})
	}

	return (
		<React.Fragment>
                        <FormControl className={classes.formcontrol} fullWidth>
                                <Typography variant="caption" color="textSecondary">Resource Kind</Typography>
                                <Select
                                        value={data.kind ? data.kind : ""}
                                        onChange={e => setData({...data, kind: e.target.value})}
                                        inputProps={{
                                                id: 'resourceKind',
                                        }}
                                >
                                        {kinds.map((v, i) => (
                                                <MenuItem key={i} value={v}>{v}</MenuItem>
                                        ))}
                                </Select>
                        </FormControl>
			{data.kind &&
			<SectionForm kind={data.kind} kws={kws[data.kind]} data={data.keywords} setData={set} />	
			}
		</React.Fragment>
	)
}

export {
	ResourceAdd,
}
