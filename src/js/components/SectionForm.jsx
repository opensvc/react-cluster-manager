import React, { useState } from "react"
import { useTranslation } from 'react-i18next'
import { getBool } from "../utils.js"
import NodeSelector from "./NodeSelector.jsx"
import SizeInput from "./SizeInput.jsx"
import JsonInput from "./JsonInput.jsx"
import clsx from "clsx"
import Typography from "@mui/material/Typography"
import FormControl from "@mui/material/FormControl"
import FormHelperText from "@mui/material/FormHelperText"
import Select from "@mui/material/Select"
import TextField from "@mui/material/TextField"
import MenuItem from "@mui/material/MenuItem"
import Switch from "@mui/material/Switch"
import Slider from "@mui/material/Slider"
import Chip from "@mui/material/Chip"
import Grid from "@mui/material/Grid"
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useClasses from "../hooks/useClasses.jsx";


const useStyles = theme => ({
	formcontrol: {
		margin: theme.spacing(2, 0),
	},
	kw: {
		fontFamily: "monospace",
		color: theme.palette.primary.main,
	},
	cmd: {
		fontFamily: "monospace",
		color: theme.palette.primary.main,
	},
	code: {
		fontFamily: "monospace",
		fontWeight: "bold",
	},
	helper: {
		wordBreak: "break-word",
	},
	convert: {
		marginLeft: "auto",
	},
        expand: {
                transform: 'rotate(0deg)',
                marginLeft: 'auto',
                transition: theme.transitions.create('transform', {
                        duration: theme.transitions.duration.shortest,
                }),
        },
        expandOpen: {
                transform: 'rotate(180deg)',
        },
})

function formatKeywordText(text) {
	const classes = useClasses(useStyles)
        const re = RegExp(":cmd:`(.*?)`|:kw:`(.*?)`|:opt:`(.*?)`|:c-.*:`(.*?)`|``(.*?)``")
	if (text === undefined) {
		return text
	}
	var parts = text.split(re)
	for (var i = 1; i < parts.length; i += 4) {
		if (parts[i]) {
			parts[i] = <span className={classes.cmd} key={i}>{parts[i]}</span>
		} else if (parts[i+1]) {
			parts[i+1] = <span className={classes.kw} key={i+1}>{parts[i+1]}</span>
		} else if (parts[i+2]) {
			parts[i+2] = <span className={classes.code} key={i+2}>{parts[i+2]}</span>
		}
	}
	return <React.Fragment>{parts}</React.Fragment>
}

function SectionForm(props) {
	const {kind, kws, data, setData, optionalTitle, requiredTitle, optionalExpanded} = props
	const classes = useClasses(useStyles)
	var typeKw
	for (var kw of kws) {
		if (kw.keyword == "type") {
			typeKw = kw
		}
	}
	return (
		<React.Fragment>
			{(["DEFAULT", "data", "env"].indexOf(kind) < 0) &&
			<FormControl className={classes.formcontrol} fullWidth>
				<TextField
					label={kind + " Name"}
					id="sectionName"
					value={data.sectionName ? data.sectionName : ""}
					onChange={e => setData({...data, "sectionName": e.target.value})}
				/>
			</FormControl>
			}
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
			<RequiredKeywords title={requiredTitle} kws={kws} data={data} setData={setData} typeKw={typeKw} />
			<OptionalKeywords title={optionalTitle} kws={kws} data={data} setData={setData} typeKw={typeKw} optionalExpanded={optionalExpanded} />
		</React.Fragment>
	)
}

function RequiredKeywords(props) {
	const { t, i18n } = useTranslation()
	const {title, kws, data, setData, typeKw} = props
	if (typeKw && !data.type) {
		return null
	}
	const requiredKws = kws.filter(item => item.required)
	var _title = title ? title : t("Required")
	if (requiredKws.length == 0) {
		return null
	}
	return (
		<React.Fragment>
			<Typography component="p" variant="h5">
				{_title} ({requiredKws.length})
			</Typography>
			{requiredKws.map((kwData, i) => (
				<Keyword key={i} kwData={kwData} data={data} setData={setData} />
			))}
		</React.Fragment>
	)
}

function OptionalKeywords(props) {
	const {title, kws, data, setData, typeKw, optionalExpanded} = props
	const { t, i18n } = useTranslation()
	const [expanded, setExpanded] = useState(optionalExpanded !== undefined ? optionalExpanded : false)
	const classes = useClasses(useStyles)

        function handleExpandClick(e) {
                setExpanded(!expanded)
        }

	if (typeKw && !data.type) {
		return null
	}
	var _title = title ? title : t("Optional")
	const optionalKws = kws.filter(item => !item.required)
	if (optionalKws.length == 0) {
		return null
	}
	return (
		<React.Fragment>
			<Grid container>
				<Grid item>
					<Typography component="p" variant="h5">
						{_title} ({optionalKws.length})
					</Typography>
				</Grid>
				<Grid item className={classes.convert}>
					<IconButton
						className={clsx(classes.expand, {[classes.expandOpen]: expanded})}
						onClick={handleExpandClick}
						aria-expanded={expanded}
						aria-label="show more"
					>
						<ExpandMoreIcon />
					</IconButton>
				</Grid>
			</Grid>
                        <Collapse in={expanded} timeout="auto" unmountOnExit>
				{optionalKws.map((kwData, i) => (
					<Keyword key={i} kwData={kwData} data={data} setData={setData} />
				))}
                        </Collapse>
		</React.Fragment>
	)
}

function Keyword(props) {
	const {kwData, data, setData} = props
	const classes = useClasses(useStyles)
	if (kwData.keyword == "type") {
		return null
	}
	if (kwData.type && (kwData.type.indexOf(data.type) < 0)) {
		return null
	}
	const requiredError = (kwData.required && !data)

	if (kwData.convert == "boolean") {
		var el = (
			<Switch
				checked={(data[kwData.keyword] !== undefined) ? getBool(data[kwData.keyword]) : kwData.default ? kwData.default : false}
				onChange={e => setData({...data, [kwData.keyword]: e.target.checked})}
				value={kwData.keyword}
				color="primary"
				inputProps={{ 'aria-label': 'primary checkbox' }}
			/>
		)
	} else if (kwData.convert == "dict") {
		var el = (
			<JsonInput setVal={(v)=>setData({...data, [kwData.keyword]: v})} val={data[kwData.keyword]} />
		)
	} else if (kwData.convert == "node_selector") {
		var el = (
			<NodeSelector
				setVal={(v)=>setData({...data, [kwData.keyword]: v})}
				val={data[kwData.keyword]}
				defaultValue={kwData.default ? kwData.default : ""}
				keyword={kwData.keyword}
				requiredError={requiredError}
			/>
		)
	} else if (kwData.convert == "size") {
		var el = (
			<SizeInput setVal={(v)=>setData({...data, [kwData.keyword]: v})} val={data[kwData.keyword]} />
		)
	} else if (kwData.convert == "tristate") {
		const marks = [
			{
				value: 0,
				label: 'False',
				realValue: false,
			},
			{
				value: 1,
				label: 'Ignore',
				realValue: null,
			},
			{
				value: 2,
				label: 'True',
				realValue: true,
			},
		]
		function getMarkByRealValue(value) {
			var idx = marks.findIndex(mark => mark.realValue === value)
			if (idx < 0) {
				return marks[1]
			}
			return marks[idx];
		}
		function getMark(value) {
			var idx = marks.findIndex(mark => mark.value === value)
			if (idx < 0) {
				return marks[1]
			}
			return marks[idx];
		}
		var el = (
			<Slider
				defaultValue={getMarkByRealValue(kwData.default).value}
				valueLabelFormat={v => getMark(v).label}
				aria-labelledby="discrete-slider-restrict"
				step={1}
				min={0}
				max={2}
				valueLabelDisplay="off"
				marks={marks}
				onChange={(e, v) => setData({...data, [kwData.keyword]: getMark(v).realValue})}
			/>
		)
	} else if (kwData.candidates) {
		var el = (
			<Select
				inputProps={{
					id: kwData.keyword,
				}}
				value={data[kwData.keyword] ? data[kwData.keyword] : kwData.default ? kwData.default : ""}
				onChange={e => setData({...data, [kwData.keyword]: e.target.value})}
				error={requiredError}
			>
				{kwData.candidates.map((v, i) => (
					<MenuItem key={i} value={v}>{v ? v : "None"}</MenuItem>
				))}
			</Select>
		)
	} else {
		var el = (
			<TextField
				autoComplete="off"
				placeholder={kwData.default ? kwData.default.toString() : ""}
				id={kwData.keyword}
				value={data[kwData.keyword] ? data[kwData.keyword] : kwData.default ? kwData.default : ""}
				onChange={e => setData({...data, [kwData.keyword]: e.target.value})}
				error={requiredError}
				type={kwData.convert == "integer" ? "number" : "text"}
			/>
		)
	}


	return (
		<FormControl className={classes.formcontrol} fullWidth>
			<Typography variant="h6">
				<Grid container>
					<Grid item>
						{kwData.keyword}
						{kwData.required &&
						<Typography variant="h6" component="span" color="primary">&nbsp;*</Typography>
						}
					</Grid>
					<Grid item className={classes.convert}>
						<Chip
							size="small"
							label={kwData.convert}
						/>
					</Grid>
				</Grid>
			</Typography>
			{el}
			<FormHelperText className={classes.helper}>{formatKeywordText(kwData.text)}</FormHelperText>
			{requiredError && <FormHelperText className={classes.helper}>This keyword is required.</FormHelperText>}
		</FormControl>
	)
}

export {
	SectionForm,
}
