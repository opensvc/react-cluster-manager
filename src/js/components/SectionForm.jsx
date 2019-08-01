import React, { useState } from "react";

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from '@material-ui/core/Switch';

const useStyles = makeStyles(theme => ({
	formcontrol: {
		margin: theme.spacing(2, 0),
	},
}))

function SectionForm(props) {
	const {kind, kws, data, setData} = props
	const classes = useStyles()
	var typeKw
	for (var kw of kws) {
		if (kw.keyword == "type") {
			typeKw = kw
		}
	}
	return (
		<React.Fragment>
			<FormControl className={classes.formcontrol} fullWidth>
				<TextField
					label={kind + " Name"}
					id="sectionName"
					value={data.sectionName ? data.sectionName : ""}
					onChange={e => setData({...data, "sectionName": e.target.value})}
				/>
			</FormControl>
			{typeKw &&
			<FormControl className={classes.formcontrol} fullWidth>
				<Typography variant="caption" color="textSecondary">Type</Typography>
				<Select
					value={data.type ? data.type : ""}
					onChange={e => setData({...data, "type": e.target.value})}
					inputProps={{
						id: 'source',
					}}
				>
					{typeKw.candidates.map((v, i) => (
						<MenuItem key={i} value={v}>{v}</MenuItem>
					))}
				</Select>
			</FormControl>
			}
			<RequiredKeywords kws={kws} data={data} setData={setData} typeKw={typeKw} />
			<OptionalKeywords kws={kws} data={data} setData={setData} typeKw={typeKw} />
		</React.Fragment>
	)
}

function RequiredKeywords(props) {
	const {kws, data, setData, typeKw} = props
	if (typeKw && !data.type) {
		return null
	}
	const requiredKws = kws.filter(item => item.required)
	if (requiredKws.length == 0) {
		return null
	}
	return (
		<React.Fragment>
			<Typography component="p" variant="h5">Required</Typography>
			{requiredKws.map((kwData, i) => (
				<Keyword key={i} kwData={kwData} data={data} setData={setData} />
			))}
		</React.Fragment>
	)
}

function OptionalKeywords(props) {
	const {kws, data, setData, typeKw} = props
	if (typeKw && !data.type) {
		return null
	}
	const optionalKws = kws.filter(item => !item.required)
	if (optionalKws.length == 0) {
		return null
	}
	return (
		<React.Fragment>
			<Typography component="p" variant="h5">Optional</Typography>
			{optionalKws.map((kwData, i) => (
				<Keyword key={i} kwData={kwData} data={data} setData={setData} />
			))}
		</React.Fragment>
	)
}

function Keyword(props) {
	const {kwData, data, setData} = props
	const classes = useStyles()
	if (kwData.keyword == "type") {
		return null
	}
	if (kwData.type && (kwData.type.indexOf(data.type) < 0)) {
		return null
	}
	const requiredError = (kwData.required && !data)
	return (
		<FormControl className={classes.formcontrol} fullWidth>
			<Typography variant="caption" color="textSecondary">{kwData.keyword}</Typography>
			{kwData.convert == "boolean" &&
			<Switch
				checked={data[kwData.keyword] ? data[kwData.keyword] : kwData.default ? kwData.default : false}
				onChange={e => setData({...data, [kwData.keyword]: e.target.checked})}
				value={kwData.keyword}
				color="primary"
				inputProps={{ 'aria-label': 'primary checkbox' }}
			/>
			}
			{(kwData.convert != "boolean") && kwData.candidates &&
			<Select
				inputProps={{
					id: kwData.keyword,
				}}
				value={data[kwData.keyword] ? data[kwData.keyword] : kwData.default ? kwData.default : ""}
				onChange={e => setData({...data, [kwData.keyword]: e.target.value})}
				error={requiredError}
			>
				{kwData.candidates.map((v, i) => (
					<MenuItem key={i} value={v}>{v}</MenuItem>
				))}
			</Select>
			}
			{(kwData.convert != "boolean") && !kwData.candidates &&
			<TextField
				autoComplete="off"
				placeholder={kwData.default ? kwData.default.toString() : ""}
				id={kwData.keyword}
				value={data[kwData.keyword] ? data[kwData.keyword] : kwData.default ? kwData.default : ""}
				onChange={e => setData({...data, [kwData.keyword]: e.target.value})}
				error={requiredError}
			/>
			}
			<FormHelperText>{kwData.text}</FormHelperText>
			{requiredError && <FormHelperText>This keyword is required.</FormHelperText>}
		</FormControl>
	)
}

export {
	SectionForm,
}
