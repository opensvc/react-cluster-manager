import React, { useState } from "react";

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles(theme => ({
	formcontrol: {
		margin: theme.spacing(2, 0),
	},
}))

function SectionForm(props) {
	const {kind, kws, data, setData} = props
	const classes = useStyles()
	const handleChange = kw => (e) => {
		var newData = {...data}
		newData[kw] = e.target.value
		setData(newData)
	}
	return (
		<React.Fragment>
			<FormControl className={classes.formcontrol} fullWidth>
				<TextField
					label={kind + " Name"}
					id="sectionName"
					value={data.sectionName ? data.sectionName : ""}
					onChange={handleChange("sectionName")}
				/>
			</FormControl>
			<FormControl className={classes.formcontrol} fullWidth>
				<Typography variant="caption" color="textSecondary">Type</Typography>
				<Select
					value={data.type ? data.type : ""}
					onChange={handleChange("type")}
					inputProps={{
						name: 'source',
						id: 'source',
					}}
				>
					{kws.type.candidates.map((v, i) => (
						<MenuItem key={i} value={v}>{v}</MenuItem>
					))}
				</Select>
			</FormControl>
			{data.type &&
				Object.keys(kws).map((kw, i) => (
					<Keyword key={i} kw={kw} kwData={kws[kw]} data={data} setData={setData} />
				))
			}
		</React.Fragment>
	)
}

function Keyword(props) {
	const {kw, kwData, data, setData} = props
	const classes = useStyles()
	if (kw == "type") {
		return null
	}
	if (kwData.type && data.type != kwData.type) {
		return null
	}
	const requiredError = (kwData.required && !data)
	function handleChange(e) {
		var newData = {...data}
		newData[kw] = e.target.value
		console.log("CHANGE", data, "=>", newData)
		setData(newData)
	}
	return (
		<FormControl className={classes.formcontrol} fullWidth>
			<Typography variant="caption" color="textSecondary">{kw}</Typography>
			<TextField
				autoComplete="off"
				placeholder={kwData.default ? kwData.default.toString() : ""}
				id={kw}
				value={data[kw] ? data[kw] : ""}
				onChange={handleChange}
				error={requiredError}
			/>
			<FormHelperText>{kwData.text}</FormHelperText>
			{requiredError && <FormHelperText>This keyword is required.</FormHelperText>}
		</FormControl>
	)
}

export {
	SectionForm,
}
